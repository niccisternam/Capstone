import nodemailer, { type Transporter } from "nodemailer";
import { loginCodeTemplate } from "./templates/login-code.template.js";
import { passwordRecoveryTemplate } from "./templates/password-recovery.template.js";
import type {
  PasswordRecoveryLinkEmail,
  VerificationCodeEmail,
  VerificationEmailSender,
} from "./verification-email.sender.js";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}

export class NodemailerVerificationEmailSender implements VerificationEmailSender {
  private readonly transporter: Transporter;

  constructor(private readonly config: SmtpConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.password },
    });
  }

  sendLoginVerificationCode(email: VerificationCodeEmail): Promise<void> {
    return this.send(
      email.recipient,
      loginCodeTemplate(email.code, email.expiresInMinutes),
    );
  }

  sendPasswordRecoveryLink(email: PasswordRecoveryLinkEmail): Promise<void> {
    return this.send(
      email.recipient,
      passwordRecoveryTemplate(
        email.userName,
        email.recoveryUrl,
        email.expiresInMinutes,
      ),
    );
  }

  private async send(
    recipient: string,
    message: { subject: string; text: string; html?: string },
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.config.from,
        to: recipient,
        subject: message.subject,
        text: message.text,
        html: message.html,
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
          event: "smtp_delivery_failed",
          errorType: smtpError.name ?? "Error",
          smtpCode: smtpError.code ?? null,
          smtpCommand: smtpError.command ?? null,
        }),
      );
      throw error;
    }
  }
}
