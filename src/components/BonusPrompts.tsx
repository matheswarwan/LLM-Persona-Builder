import { useState } from 'react'
import type { BonusPrompt } from '../types'

interface Props {
  bonusPrompts: BonusPrompt[]
  selected: Set<string>
  onToggle: (text: string) => void
}

export function BonusPrompts({ bonusPrompts, selected, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false)
  const categories = Array.from(new Set(bonusPrompts.map(b => b.category)))
  const selectedCount = selected.size

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setExpanded(e => !e)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          Bonus Prompts
          {selectedCount > 0 && (
            <span
              className="text-xs rounded-full px-1.5 py-0.5"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {selectedCount}
            </span>
          )}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {!expanded && selectedCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {Array.from(selected).map(text => (
            <span
              key={text}
              className="inline-flex items-center gap-1 text-xs rounded px-2 py-0.5 cursor-pointer"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
              onClick={() => onToggle(text)}
              title="Click to remove"
            >
              <span className="truncate max-w-[180px]">{text}</span>
              <span>×</span>
            </span>
          ))}
        </div>
      )}

      {expanded && (
        <div className="flex flex-col gap-4">
          {categories.map(cat => (
            <div key={cat} className="flex flex-col gap-1">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{cat}</div>
              {bonusPrompts.filter(b => b.category === cat).map(b => (
                <label
                  key={b.text}
                  className="flex items-start gap-2 rounded px-2 py-1.5 cursor-pointer transition-colors text-xs"
                  style={{
                    background: selected.has(b.text) ? 'var(--accent-bg)' : 'transparent',
                    border: `1px solid ${selected.has(b.text) ? 'var(--accent-border)' : 'transparent'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(b.text)}
                    onChange={() => onToggle(b.text)}
                    className="mt-0.5 flex-shrink-0"
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span style={{ color: 'var(--text-primary)' }} className="leading-snug">{b.text}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
