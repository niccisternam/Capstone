import type { Metadata } from "next";
import { RecoveryForm } from "@/features/auth/components/RecoveryForm";
import { LoginIllustration } from "@/features/auth/components/LoginIllustration";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Capstone Tributario",
  description: "Solicitud de enlace de recuperación de contraseña para cuentas registradas.",
};

export default function RecuperarClavePage() {
  return (
    <main className="relative flex min-h-screen flex-col justify-between bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Contenedor central superior */}
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
        {/* Encabezado al estilo del mockup */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            RECUPERAR CONTRASEÑA
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Ingresa el correo asociado a tu cuenta
          </p>
        </div>

        {/* Formulario de recuperación */}
        <RecoveryForm />
      </div>

      {/* Ilustración de barras estadísticas en la base como en el mockup */}
      <div className="mt-8 w-full">
        <LoginIllustration />
      </div>
    </main>
  );
}
