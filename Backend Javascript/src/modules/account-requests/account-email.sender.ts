export interface ApprovedAccountEmail {
  recipient: string;
  name: string;
  temporaryPassword: string;
}

export interface RejectedAccountEmail {
  recipient: string;
  name: string;
  reason: string;
}

export interface AccountEmailSender {
  sendApprovedAccount(email: ApprovedAccountEmail): Promise<void>;
  sendRejectedAccount(email: RejectedAccountEmail): Promise<void>;
}

export class UnavailableAccountEmailSender implements AccountEmailSender {
  async sendApprovedAccount(): Promise<void> {
    throw new Error("El proveedor de correo aún no está configurado");
  }

  async sendRejectedAccount(): Promise<void> {
    throw new Error("El proveedor de correo aún no está configurado");
  }
}
