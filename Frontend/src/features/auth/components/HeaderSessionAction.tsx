"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAccessToken, parseJwtPayload, refreshSession } from "@/api/client";

const buttonClass =
  "inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

/** Ruta de la consola según el rol del token; null si el rol no es reconocido. */
function consolePathFor(token: string | null): string | null {
  const rol = token ? parseJwtPayload(token)?.rol : undefined;
  if (rol === "ADMINISTRADOR") return "/admin/solicitudes";
  if (rol === "USUARIO") return "/usuario";
  return null;
}

/**
 * Acción del header público: si la sesión sigue activa (token en memoria o cookie de
 * renovación válida) ofrece volver a la consola; si no, muestra "Iniciar Sesión".
 */
export function HeaderSessionAction() {
  const [consolePath, setConsolePath] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function detectSession() {
      let token = getAccessToken();
      if (!token) {
        try {
          token = await refreshSession();
        } catch {
          token = null;
        }
      }
      if (active) setConsolePath(consolePathFor(token));
    }
    void detectSession();
    return () => {
      active = false;
    };
  }, []);

  if (consolePath) {
    return (
      <Link href={consolePath} className={buttonClass}>
        Volver a la consola
      </Link>
    );
  }

  return (
    <Link href="/login" className={buttonClass}>
      Iniciar Sesión
    </Link>
  );
}
