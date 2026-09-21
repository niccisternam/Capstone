"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, refreshSession, parseJwtPayload } from "@/api/client";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function verifyAdminAccess() {
      let token = getAccessToken();

      // Si no hay token en memoria (ej. al navegar directamente o recargar con F5), renovar con cookie HttpOnly
      if (!token) {
        try {
          token = await refreshSession();
        } catch {
          token = null;
        }
      }

      if (!isMounted) return;

      if (!token) {
        // Sin sesión activa
        router.replace("/login");
        return;
      }

      const payload = parseJwtPayload(token);
      if (payload?.rol === "ADMINISTRADOR") {
        setIsAuthorized(true);
      } else if (payload?.rol === "USUARIO") {
        // Usuario autenticado pero sin rol de administrador: expulsar inmediatamente a /usuario
        router.replace("/usuario");
      } else {
        router.replace("/login");
      }
    }

    verifyAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-600">Verificando permisos de acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
