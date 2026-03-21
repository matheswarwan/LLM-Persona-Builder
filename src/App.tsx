import { useMemo, useState } from 'react'
import type { AppData, FormState } from './types'
import { usePromptBuilder } from './hooks/usePromptBuilder'
import { useStoredPersonas } from './hooks/useStoredPersonas'
import { PersonaForm } from './components/PersonaForm'
import { SectionToggles } from './components/SectionToggles'
import { CustomPersonaEditor } from './components/CustomPersonaEditor'
import { BonusPrompts } from './components/BonusPrompts'
import { PromptPreview } from './components/PromptPreview'
import { CreatePersonaModal } from './components/CreatePersonaModal'
import { ThemeToggle } from './components/ThemeToggle'
import { ThemeProvider } from './context/ThemeContext'
import { filterBuiltInPersonas, CUSTOM_PERSONA_1_KEY, CUSTOM_PERSONA_2_KEY } from './utils/promptEngine'
import rawData from './data/personas.json'

const baseData = rawData as AppData

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  )
}

function TextAreaField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</label>
      )}
      <textarea
        className="t-input t-textarea font-mono text-xs"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function AppInner() {
  const { personas: storedPersonas, loading, createPersona, deletePersona } = useStoredPersonas()
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Merge built-in (filtered) + stored personas for the dropdown
  const allPersonas = useMemo(() => {
    const builtIn = filterBuiltInPersonas(baseData.personas)
    const storedNames = storedPersonas.map(p => p.name)
    return [...builtIn, ...storedNames]
  }, [storedPersonas])

  const data: AppData = useMemo(() => ({
    ...baseData,
    personas: allPersonas,
  }), [allPersonas])

  const { state, prompt, update, toggleSection, toggleBonusPrompt, updateCustomPersona } =
    usePromptBuilder(data, storedPersonas)

  const isCustomPersona1 = state.persona === CUSTOM_PERSONA_1_KEY
  const isCustomPersona2 = state.persona === CUSTOM_PERSONA_2_KEY

  const isStoredPersona = storedPersonas.some(p => p.name === state.persona)
  const storedPersonaRecord = storedPersonas.find(p => p.name === state.persona)

  const activePersonaName = useMemo(() => {
    if (isCustomPersona1 && state.customPersona1.name) return state.customPersona1.name
    if (isCustomPersona2 && state.customPersona2.name) return state.customPersona2.name
    return state.persona
  }, [state.persona, state.customPersona1.name, state.customPersona2.name, isCustomPersona1, isCustomPersona2])

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg-app)' }}>
      {/* Header */}
      <header
        className="flex-shrink-0 px-5 py-3 flex items-center justify-between"
        style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-bold" style={{ color: 'var(--header-text)' }}>
            LLM Persona Builder
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
            v1.7
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Create Persona button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <span>+</span> New Persona
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <div
          className="w-80 flex-shrink-0 overflow-y-auto"
          style={{ background: 'var(--bg-panel)', borderRight: '1px solid var(--border)' }}
        >
          <div className="p-4 flex flex-col gap-4">
            <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Configure</div>

            <PersonaForm
              data={data}
              state={state}
              onUpdate={update as <K extends keyof FormState>(key: K, value: FormState[K]) => void}
            />

            {/* Show stored persona info + delete option */}
            {isStoredPersona && storedPersonaRecord && (
              <div
                className="rounded-lg px-3 py-2 flex items-start justify-between gap-2"
                style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}
              >
                <div className="text-xs" style={{ color: 'var(--accent)' }}>
                  User-created persona
                </div>
                <button
                  onClick={async () => {
                    if (confirm('Delete this persona?')) {
                      await deletePersona(storedPersonaRecord.id)
                      update('persona', baseData.personas[0] ?? '')
                    }
                  }}
                  className="text-xs underline flex-shrink-0"
                  style={{ color: '#ef4444' }}
                >
                  Delete
                </button>
              </div>
            )}

            {/* Custom slot editors */}
            {isCustomPersona1 && (
              <>
                <Divider label="Custom Persona 1" />
                <CustomPersonaEditor
                  slot={1}
                  persona={state.customPersona1}
                  onChange={(f, v) => updateCustomPersona(1, f, v)}
                />
              </>
            )}
            {isCustomPersona2 && (
              <>
                <Divider label="Custom Persona 2" />
                <CustomPersonaEditor
                  slot={2}
                  persona={state.customPersona2}
                  onChange={(f, v) => updateCustomPersona(2, f, v)}
                />
              </>
            )}

            <Divider label="Sections" />
            <SectionToggles
              sections={data.sections}
              enabledSections={state.enabledSections}
              onToggle={toggleSection}
            />

            <Divider label="Random Facts Topics" />
            <TextAreaField
              label=""
              value={state.randomFactsTopics}
              onChange={v => update('randomFactsTopics', v)}
              placeholder="Science, Astrophysics, Zoology..."
            />

            <Divider label="A Story Authors" />
            <TextAreaField
              label=""
              value={state.storyAuthors}
              onChange={v => update('storyAuthors', v)}
              placeholder="Isaac Asimov, Neil Gaiman..."
            />

            <Divider label="Bonus Prompts" />
            <BonusPrompts
              bonusPrompts={data.bonusPrompts}
              selected={state.selectedBonusPrompts}
              onToggle={toggleBonusPrompt}
            />

            <div className="h-4" />
          </div>
        </div>

        {/* Right panel — prompt preview */}
        <div className="flex-1 flex flex-col overflow-hidden p-4" style={{ background: 'var(--bg-app)' }}>
          <div className="flex-shrink-0 mb-3">
            <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Generated Prompt</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Copy and paste directly into your LLM.
              {loading && <span className="ml-2 opacity-60">Loading personas…</span>}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <PromptPreview prompt={prompt} personaName={activePersonaName} />
          </div>
        </div>
      </div>

      {/* Create Persona Modal */}
      {showCreateModal && (
        <CreatePersonaModal
          onSave={async (persona) => {
            const saved = await createPersona(persona)
            update('persona', saved.name)
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
