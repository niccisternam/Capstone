import nodemailer, { type Transporter } from "nodemailer";
import type { SmtpConfig } from "../../shared/email/nodemailer-verification-email.sender.js";
import { accountApprovedTemplate } from "../../shared/email/templates/account-approved.template.js";
import { accountRejectedTemplate } from "../../shared/email/templates/account-rejected.template.js";
import type {
  AccountEmailSender,
  ApprovedAccountEmail,
  RejectedAccountEmail,
} from "./account-email.sender.js";

export class NodemailerAccountEmailSender implements AccountEmailSender {
  private readonly transporter: Transporter;

  constructor(private readonly config: SmtpConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.password },
    });
  }

  sendApprovedAccount(email: ApprovedAccountEmail): Promise<void> {
    return this.send(
      email.recipient,
      accountApprovedTemplate(email.name, email.temporaryPassword),
    );
  }

  sendRejectedAccount(email: RejectedAccountEmail): Promise<void> {
    return this.send(
      email.recipient,
      accountRejectedTemplate(email.name, email.reason),
    );
  }

  private async send(
    recipient: string,
    message: { subject: string; text: string },
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.config.from,
        to: recipient,
        subject: message.subject,
        text: message.text,
      });
    } catch (error) {
      const smtpError = error as {
        name?: string;
        code?: string;
        command?: string;
      };
      console.error(
        JSON.stringify({
          level: "error",
          event: "account_email_delivery_failed",
          errorType: smtpError.name ?? "Error",
          smtpCode: smtpError.code ?? null,
          smtpCommand: smtpError.command ?? null,
        }),
      );
      throw error;
    }
  }
}
