import type { AppData, FormState } from '../types'

interface Props {
  data: AppData
  state: FormState
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export function PersonaForm({ data, state, onUpdate }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Your Name">
          <input
            className="t-input"
            value={state.userName}
            onChange={e => onUpdate('userName', e.target.value)}
            placeholder="JJ"
          />
        </Field>
        <Field label="Assistant Name">
          <input
            className="t-input"
            value={state.assistantName}
            onChange={e => onUpdate('assistantName', e.target.value)}
            placeholder="G"
          />
        </Field>
      </div>

      <Field label="Location">
        <input
          className="t-input"
          value={state.location}
          onChange={e => onUpdate('location', e.target.value)}
          placeholder="Canada"
        />
      </Field>

      <Field label="Persona">
        <select
          className="t-input t-select"
          value={state.persona}
          onChange={e => onUpdate('persona', e.target.value)}
        >
          {data.personas.map(p => (
            <option key={p} value={p}>{p.replace(/^#\s*/, '')}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Mood">
          <select
            className="t-input t-select"
            value={state.mood}
            onChange={e => onUpdate('mood', e.target.value)}
          >
            {data.moods.map(m => (
              <option key={m.name} value={m.name} title={m.description}>{m.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Approach">
          <select
            className="t-input t-select"
            value={state.approach}
            onChange={e => onUpdate('approach', e.target.value)}
          >
            {data.approaches.map(a => (
              <option key={a.name} value={a.name} title={a.description}>{a.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Randomness (e.g. 3-8)">
        <input
          className="t-input"
          value={state.randomness}
          onChange={e => onUpdate('randomness', e.target.value)}
          placeholder="3-8"
        />
      </Field>
    </div>
  )
}
