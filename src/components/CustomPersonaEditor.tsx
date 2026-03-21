import type { CustomPersona } from '../types'

interface Props {
  slot?: number
  label?: string
  persona: CustomPersona
  onChange: (field: keyof CustomPersona, value: string) => void
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {label}
        {hint && <span className="ml-1 normal-case font-normal" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>— {hint}</span>}
      </label>
      {children}
    </div>
  )
}

export function CustomPersonaEditor({ slot, label, persona, onChange }: Props) {
  const title = label ?? (slot != null ? `Custom Persona ${slot}` : 'Persona Details')
  return (
    <div
      className="flex flex-col gap-3 rounded-lg p-3"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
    >
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
        {title}
      </div>

      <Field label="Persona Name" hint="e.g. # My Expert Analyst">
        <input
          className="t-input"
          value={persona.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="# My Expert Analyst"
        />
      </Field>

      <Field label="Role" hint="What is this assistant's role?">
        <textarea
          className="t-input t-textarea"
          value={persona.role}
          onChange={e => onChange('role', e.target.value)}
          placeholder="You are {assistantName}, an expert in..."
        />
      </Field>

      <Field label="Tone" hint="Appended after Mood & Approach">
        <textarea
          className="t-input t-textarea"
          value={persona.tone}
          onChange={e => onChange('tone', e.target.value)}
          placeholder="Precise, methodical, and results-oriented."
        />
      </Field>

      <Field label="Primary Objective">
        <textarea
          className="t-input t-textarea"
          value={persona.primaryObjective}
          onChange={e => onChange('primaryObjective', e.target.value)}
          placeholder="Assist with..."
        />
      </Field>

      <Field label="Secondary Expertise">
        <textarea
          className="t-input t-textarea"
          value={persona.secondaryExpertise}
          onChange={e => onChange('secondaryExpertise', e.target.value)}
          placeholder="Deep knowledge of..."
        />
      </Field>
    </div>
  )
}
