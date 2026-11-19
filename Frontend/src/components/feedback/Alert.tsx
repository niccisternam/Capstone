import type { ReactNode } from "react";

export type AlertType = "success" | "error" | "info";

const ESTILOS: Record<AlertType, string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-green-200 bg-green-50 text-green-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

export function Alert({
  type,
  children,
  className = "p-3.5",
}: {
  type: AlertType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="alert" className={`rounded-md border text-sm font-medium transition-all ${ESTILOS[type]} ${className}`}>
      {children}
    </div>
  );
}
