export function accountRejectedTemplate(name: string, reason: string) {
  return {
    subject: "Solicitud de cuenta rechazada - Sistema Capstone",
    text: [
      `Hola ${name},`,
      "",
      "Tu solicitud de cuenta fue rechazada.",
      "",
      "Motivo indicado por el administrador:",
      reason,
      "",
      "Si necesitas aclarar la situación, comunícate con la administración del sistema.",
    ].join("\n"),
  };
}
