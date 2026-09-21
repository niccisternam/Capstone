import { Suspense } from "react";
import type { Metadata } from "next";
import { TwoFactorForm } from "@/features/auth/components/TwoFactorForm";
import { LoginIllustration } from "@/features/auth/components/LoginIllustration";

export const metadata: Metadata = {
  title: "Autentificación 2FA | Capstone Tributario",
  description: "Verificación de dos factores por código numérico de 6 dígitos.",
};

export default function VerificarCodigoPage() {
  return (
    <main className="relative flex min-h-screen flex-col justify-between bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Contenedor central superior */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
        {/* Título exterior idéntico al mockup */}
        <div className="mb-6 text-center sm:text-left sm:pl-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-600">
            Iniciar Sesión
          </h1>
        </div>

        {/* Tarjeta principal con el formulario 2FA */}
        <div className="rounded-lg border-2 border-slate-700 bg-slate-100/90 p-6 sm:p-8 shadow-sm">
          <Suspense
            fallback={
              <div className="py-8 text-center text-sm text-slate-500">
                Cargando verificación...
              </div>
            }
          >
            <TwoFactorForm />
          </Suspense>
        </div>
      </div>

      {/* Ilustración de barras alusiva al mockup en la base */}
      <div className="mt-8 w-full">
        <LoginIllustration />
      </div>
    </main>
  );
}
