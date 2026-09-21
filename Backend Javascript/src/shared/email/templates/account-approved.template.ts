export function accountApprovedTemplate(
  name: string,
  temporaryPassword: string,
) {
  return {
    subject: "Solicitud de cuenta aprobada - Sistema Capstone",
    text: [
      `Hola ${name},`,
      "",
      "Tu solicitud de cuenta fue aprobada.",
      "",
      "Contraseña temporal:",
      temporaryPassword,
      "",
      "Al iniciar sesión deberás cambiar esta contraseña antes de acceder al sistema.",
      "Por seguridad, no compartas estas credenciales.",
    ].join("\n"),
  };
}
