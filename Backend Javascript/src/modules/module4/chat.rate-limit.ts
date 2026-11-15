const VENTANA_MS = 60_000;
const MAX_PREGUNTAS = 20;
// shortcut: process-local and evicts above 10k users; use shared storage for multiple instances.
const MAX_USUARIOS_EN_MEMORIA = 10_000;

export function crearLimitePreguntas(now: () => number = Date.now) {
  const ventanas = new Map<string, { inicio: number; cantidad: number }>();
  const guardar = (idUsuario: string, ventana: { inicio: number; cantidad: number }) => {
    ventanas.delete(idUsuario);
    ventanas.set(idUsuario, ventana);
    if (ventanas.size > MAX_USUARIOS_EN_MEMORIA) ventanas.delete(ventanas.keys().next().value!);
  };

  return (idUsuario: string): number => {
    const actual = now();
    const ventana = ventanas.get(idUsuario);
    if (!ventana || actual - ventana.inicio >= VENTANA_MS) {
      guardar(idUsuario, { inicio: actual, cantidad: 1 });
      return 0;
    }
    if (ventana.cantidad >= MAX_PREGUNTAS) return Math.max(1, Math.ceil((VENTANA_MS - (actual - ventana.inicio)) / 1000));
    ventana.cantidad += 1;
    guardar(idUsuario, ventana);
    return 0;
  };
}
