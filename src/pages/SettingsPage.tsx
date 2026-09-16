import { useRef, useState, type ChangeEvent } from 'react';
import { Download, Upload, Info, CheckCircle2, XCircle } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { downloadExport, parseImportFile } from '../services/exportService';
import { storageAvailable } from '../services/storageProvider';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export function SettingsPage() {
  const { boxers, evaluations, skills, importData } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<{ boxers: typeof boxers; evaluations: typeof evaluations } | null>(null);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function handleExport() {
    downloadExport(boxers, evaluations);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = parseImportFile(String(reader.result));
      if (!result.success || !result.boxers || !result.evaluations) {
        setImportMessage({ type: 'error', text: result.error ?? 'Import impossible.' });
      } else {
        setPendingImport({ boxers: result.boxers, evaluations: result.evaluations });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function confirmImport() {
    if (!pendingImport) return;
    importData(pendingImport.boxers, pendingImport.evaluations);
    setImportMessage({ type: 'success', text: `${pendingImport.boxers.length} boxeur(s) et ${pendingImport.evaluations.length} évaluation(s) importés.` });
    setPendingImport(null);
  }

  return (
    <div className="px-4 py-4">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Sauvegarde des données</h2>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          {storageAvailable ? (
            <CheckCircle2 size={16} className="text-emerald-500" />
          ) : (
            <XCircle size={16} className="text-red-500" />
          )}
          <p className="text-sm text-zinc-300">
            Stockage local {storageAvailable ? 'disponible' : 'indisponible'}
          </p>
        </div>
        <p className="text-xs text-zinc-500">
          {boxers.length} boxeur(s) · {evaluations.length} évaluation(s) · {skills.length} compétences au référentiel
        </p>
      </div>

      <button
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-800 text-zinc-100 font-semibold text-sm mb-3 active:bg-zinc-700"
      >
        <Download size={18} /> Exporter les données (JSON)
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-800 text-zinc-100 font-semibold text-sm mb-2 active:bg-zinc-700"
      >
        <Upload size={18} /> Importer des données (JSON)
      </button>
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />

      {importMessage && (
        <p className={`text-xs mt-2 ${importMessage.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
          {importMessage.text}
        </p>
      )}

      <div className="flex items-start gap-2 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 mt-4">
        <Info size={14} className="text-zinc-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          L'import remplace intégralement les données actuellement stockées sur cet appareil. Exportez vos données
          actuelles avant d'importer si vous souhaitez les conserver.
        </p>
      </div>

      <ConfirmDialog
        open={pendingImport !== null}
        title="Remplacer les données ?"
        message={`Cet import contient ${pendingImport?.boxers.length ?? 0} boxeur(s) et ${
          pendingImport?.evaluations.length ?? 0
        } évaluation(s). Toutes les données actuelles seront remplacées.`}
        confirmLabel="Importer"
        onCancel={() => setPendingImport(null)}
        onConfirm={confirmImport}
      />
    </div>
  );
}
