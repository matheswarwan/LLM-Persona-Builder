import { useState } from 'react'
import type { CustomPersona } from '../types'
import { CustomPersonaEditor } from './CustomPersonaEditor'

interface Props {
  onSave: (persona: CustomPersona) => Promise<void>
  onClose: () => void
}

const EMPTY: CustomPersona = {
  name: '',
  role: '',
  tone: '',
  primaryObjective: '',
  secondaryExpertise: '',
}

export function CreatePersonaModal({ onSave, onClose }: Props) {
  const [persona, setPersona] = useState<CustomPersona>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(field: keyof CustomPersona, value: string) {
    setPersona(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!persona.name.trim()) {
      setError('Persona name is required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(persona)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal */}
      <div
        className="w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
        style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Create New Persona
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Saved to backend — appears in the persona dropdown.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center text-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          <CustomPersonaEditor
            label="Persona Details"
            persona={persona}
            onChange={handleChange}
          />

          {error && (
            <div
              className="mt-3 text-xs rounded px-3 py-2"
              style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded text-sm font-medium transition-opacity"
            style={{ background: 'var(--accent)', color: '#fff', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Save Persona'}
          </button>
        </div>
      </div>
    </div>
  )
}
