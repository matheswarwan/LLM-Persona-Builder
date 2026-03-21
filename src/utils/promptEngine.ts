import type { PersonaRow, FormState, CustomPersona, StoredPersona } from '../types'

export const CUSTOM_PERSONA_1_KEY = '# <Your Persona 1 Name>'
export const CUSTOM_PERSONA_2_KEY = '# <Your Persona 2 Name>'

/** Keys to filter out of the persona dropdown */
export const PLACEHOLDER_PERSONA_KEYS = [
  CUSTOM_PERSONA_1_KEY,
  CUSTOM_PERSONA_2_KEY,
  '# <Your Persona 1 Role>',
  '# <Your Persona 1 Tone>',
  '# <Your Persona 1 Objective>',
  '# <Your Persona 1 Primary Objectives>',
  '# <Your Persona 1 Secondary>',
  '# <Your Persona 1 Secondary Expertises>',
  '# <Your Persona 2 Primary Objectives>',
  '# <Your Persona 2 Secondary Expertises>',
]

function isPlaceholder(name: string) {
  return name.includes('<Your Persona') || PLACEHOLDER_PERSONA_KEYS.includes(name)
}

/** Convert a StoredPersona (from backend) to a CustomPersona (frontend shape) */
export function storedToCustom(s: StoredPersona): CustomPersona {
  return {
    name: s.name,
    role: s.role,
    tone: s.tone,
    primaryObjective: s.primary_objective,
    secondaryExpertise: s.secondary_expertise,
  }
}

/** Filter built-in persona list to remove placeholders */
export function filterBuiltInPersonas(personas: string[]): string[] {
  return personas.filter(p => !isPlaceholder(p))
}

function applyTokens(template: string, tokens: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => tokens[key] ?? `{${key}}`)
}

function buildTokenMap(state: FormState): Record<string, string> {
  return {
    userName: state.userName,
    assistantName: state.assistantName,
    location: state.location,
    mood: state.mood,
    approach: state.approach,
    randomness: state.randomness,
    randomFactsTopics: state.randomFactsTopics,
    storyAuthors: state.storyAuthors,
  }
}

export function buildCustomPersonaRows(custom: CustomPersona): PersonaRow[] {
  const name = custom.name || '# Custom Persona'
  const fullName = name.startsWith('#') ? name : `# ${name}`
  return [
    {
      section: '01-Persona',
      persona: fullName,
      sectionHeader: null,
      label: null,
      value: fullName,
      valueTemplate: null,
    },
    {
      section: '01-Persona',
      persona: fullName,
      sectionHeader: null,
      label: '## Role ##:  ',
      value: null,
      valueTemplate: custom.role || `You are {assistantName}, ${fullName}.`,
    },
    {
      section: '01-Persona',
      persona: fullName,
      sectionHeader: null,
      label: '## Tone ##:  ',
      value: null,
      valueTemplate: custom.tone
        ? `{mood} & {approach}. ${custom.tone}`
        : '{mood} & {approach}.',
    },
    ...(custom.primaryObjective ? [{
      section: '02-All',
      persona: fullName,
      sectionHeader: null,
      label: '## Primary Objective ##:  ',
      value: null,
      valueTemplate: custom.primaryObjective,
    }] : []),
    ...(custom.secondaryExpertise ? [{
      section: '02-All',
      persona: fullName,
      sectionHeader: null,
      label: '## Secondary Expertise ##:  ',
      value: null,
      valueTemplate: custom.secondaryExpertise,
    }] : []),
  ]
}

export function buildPrompt(
  rows: PersonaRow[],
  state: FormState,
  storedPersonas: StoredPersona[] = [],
): string {
  const tokens = buildTokenMap(state)
  const enabledSections = state.enabledSections

  // Check if selected persona is a stored (user-created) one
  const stored = storedPersonas.find(s => s.name === state.persona)
  let allRows = [...rows]

  if (stored) {
    const customRows = buildCustomPersonaRows(storedToCustom(stored))
    allRows = [...customRows, ...allRows]
  } else if (state.persona === CUSTOM_PERSONA_1_KEY) {
    const customRows = buildCustomPersonaRows(state.customPersona1)
    allRows = allRows.filter(r => r.persona !== CUSTOM_PERSONA_1_KEY)
    allRows = [...customRows, ...allRows]
  } else if (state.persona === CUSTOM_PERSONA_2_KEY) {
    const customRows = buildCustomPersonaRows(state.customPersona2)
    allRows = allRows.filter(r => r.persona !== CUSTOM_PERSONA_2_KEY)
    allRows = [...customRows, ...allRows]
  }

  const resolvedPersona = stored ? stored.name : state.persona

  const parts: string[] = []

  for (const row of allRows) {
    if (row.persona !== null && row.persona !== resolvedPersona) continue
    if (!enabledSections[row.section]) continue

    let text = ''
    if (row.sectionHeader) {
      text = applyTokens(row.sectionHeader, tokens)
    } else {
      const label = row.label ?? ''
      const rawValue = row.valueTemplate ?? row.value ?? ''
      const value = applyTokens(rawValue, tokens)
      text = label ? `${label}  ${value}` : value
    }

    text = text.trim()
    if (text) parts.push(text)
  }

  let prompt = parts.join('\n')

  if (state.selectedBonusPrompts.size > 0) {
    const bonusLines = Array.from(state.selectedBonusPrompts).map(t => `- ${t}`)
    prompt += '\n\n## Bonus Constraints\n' + bonusLines.join('\n')
  }

  return prompt
}
