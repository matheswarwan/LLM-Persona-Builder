import { useState, useEffect, useCallback } from 'react'
import type { StoredPersona, CustomPersona } from '../types'

const API = '/api/personas'

export function useStoredPersonas() {
  const [personas, setPersonas] = useState<StoredPersona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPersonas = useCallback(async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as StoredPersona[]
      setPersonas(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPersonas() }, [fetchPersonas])

  async function createPersona(persona: CustomPersona): Promise<StoredPersona> {
    const body = {
      name: persona.name,
      role: persona.role,
      tone: persona.tone,
      primary_objective: persona.primaryObjective,
      secondary_expertise: persona.secondaryExpertise,
    }
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json() as { error?: string }
      throw new Error(err.error ?? `HTTP ${res.status}`)
    }
    const created = await res.json() as StoredPersona
    setPersonas(prev => [...prev, created])
    return created
  }

  async function deletePersona(id: string) {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    setPersonas(prev => prev.filter(p => p.id !== id))
  }

  return { personas, loading, error, createPersona, deletePersona, refresh: fetchPersonas }
}
