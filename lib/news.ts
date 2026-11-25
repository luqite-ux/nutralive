import { unstable_cache } from 'next/cache'
import { getPublicSupabase } from '@/lib/supabase/server'
import { getLocalizedText, type I18nField } from '@/lib/i18n'

export type NewsArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  content: string
  image?: string
  updatedAt?: string
}

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID?.trim() || '9a34602d-2259-4314-99bd-428d72634344'

const fetchPublishedArticles = unstable_cache(
  async (locale: string): Promise<NewsArticle[]> => {
    const supabase = getPublicSupabase()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('articles')
      .select('id,slug,title,title_en,title_i18n,excerpt,excerpt_en,excerpt_i18n,content,content_en,content_i18n,featured_image,published_at,updated_at,sort_order')
      .eq('tenant_id', TENANT_ID)
      .eq('is_published', true)
      .is('archived_at', null)
      .order('sort_order', { ascending: true })
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('id', { ascending: true })

    if (error || !data) return []
    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: getLocalizedText(row.title_i18n as I18nField, locale, row.title_en || row.title || ''),
      excerpt: getLocalizedText(row.excerpt_i18n as I18nField, locale, row.excerpt_en || row.excerpt || ''),
      content: getLocalizedText(row.content_i18n as I18nField, locale, row.content_en || row.content || ''),
      image: row.featured_image || undefined,
      date: row.published_at || row.updated_at || new Date().toISOString(),
      updatedAt: row.updated_at || undefined,
    }))
  },
  ['nutralive-articles-v2'],
  { revalidate: 60 },
)

export async function getAllNews(locale = 'en'): Promise<NewsArticle[]> {
  return fetchPublishedArticles(locale)
}

export async function getNewsBySlug(slug: string, locale = 'en'): Promise<NewsArticle | undefined> {
  const all = await fetchPublishedArticles(locale)
  return all.find((a) => a.slug === slug)
}
