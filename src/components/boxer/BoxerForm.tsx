import { useState, type FormEvent } from 'react';
import type { Boxer, BoxerLevel, Sex } from '../../types';
import { BOXER_LEVELS } from '../../types';

interface BoxerFormValues {
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: Sex;
  weight: string;
  category: string;
  level: BoxerLevel;
  club: string;
  notes: string;
  active: boolean;
}

function toFormValues(boxer?: Boxer | null): BoxerFormValues {
  return {
    firstName: boxer?.firstName ?? '',
    lastName: boxer?.lastName ?? '',
    birthDate: boxer?.birthDate ?? '',
    sex: boxer?.sex ?? 'M',
    weight: boxer?.weight != null ? String(boxer.weight) : '',
    category: boxer?.category ?? '',
    level: boxer?.level ?? 'Débutant',
    club: boxer?.club ?? '',
    notes: boxer?.notes ?? '',
    active: boxer?.active ?? true,
  };
}

export function BoxerForm({
  boxer,
  onSubmit,
  onCancel,
}: {
  boxer?: Boxer | null;
  onSubmit: (values: Omit<Boxer, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<BoxerFormValues>(() => toFormValues(boxer));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof BoxerFormValues>(key: K, val: BoxerFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!values.firstName.trim()) errs.firstName = 'Le prénom est requis.';
    if (!values.lastName.trim()) errs.lastName = 'Le nom est requis.';
    if (!values.birthDate) errs.birthDate = 'La date de naissance est requise.';
    else if (new Date(values.birthDate) > new Date()) errs.birthDate = 'La date ne peut pas être dans le futur.';
    if (values.weight && (isNaN(Number(values.weight)) || Number(values.weight) <= 0)) {
      errs.weight = 'Le poids doit être un nombre positif.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      birthDate: values.birthDate,
      sex: values.sex,
      weight: values.weight ? Number(values.weight) : null,
      category: values.category.trim(),
      level: values.level,
      club: values.club.trim(),
      photo: boxer?.photo ?? null,
      notes: values.notes.trim(),
      active: values.active,
    });
  }

  const inputClass =
    'w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 text-zinc-100 text-base placeholder:text-zinc-600 focus:outline-none focus:border-gold';
  const labelClass = 'block text-sm font-medium text-zinc-400 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Prénom *</label>
          <input
            className={inputClass}
            value={values.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            placeholder="Léo"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className={labelClass}>Nom *</label>
          <input
            className={inputClass}
            value={values.lastName}
            onChange={(e) => set('lastName', e.target.value)}
            placeholder="Martin"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Date de naissance *</label>
        <input
          type="date"
          className={inputClass}
          value={values.birthDate}
          onChange={(e) => set('birthDate', e.target.value)}
        />
        {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Sexe</label>
          <select className={inputClass} value={values.sex} onChange={(e) => set('sex', e.target.value as Sex)}>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Poids (kg)</label>
          <input
            className={inputClass}
            value={values.weight}
            onChange={(e) => set('weight', e.target.value)}
            placeholder="65"
            inputMode="decimal"
          />
          {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Catégorie</label>
          <input
            className={inputClass}
            value={values.category}
            onChange={(e) => set('category', e.target.value)}
            placeholder="Cadets -65kg"
          />
        </div>
        <div>
          <label className={labelClass}>Niveau</label>
          <select className={inputClass} value={values.level} onChange={(e) => set('level', e.target.value as BoxerLevel)}>
            {BOXER_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Club</label>
        <input className={inputClass} value={values.club} onChange={(e) => set('club', e.target.value)} placeholder="Boxing Club Paris" />
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          className={`${inputClass} min-h-[90px] resize-none`}
          value={values.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Observations générales sur le boxeur..."
        />
      </div>

      {boxer && (
        <label className="flex items-center gap-3 py-1">
          <input
            type="checkbox"
            checked={values.active}
            onChange={(e) => set('active', e.target.checked)}
            className="w-5 h-5 rounded accent-gold"
          />
          <span className="text-sm text-zinc-300">Boxeur actif</span>
        </label>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3.5 rounded-xl bg-zinc-800 text-zinc-200 font-semibold text-sm active:bg-zinc-700"
        >
          Annuler
        </button>
        <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gold text-black font-semibold text-sm active:bg-gold-dark">
          {boxer ? 'Enregistrer' : 'Créer le boxeur'}
        </button>
      </div>
    </form>
  );
}
