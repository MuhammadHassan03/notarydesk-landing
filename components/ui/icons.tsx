/**
 * Icon.tsx — NotaryDesk Icon System
 * ===================================
 * Uses Google Material Symbols Rounded font (loaded via globals.css).
 * Zero inline SVGs. Supports 2500+ icons out of the box.
 *
 * Handles BOTH naming conventions:
 *   <Icon name="check-circle" />   ← hyphenated
 *   <Icon name="check_circle" />   ← underscored
 * Both resolve to the same icon automatically.
 *
 * Usage:
 *   import { Icon } from '@/components/ui/icons'
 *   <Icon name="dashboard" size={20} />
 *   <Icon name="arrow-back" size={18} style={{ color: 'red' }} />
 */

import { type CSSProperties, memo } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────

export type IconName = string

export interface IconProps {
  name: IconName
  size?: number
  style?: CSSProperties
  className?: string
  fill?: boolean
}

// ── Component ─────────────────────────────────────────────────────────────

function IconBase({ name, size = 20, style, className, fill = true }: IconProps) {
  // Normalize: convert hyphens to underscores so both conventions work
  const ligature = name?.replace(/-/g, '_') ?? ''

  return (
    <span
      className={`material-symbols-rounded${className ? ` ${className}` : ''}`}
      style={{
        fontSize: size,
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        lineHeight: 1,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        WebkitFontFeatureSettings: "'liga'",
        fontFeatureSettings: "'liga'",
        ...style,
      }}
      aria-hidden="true"
    >
      {ligature}
    </span>
  )
}

export const Icon = memo(IconBase)
export default Icon
