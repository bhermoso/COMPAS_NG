import { useEffect, useRef, useState } from "react";

export function DeleteWorkspaceDialog({ name, discardDraft, onCancel, onConfirm }: {
  name: string;
  discardDraft: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  async function confirm() {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError(null);
    try { await onConfirm(); onCancel(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "No se pudo completar la eliminación."); }
    finally { running.current = false; setBusy(false); }
  }
  return <dialog ref={dialog} className="workspace-delete-dialog" aria-labelledby="workspace-delete-title"
    onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}>
    <h2 id="workspace-delete-title">Eliminar expediente de {name}</h2>
    <p>Se borrarán los datos y archivos originales de este expediente guardados en este navegador y se retirará del selector.</p>
    <p>La copia compartida de Firebase se conserva. Para recuperar el trabajo local borrado necesitarás una copia de recuperación.</p>
    {discardDraft && <p>También se descartarán los cambios sin guardar de la propuesta abierta.</p>}
    {error && <p role="alert">{error}</p>}
    <div className="workspace-delete-dialog__actions">
      <button type="button" autoFocus disabled={busy} onClick={onCancel}>Cancelar</button>
      <button type="button" disabled={busy} onClick={() => { void confirm(); }}>
        {busy ? "Eliminando…" : "Eliminar de este navegador"}
      </button>
    </div>
  </dialog>;
}
