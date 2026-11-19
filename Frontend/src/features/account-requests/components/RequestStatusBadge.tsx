const ETIQUETAS: Record<string, string> = {
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
  PENDIENTE: "Pendiente",
};

const ESTILOS = {
  table: {
    APROBADA: "bg-green-100 text-green-800",
    RECHAZADA: "bg-red-100 text-red-800",
    PENDIENTE: "bg-amber-100 text-amber-800",
  },
  detail: {
    APROBADA: "border-emerald-300 bg-emerald-100 text-emerald-900",
    RECHAZADA: "border-rose-300 bg-rose-100 text-rose-900",
    PENDIENTE: "border-amber-300 bg-amber-100 text-amber-900",
  },
} as const;

export function RequestStatusBadge({
  estado,
  variant = "table",
}: {
  estado: string;
  variant?: keyof typeof ESTILOS;
}) {
  const key = estado in ETIQUETAS ? estado : "PENDIENTE";
  const className =
    variant === "detail"
      ? `inline-flex items-center rounded-md border px-3 py-1 text-xs font-bold ${ESTILOS.detail[key as keyof typeof ESTILOS.detail]}`
      : `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTILOS.table[key as keyof typeof ESTILOS.table]}`;

  return <span className={className}>{ETIQUETAS[key]}</span>;
}
