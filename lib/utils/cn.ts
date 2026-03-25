/**
 * lib/cn.ts — Class name utility
 * Replaces clsx/classnames with zero dependencies.
 */

export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(' ')
}