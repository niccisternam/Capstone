"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, refreshSession, parseJwtPayload } from "@/api/client";

export default function UsuarioLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function verifyUserAccess() {
      let token = getAccessToken();

      if (!token) {
        try {
          token = await refreshSession();
        } catch {
          token = null;
        }
      }

      if (!isMounted) return;

      if (!token) {
        router.replace("/login");
        return;
      }

      const payload = parseJwtPayload(token);
      if (payload?.rol === "ADMINISTRADOR") {
        router.replace("/admin/solicitudes");
      } else if (payload?.rol === "USUARIO") {
        setIsAuthorized(true);
      } else {
        router.replace("/login");
      }
    }

    verifyUserAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
