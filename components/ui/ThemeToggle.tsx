'use client'

import { useTheme } from '@/context/themecontext'
import { Icon } from '@/components/ui/icons'

export interface ThemeToggleProps {
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export default function ThemeToggle({ size = 'md', showLabel = false, className = '' }: ThemeToggleProps) {
  const { toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center gap-2 rounded-xl transition-all duration-200 cursor-pointer border-none
        ${showLabel ? 'px-3 py-2' : size === 'sm' ? 'w-8 h-8 justify-center' : 'w-9 h-9 justify-center'}
        ${className}
      `}
      style={{
        background: isDark ? 'rgba(255,255,255,0.08)' : 'var(--surface)',
        color: isDark ? '#FBBF24' : 'var(--text-secondary)',
      }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Icon
        name={isDark ? 'dark_mode' : 'light_mode'}
        size={size === 'sm' ? 16 : 18}
        style={{ transition: 'transform 0.3s ease', transform: isDark ? 'rotate(-20deg)' : 'rotate(0deg)' }}
      />
      {showLabel && (
        <span className="text-xs font-medium">{isDark ? 'Dark' : 'Light'}</span>
      )}
    </button>
  )
}