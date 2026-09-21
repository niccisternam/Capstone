export function passwordRecoveryTemplate(
  userName: string,
  recoveryUrl: string,
  expiresInMinutes: number,
) {
  return {
    subject: "Recuperación de contraseña - Sistema Capstone",
    text: [
      `Hola ${userName},`,
      "",
      "Se solicitó recuperar la contraseña de tu cuenta en el Sistema Capstone.",
      "",
      "Para establecer una nueva contraseña, ingresa al siguiente enlace:",
      recoveryUrl,
      "",
      `Este enlace expira en ${expiresInMinutes} minutos.`,
      "",
      "Si no solicitaste recuperar tu contraseña, puedes ignorar este correo.",
    ].join("\n"),
    html: [
      `<p>Hola ${userName},</p>`,
      "<p>Se solicitó recuperar la contraseña de tu cuenta en el Sistema Capstone.</p>",
      "<p>Para establecer una nueva contraseña, haz clic en el siguiente enlace o botón:</p>",
      '<p style="margin: 20px 0;">',
      `  <a href="${recoveryUrl}" style="background-color: #0066cc; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Recuperar contraseña</a>`,
      "</p>",
      "<p>O si prefieres, copia y pega la siguiente dirección en tu navegador:</p>",
      `<p><a href="${recoveryUrl}">${recoveryUrl}</a></p>`,
      `<p>Este enlace expira en ${expiresInMinutes} minutos.</p>`,
      "<p>Si no solicitaste recuperar tu contraseña, puedes ignorar este correo de forma segura.</p>",
    ].join("\n"),
  };
}
