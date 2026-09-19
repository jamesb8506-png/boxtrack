import { useAppData } from '../contexts/AppDataContext';
import { BoxerForm } from '../components/boxer/BoxerForm';
import type { Route } from '../types/route';

export function BoxerFormPage({ boxerId, onNavigate }: { boxerId?: string; onNavigate: (r: Route) => void }) {
  const { boxers, createBoxer, updateBoxer } = useAppData();
  const existing = boxerId ? boxers.find((b) => b.id === boxerId) ?? null : null;

  return (
    <BoxerForm
      boxer={existing}
      onCancel={() => onNavigate(existing ? { name: 'boxer-profile', boxerId: existing.id } : { name: 'boxers' })}
      onSubmit={(values) => {
        if (existing) {
          updateBoxer(existing.id, values);
          onNavigate({ name: 'boxer-profile', boxerId: existing.id });
        } else {
          const boxer = createBoxer(values);
          onNavigate({ name: 'boxer-profile', boxerId: boxer.id });
        }
      }}
    />
  );
}
