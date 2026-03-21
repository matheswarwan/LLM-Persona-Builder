export interface PersonaRow {
  section: string
  persona: string | null
  sectionHeader: string | null
  label: string | null
  value: string | null
  valueTemplate: string | null
}

export interface SectionDef {
  code: string
  description: string
  default: boolean
}

export interface MoodDef {
  name: string
  description: string
}

export interface ApproachDef {
  name: string
  description: string
}

export interface BonusPrompt {
  category: string
  text: string
}

export interface AppData {
  personas: string[]
  moods: MoodDef[]
  approaches: ApproachDef[]
  sections: SectionDef[]
  rows: PersonaRow[]
  defaults: {
    userName: string
    assistantName: string
    location: string
    persona: string
    mood: string
    approach: string
    randomness: string
    randomFactsTopics: string
    storyAuthors: string
  }
  bonusPrompts: BonusPrompt[]
}

export interface CustomPersona {
  name: string
  role: string
  tone: string
  primaryObjective: string
  secondaryExpertise: string
}

/** A persona stored in the backend (D1) */
export interface StoredPersona {
  id: string
  name: string
  role: string
  tone: string
  primary_objective: string
  secondary_expertise: string
  created_at: string
}

export interface FormState {
  userName: string
  assistantName: string
  location: string
  persona: string
  mood: string
  approach: string
  randomness: string
  enabledSections: Record<string, boolean>
  randomFactsTopics: string
  storyAuthors: string
  customPersona1: CustomPersona
  customPersona2: CustomPersona
  selectedBonusPrompts: Set<string>
}
