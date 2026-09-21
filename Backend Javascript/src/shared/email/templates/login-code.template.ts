export function loginCodeTemplate(code: string, expiresInMinutes: number) {
  return {
    subject: "Código de verificación - Sistema Capstone",
    text: [
      "Tu código de verificación es:",
      "",
      code,
      "",
      `Este código expira en ${expiresInMinutes} minutos.`,
      "",
      "Si no solicitaste este código, puedes ignorar este correo.",
    ].join("\n"),
  };
}
