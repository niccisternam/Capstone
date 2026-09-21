import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { LoginIllustration } from "@/features/auth/components/LoginIllustration";

export const metadata: Metadata = {
  title: "Restablecer Contraseña | Capstone Tributario",
  description: "Formulario para definir una nueva contraseña a través del enlace de recuperación seguro.",
};

export default function RecuperarPasswordPage() {
  return (
    <main className="relative flex min-h-screen flex-col justify-between bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Contenedor central superior */}
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
        {/* Encabezado */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            RESTABLECER CONTRASEÑA
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Define tu nueva contraseña segura para acceder a la plataforma
          </p>
        </div>

        {/* Tarjeta con formulario */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <ResetPasswordForm />
        </div>
      </div>

      {/* Ilustración de barras decorativas */}
      <div className="mt-8 w-full">
        <LoginIllustration />
      </div>
    </main>
  );
}
