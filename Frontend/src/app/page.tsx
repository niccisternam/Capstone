import type { Metadata } from "next";
import Link from "next/link";
import { WelcomeCard } from "@/features/account-requests/components/WelcomeCard";

export const metadata: Metadata = {
  title: "Bienvenido | Capstone Gestión Documental",
  description: "Gestión documental con el poder de la IA. Sube tus comprobantes y organiza tus gastos.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* Barra superior con marca y acceso a login */}
      <header className="border-b border-sky-300 bg-sky-200 px-6 py-4 shadow-2xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
          >
            Capstone
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* Área principal con la tarjeta de bienvenida centrada */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <WelcomeCard />
      </main>
    </div>
  );
}
