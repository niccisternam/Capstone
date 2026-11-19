import type { ConversacionChat } from "@/api/chat.api";

export function ConversationSidebar({
  conversaciones,
  totalConversaciones,
  idActiva,
  loading,
  controlsBusy,
  hayMasConversaciones,
  cargandoConversaciones,
  sidebarExpanded,
  mobileSidebarOpen,
  onSeleccionar,
  onNueva,
  onCargarMas,
  onCerrarMobile,
}: {
  conversaciones: ConversacionChat[];
  totalConversaciones: number;
  idActiva: string | null;
  loading: boolean;
  controlsBusy: boolean;
  hayMasConversaciones: boolean;
  cargandoConversaciones: boolean;
  sidebarExpanded: boolean;
  mobileSidebarOpen: boolean;
  onSeleccionar: (idConversacion: string) => void;
  onNueva: () => void;
  onCargarMas: () => void;
  onCerrarMobile: () => void;
}) {
  return (
    <aside
      id="chat-conversation-sidebar"
      aria-label="Conversaciones"
      className={`${
        mobileSidebarOpen
          ? "absolute inset-y-0 left-0 z-30 flex w-[min(84vw,300px)] shadow-xl lg:static lg:z-auto lg:w-[270px] lg:shadow-none"
          : "hidden lg:flex"
      } ${sidebarExpanded ? "lg:w-[270px] lg:shrink-0" : "lg:w-0 lg:overflow-hidden"} flex-col border-r border-slate-200 bg-[#f8f9fc]`}
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Conversaciones</h2>
          <p className="mt-1 text-xs text-slate-500">{totalConversaciones} de 50</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onNueva}
            disabled={controlsBusy}
            aria-label="Nueva conversación"
            title="Nueva conversación"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2448c8] text-xl font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50"
          >
            +
          </button>
          <button
            type="button"
            onClick={onCerrarMobile}
            aria-label="Cerrar conversaciones"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-blue-700 lg:hidden"
          >
            ×
          </button>
        </div>
      </header>

      <nav aria-label="Historial de conversaciones" className="min-h-0 flex-1 overflow-y-auto p-2">
        {conversaciones.length === 0 && !loading && (
          <p className="px-3 py-5 text-sm leading-5 text-slate-500">
            Tus chats aparecerán aquí después de enviar el primer mensaje.
          </p>
        )}
        <ul className="space-y-1">
          {conversaciones.map((item) => (
            <li key={item.idConversacion}>
              <button
                type="button"
                onClick={() => onSeleccionar(item.idConversacion)}
                aria-current={idActiva === item.idConversacion ? "page" : undefined}
                disabled={controlsBusy}
                className={`w-full rounded-lg border-l-[3px] px-3 py-3 text-left text-sm leading-5 focus-visible:outline-2 focus-visible:outline-blue-700 disabled:opacity-60 ${
                  idActiva === item.idConversacion
                    ? "border-[#2448c8] bg-white font-semibold text-slate-900 shadow-sm"
                    : "border-transparent text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                <span className="block truncate">{item.titulo}</span>
                <span className="mt-1 block text-[11px] font-normal text-slate-400">
                  {new Date(item.updatedAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {hayMasConversaciones && (
          <button
            type="button"
            onClick={onCargarMas}
            disabled={controlsBusy}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#2448c8] hover:bg-blue-50 disabled:opacity-50"
          >
            {cargandoConversaciones ? "Cargando…" : "Ver chats anteriores"}
          </button>
        )}
      </nav>
      <div className="border-t border-slate-200 px-4 py-3 text-[11px] text-slate-500">
        Cada conversación mantiene su propio contexto.
      </div>
    </aside>
  );
}
