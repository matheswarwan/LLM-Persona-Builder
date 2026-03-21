import { useTheme, type Theme } from '../context/ThemeContext'

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark',  label: 'Dark',  icon: '🌙' },
  { value: 'dim',   label: 'Dim',   icon: '🌫️' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      className="flex rounded-lg overflow-hidden border"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-input)' }}
    >
      {themes.map(t => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          title={t.label}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all"
          style={{
            background: theme === t.value ? 'var(--accent)' : 'transparent',
            color: theme === t.value ? '#fff' : 'var(--text-secondary)',
          }}
        >
          <span>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  )
}
