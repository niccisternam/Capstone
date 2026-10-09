import type { Metadata } from "next";
import { AppHeader } from "@/features/auth/components/AppHeader";
import { NotebooksPage } from "@/features/module1/components/NotebooksPage";

export const metadata: Metadata = {
  title: "Portal de Usuario | Capstone",
  description: "Panel de usuario regular del sistema de gestión documental Capstone.",
};

export default function UsuarioPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superior con marca Capstone, distintivo de usuario y botón de cerrar sesión */}
      <AppHeader role="Usuario" />
      {/* Contenedor central con el mensaje de rol usuario */}
      <NotebooksPage />
    </div>
  );
}
