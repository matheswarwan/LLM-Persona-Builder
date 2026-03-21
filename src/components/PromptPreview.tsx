import { useState } from 'react'

interface Props {
  prompt: string
  personaName: string
}

export function PromptPreview({ prompt, personaName }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownload() {
    const filename = personaName
      .replace(/^#\s*/, '')
      .replace(/[^a-z0-9]+/gi, '_')
      .toLowerCase()
      .replace(/^_+|_+$/g, '')
    const blob = new Blob([prompt], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_persona.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded text-sm font-medium transition-all"
            style={copied
              ? { background: 'var(--success-bg)', color: 'var(--success)' }
              : { background: 'var(--accent)', color: '#fff' }
            }
          >
            {copied ? '✓ Copied!' : 'Copy to clipboard'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            ↓ Download .md
          </button>
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {prompt.split('\n').length} lines · {prompt.length} chars
        </div>
      </div>

      <textarea
        readOnly
        value={prompt}
        className="flex-1 w-full rounded-lg p-4 text-xs font-mono resize-none focus:outline-none leading-relaxed"
        style={{
          background: 'var(--code-bg)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        spellCheck={false}
      />
    </div>
  )
}
