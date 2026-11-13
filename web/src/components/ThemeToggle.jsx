import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.jsx'

export function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const darkTheme = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`vv-theme-toggle ${className}`}
      aria-label={`Switch to ${darkTheme ? 'light' : 'dark'} mode`}
      title={`Switch to ${darkTheme ? 'light' : 'dark'} mode`}
    >
      {darkTheme ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
