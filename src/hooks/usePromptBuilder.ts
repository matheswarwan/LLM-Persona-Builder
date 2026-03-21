import { useState, useMemo } from 'react'
import type { AppData, FormState, CustomPersona, StoredPersona } from '../types'
import { buildPrompt } from '../utils/promptEngine'

const EMPTY_CUSTOM_PERSONA: CustomPersona = {
  name: '',
  role: '',
  tone: '',
  primaryObjective: '',
  secondaryExpertise: '',
}

export function usePromptBuilder(data: AppData, storedPersonas: StoredPersona[] = []) {
  const { defaults, sections } = data

  const initialSections: Record<string, boolean> = {}
  for (const s of sections) {
    initialSections[s.code] = s.default
  }

  const [state, setState] = useState<FormState>({
    userName: defaults.userName,
    assistantName: defaults.assistantName,
    location: defaults.location,
    persona: defaults.persona,
    mood: defaults.mood,
    approach: defaults.approach,
    randomness: defaults.randomness,
    enabledSections: initialSections,
    randomFactsTopics: defaults.randomFactsTopics,
    storyAuthors: defaults.storyAuthors,
    customPersona1: { ...EMPTY_CUSTOM_PERSONA },
    customPersona2: { ...EMPTY_CUSTOM_PERSONA },
    selectedBonusPrompts: new Set(),
  })

  const prompt = useMemo(
    () => buildPrompt(data.rows, state, storedPersonas),
    [data.rows, state, storedPersonas],
  )

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState(prev => ({ ...prev, [key]: value }))
  }

  function toggleSection(code: string) {
    setState(prev => ({
      ...prev,
      enabledSections: { ...prev.enabledSections, [code]: !prev.enabledSections[code] },
    }))
  }

  function toggleBonusPrompt(text: string) {
    setState(prev => {
      const next = new Set(prev.selectedBonusPrompts)
      if (next.has(text)) next.delete(text)
      else next.add(text)
      return { ...prev, selectedBonusPrompts: next }
    })
  }

  function updateCustomPersona(slot: 1 | 2, field: keyof CustomPersona, value: string) {
    const key = slot === 1 ? 'customPersona1' : 'customPersona2'
    setState(prev => ({
      ...prev,
      [key]: { ...(prev[key] as CustomPersona), [field]: value },
    }))
  }

  return { state, prompt, update, toggleSection, toggleBonusPrompt, updateCustomPersona }
}
