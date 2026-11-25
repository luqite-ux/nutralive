export type I18nField = Record<string, string | null | undefined> | null | undefined

export const DEFAULT_LOCALE = 'en'
export const SUPPORTED_LOCALES = ['en'] as const
export type Locale = string

export function getLocalizedText(
  field: I18nField,
  locale: string = DEFAULT_LOCALE,
  fallback = '',
): string {
  if (field && typeof field === 'object') {
    const requested = field[locale]
    if (typeof requested === 'string' && requested.trim()) return requested.trim()
    const def = field[DEFAULT_LOCALE]
    if (typeof def === 'string' && def.trim()) return def.trim()
    for (const val of Object.values(field)) {
      if (typeof val === 'string' && val.trim()) return val.trim()
    }
  }
  return fallback
}

export function getLocalizedList(
  field: Record<string, string[] | null | undefined> | null | undefined,
  locale: string = DEFAULT_LOCALE,
  fallback: string[] = [],
): string[] {
  if (field && typeof field === 'object') {
    const requested = field[locale]
    if (Array.isArray(requested) && requested.length > 0) return requested.filter(Boolean)
    const def = field[DEFAULT_LOCALE]
    if (Array.isArray(def) && def.length > 0) return def.filter(Boolean)
    for (const val of Object.values(field)) {
      if (Array.isArray(val) && val.length > 0) return val.filter(Boolean)
    }
  }
  return fallback
}
