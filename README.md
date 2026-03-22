# LLM Persona Builder

A web app for building structured LLM system prompts (personas) — powered by a configurable prompt engine based on JJ's LLM Personas framework.

## 🚀 Live Demo

**[https://llm-persona-builder.pages.dev](https://llm-persona-builder.pages.dev)**

---

## Features

- **14 built-in personas** — Salesforce Architect, DevOps Engineer, Socratic Tutor, Expert Editor, and more
- **Theme switching** — Light, Dark, and Dim modes
- **Configurable sections** — Toggle 13 prompt sections (Concise mode, Random Facts, A Story, System Commands, Alter-ego, etc.)
- **Mood & Approach selectors** — Tune the assistant's tone per session
- **Bonus Prompts library** — Add constraint/format/tone snippets from a curated list
- **Create custom personas** — Saved to a Cloudflare D1 backend and available across sessions
- **Copy & Download** — Copy to clipboard or download as a `.md` file

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Backend API | Cloudflare Pages Functions |
| Database | Cloudflare D1 (SQLite) |
| Hosting | Cloudflare Pages |

---

## Project Structure

```
├── extract_data.py          # One-time script: parses xlsx → src/data/personas.json
├── functions/
│   └── api/
│       └── personas.ts      # Cloudflare Pages Function (GET / POST / DELETE)
├── src/
│   ├── components/          # UI components
│   ├── context/             # ThemeContext
│   ├── data/personas.json   # Extracted persona data
│   ├── hooks/               # usePromptBuilder, useStoredPersonas
│   ├── types/               # TypeScript types
│   └── utils/promptEngine.ts# Core prompt assembly logic
└── wrangler.toml            # Cloudflare config (D1 binding)
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

> The `/api/personas` endpoint requires Cloudflare Pages to work. During local dev, stored personas will fail to load gracefully — built-in personas still work.

## Re-extracting Persona Data

If you update the source spreadsheet:

```bash
pip install openpyxl
python3 extract_data.py
```

This regenerates `src/data/personas.json`.

---

## Deploy

```bash
npm run build
CLOUDFLARE_ACCOUNT_ID=<your_account_id> npx wrangler pages deploy dist --project-name llm-persona-builder --branch main
```
