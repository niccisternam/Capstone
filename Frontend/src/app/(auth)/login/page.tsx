import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginIllustration } from "@/features/auth/components/LoginIllustration";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Capstone Tributario",
  description: "Página de inicio de sesión del sistema de capstone tributario.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col justify-between bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Contenedor central superior */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
        {/* Título principal al estilo del mockup */}
        <div className="mb-6 text-center sm:text-left sm:pl-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-600">
            Iniciar Sesión
          </h1>
        </div>

        {/* Tarjeta principal que contiene el formulario */}
        <div className="rounded-lg border-2 border-slate-700 bg-slate-100/90 p-6 sm:p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>

      {/* Ilustración de barras alusiva al mockup en la parte inferior */}
      <div className="mt-8 w-full">
        <LoginIllustration />
      </div>
    </main>
  );
}
