import type { SectionDef, FormState } from '../types'

interface Props {
  sections: SectionDef[]
  enabledSections: FormState['enabledSections']
  onToggle: (code: string) => void
}

export function SectionToggles({ sections, enabledSections, onToggle }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      {sections.map(s => {
        const enabled = enabledSections[s.code] ?? false
        return (
          <label
            key={s.code}
            className="flex items-start gap-2.5 rounded px-2 py-1.5 cursor-pointer transition-colors"
            style={{
              background: enabled ? 'var(--bg-elevated)' : 'transparent',
            }}
            onMouseEnter={e => {
              if (!enabled) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'
            }}
            onMouseLeave={e => {
              if (!enabled) (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => onToggle(s.code)}
              className="mt-0.5 cursor-pointer flex-shrink-0"
              style={{ accentColor: 'var(--accent)' }}
            />
            <div className="min-w-0">
              <div className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{s.code}</div>
              <div className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>{s.description}</div>
            </div>
          </label>
        )
      })}
    </div>
  )
}
