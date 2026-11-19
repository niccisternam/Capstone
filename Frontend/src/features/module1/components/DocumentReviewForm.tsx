"use client";

import { useState } from "react";
import { confirmDocument, getNotebook, saveReview } from "@/api/module1.api";
import { ApiError } from "@/api/api-error";
import type { AjusteGlobalExtraccion, DetalleExtraccion, DocumentoDetalle } from "@/api/module1.schemas";
import { initialReviewForm, type ReviewFormState } from "./documentReviewForm";
import { DocumentReviewHeaderSection } from "./DocumentReviewHeaderSection";
import { DocumentDetailsSection } from "./DocumentDetailsSection";
import { GlobalAdjustmentsSection } from "./GlobalAdjustmentsSection";
import { ReviewTotalsSection } from "./ReviewTotalsSection";

export function DocumentReviewForm({
  document,
  onDone,
  onStatusChange,
  batchMode = false,
}: {
  document: DocumentoDetalle;
  onDone: (nextId?: string) => void;
  onStatusChange?: (status: DocumentoDetalle["estado"]) => void;
  batchMode?: boolean;
}) {
  const [form, setForm] = useState<ReviewFormState>(() => initialReviewForm(document));
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [allConfirmed, setAllConfirmed] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const editingConfirmed = document.estado === "CONFIRMADO";

  const setField = (key: keyof ReviewFormState, value: string) => {
    setDirty(true);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const setDetail = (index: number, key: keyof DetalleExtraccion, value: string | null) => {
    setDirty(true);
    setForm((current) => ({
      ...current,
      detalles: current.detalles.map((detalle, position) => (position === index ? { ...detalle, [key]: value } : detalle)),
    }));
  };

  const setAdjustment = (index: number, key: keyof AjusteGlobalExtraccion, value: string | null) => {
    setDirty(true);
    setForm((current) => ({
      ...current,
      ajustes: current.ajustes.map((ajuste, position) => (position === index ? { ...ajuste, [key]: value } : ajuste)),
    }));
  };

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await saveReview(document.idDocumento, {
        estadoPago: form.estadoPago,
        observacion: form.observacion,
        datos: {
          tipoDocumento: form.tipoDocumento || null,
          folio: form.folio || null,
          fechaEmision: form.fechaEmision || null,
          emisor: { rut: form.emisorRut || null, razonSocial: form.emisorRazonSocial || null },
          receptor: { rut: form.receptorRut || null, nombre: form.receptorNombre || null },
          condicionTributaria: (form.condicionTributaria || null) as "AFECTA" | "EXENTA" | "NO_AFECTA" | "MIXTA" | null,
          detalles: form.detalles.map((detalle) => ({
            descripcion: detalle.descripcion,
            cantidad: detalle.cantidad,
            unidad: detalle.unidad,
            precioUnitario: detalle.precioUnitario,
            descuentoPorcentaje: detalle.descuentoPorcentaje,
            descuentoMonto: detalle.descuentoMonto,
            recargoPorcentaje: detalle.recargoPorcentaje,
            recargoMonto: detalle.recargoMonto,
            totalLinea: detalle.totalLinea,
          })),
          ajustesGlobales: form.ajustes.map((ajuste) => ({
            tipo: ajuste.tipo,
            modalidad: ajuste.modalidad,
            valor: ajuste.valor,
            descripcion: ajuste.descripcion,
          })),
          totales: {
            neto: form.neto || null,
            iva: form.iva || null,
            exento: form.exento || null,
            total: form.total || null,
          },
          medioPago: form.medioPago || null,
        },
      });
      setDirty(false);
      setMessage("Cambios guardados.");
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No fue posible guardar los cambios.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function confirm() {
    setConfirming(true);
    setError(null);
    setMessage(null);
    try {
      if (!(await save())) return;
      await confirmDocument(document.idDocumento);
      onStatusChange?.("CONFIRMADO");
      const notebook = await getNotebook(document.idNotebook, { estado: "PENDIENTE_REVISION", pagina: 1 });
      const next = notebook.documentos.find((item) => item.idDocumento !== document.idDocumento);
      if (next) {
        onDone(next.idDocumento);
      } else {
        setAllConfirmed(true);
        setMessage("Todos los documentos fueron confirmados correctamente.");
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No fue posible confirmar el documento.");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Confirmación de documentos:</strong> los datos de IA son preliminares. Verifica y corrige cada campo antes de confirmar.
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

      <DocumentReviewHeaderSection form={form} setField={setField} />
      <DocumentDetailsSection detalles={form.detalles} setDetail={setDetail} />
      <GlobalAdjustmentsSection ajustes={form.ajustes} setAdjustment={setAdjustment} />
      <ReviewTotalsSection
        form={form}
        setField={setField}
        saving={saving}
        confirming={confirming}
        allConfirmed={allConfirmed}
        dirty={dirty}
        editingConfirmed={editingConfirmed}
        batchMode={batchMode}
        onSave={() => void save()}
        onConfirm={() => void confirm()}
        onDone={() => onDone()}
      />
    </div>
  );
}
