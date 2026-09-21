export interface VerificationCodeEmail {
  recipient: string;
  code: string;
  expiresInMinutes: number;
}

export interface PasswordRecoveryLinkEmail {
  recipient: string;
  userName: string;
  recoveryUrl: string;
  expiresInMinutes: number;
}

export interface VerificationEmailSender {
  sendLoginVerificationCode(email: VerificationCodeEmail): Promise<void>;
  sendPasswordRecoveryLink(email: PasswordRecoveryLinkEmail): Promise<void>;
}

export class UnavailableVerificationEmailSender implements VerificationEmailSender {
  private unavailable(): never {
    console.error(
      JSON.stringify({
        level: "error",
        event: "smtp_delivery_failed",
        reason: "not_configured",
      }),
    );
    throw new Error("El servicio SMTP no está configurado");
  }

  async sendLoginVerificationCode(): Promise<void> {
    this.unavailable();
  }

  async sendPasswordRecoveryLink(): Promise<void> {
    this.unavailable();
  }
}
