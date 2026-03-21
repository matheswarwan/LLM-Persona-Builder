interface Env {
  DB: D1Database
}

interface PersonaRecord {
  id: string
  name: string
  role: string
  tone: string
  primary_objective: string
  secondary_expertise: string
  created_at: string
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

function generateId(): string {
  return crypto.randomUUID()
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return json(null, 204)
  }

  const url = new URL(request.url)

  // DELETE /api/personas/:id
  const deleteMatch = url.pathname.match(/^\/api\/personas\/([^/]+)$/)
  if (request.method === 'DELETE' && deleteMatch) {
    const id = deleteMatch[1]
    await env.DB.prepare('DELETE FROM personas WHERE id = ?').bind(id).run()
    return json({ success: true })
  }

  // GET /api/personas — list all user-created personas
  if (request.method === 'GET') {
    const result = await env.DB.prepare(
      'SELECT * FROM personas ORDER BY created_at ASC'
    ).all<PersonaRecord>()
    return json(result.results)
  }

  // POST /api/personas — create a new persona
  if (request.method === 'POST') {
    let body: Partial<PersonaRecord>
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }

    const name = (body.name ?? '').trim()
    if (!name) {
      return json({ error: 'name is required' }, 400)
    }

    const record: PersonaRecord = {
      id: generateId(),
      name: name.startsWith('#') ? name : `# ${name}`,
      role: (body.role ?? '').trim(),
      tone: (body.tone ?? '').trim(),
      primary_objective: (body.primary_objective ?? '').trim(),
      secondary_expertise: (body.secondary_expertise ?? '').trim(),
      created_at: new Date().toISOString(),
    }

    await env.DB.prepare(
      `INSERT INTO personas (id, name, role, tone, primary_objective, secondary_expertise, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        record.id,
        record.name,
        record.role,
        record.tone,
        record.primary_objective,
        record.secondary_expertise,
        record.created_at
      )
      .run()

    return json(record, 201)
  }

  return json({ error: 'Method not allowed' }, 405)
}
