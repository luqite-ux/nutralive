import { unstable_cache } from 'next/cache'
import { getPublicSupabase } from '@/lib/supabase/server'
import { getLocalizedList, getLocalizedText, type I18nField } from '@/lib/i18n'
import fullDatabaseRaw from '@/data/full-ingredient-database.json'

export type CategorySlug =
  | 'herbal-extracts'
  | 'amino-acids'
  | 'functional-ingredients'
  | 'organic-ingredients'

export type CatalogCategory = {
  id: string
  slug: CategorySlug
  name: string
  description: string
  image?: string
  sortOrder: number
}

export type CatalogProduct = {
  id: string
  slug: string
  name: string
  category: CategorySlug
  categoryName: string
  description: string
  spec: string
  cas?: string
  source: string
  method: string
  appearance: string
  form: string
  organic: boolean
  image: string
  gallery: string[]
  specs: Record<string, string>
  features: string[]
  uses: string[]
  advantages: string[]
  sectors: string[]
  seoTitle?: string
  seoDescription?: string
  updatedAt?: string
}

export type FullIngredientRow = {
  name: string
  category: string
  spec: string
  cas?: string
  source?: string
  method?: string
  organic?: boolean
}

export const TRADE_TERMS = {
  moq: '25 kg standard · 500 kg custom processing / OEM',
  sample: 'Free samples for qualified commercial inquiries; paid courier option available',
  coa: 'COA & SPEC supplied with every lot',
  leadTime: '7–10 days for standard stock items',
  packaging: '25 kg fiber drum (bulk) · NutraLive-labelled bottles & foil pouches (samples)',
} as const

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID?.trim() || '9a34602d-2259-4314-99bd-428d72634344'

function inferSectors(product: { name: string; category: string; uses: string[]; description: string }): string[] {
  const hay = `${product.name} ${product.uses.join(' ')} ${product.description}`.toLowerCase()
  const out = new Set<string>()
  if (/skin|collagen|antioxidant|phycocyanin|astaxanthin|hyaluronic|grape|resveratrol|green tea|cosmetic|beauty|pearl|tocopherol/.test(hay)) out.add('skin-care')
  if (/joint|turmeric|curcumin|boswellia|glucosamine|chondroitin|msm|hyaluronic|ginger|cissus|collagen/.test(hay)) out.add('joint-health')
  if (/cardio|berberine|coq10|coenzyme|omega|dha|phytosterol|hawthorn|garlic|ginkgo|resveratrol|beet|polyphenol|nattokinase|red yeast/.test(hay)) out.add('cardiovascular-health')
  if (/cognit|brain|memory|ginkgo|phosphatidyl|lion|bacopa|theanine|ashwagandha|rhodiola|dha|nmn|focus|neuro/.test(hay)) out.add('cognition-improvement')
  if (/sport|muscle|amino|bcaa|leucine|isoleucine|valine|glutamine|arginine|citrulline|carnitine|taurine|creatine|beet|protein|chlorella|spirulina|maca|tribulus|tongkat/.test(hay)) out.add('sports-nutrition')
  if (/vision|eye|lutein|zeaxanthin|bilberry|blueberry|astaxanthin|marigold|anthocyanin/.test(hay)) out.add('vision-protection')
  if (out.size === 0) out.add('cardiovascular-health')
  return [...out]
}

const fetchCategoriesCached = unstable_cache(
  async (locale: string): Promise<CatalogCategory[]> => {
    const supabase = getPublicSupabase()
    if (!supabase) return []
    const { data, error } = await supabase
      .from('product_categories')
      .select('id,slug,name,name_i18n,description,description_i18n,image_url,sort_order')
      .eq('tenant_id', TENANT_ID)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data) return []
    return data.map((row) => ({
      id: row.id,
      slug: row.slug as CategorySlug,
      name: getLocalizedText(row.name_i18n as I18nField, locale, row.name || row.slug),
      description: getLocalizedText(row.description_i18n as I18nField, locale, row.description || ''),
      image: row.image_url || undefined,
      sortOrder: row.sort_order ?? 0,
    }))
  },
  ['nutralive-categories'],
  { revalidate: 60 },
)

const fetchProductsCached = unstable_cache(
  async (locale: string): Promise<CatalogProduct[]> => {
    const supabase = getPublicSupabase()
    if (!supabase) return []
    const [catsRes, prodsRes] = await Promise.all([
      supabase
        .from('product_categories')
        .select('id,slug,name,name_i18n')
        .eq('tenant_id', TENANT_ID),
      supabase
        .from('products')
        .select(
          'id,slug,name,name_i18n,category_id,description,description_i18n,image_url,specs,features_i18n,applications_i18n,advantages_i18n,extra_data,updated_at,sort_order',
        )
        .eq('tenant_id', TENANT_ID)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true }),
    ])

    if (prodsRes.error || !prodsRes.data) return []
    const catById = new Map<string, { slug: CategorySlug; name: string }>()
    for (const c of catsRes.data ?? []) {
      catById.set(c.id, {
        slug: c.slug as CategorySlug,
        name: getLocalizedText(c.name_i18n as I18nField, locale, c.name || c.slug),
      })
    }

    return prodsRes.data.map((row) => {
      const cat = (row.category_id && catById.get(row.category_id)) || {
        slug: 'herbal-extracts' as CategorySlug,
        name: 'Herbal Extracts',
      }
      const rawSpecs = (row.specs && typeof row.specs === 'object' ? row.specs : {}) as Record<string, unknown>
      const specs: Record<string, string> = {}
      for (const [k, v] of Object.entries(rawSpecs)) {
        if (v !== null && v !== undefined && String(v).trim()) {
          specs[k] = String(v).trim()
        }
      }
      const extra = (row.extra_data && typeof row.extra_data === 'object' ? row.extra_data : {}) as Record<string, unknown>
      const galleryRaw = Array.isArray(extra.gallery_images)
        ? (extra.gallery_images as unknown[]).filter((u): u is string => typeof u === 'string' && u.startsWith('http'))
        : []
      const primaryImg = row.image_url || galleryRaw[0] || ''
      const gallery = [...new Set([primaryImg, ...galleryRaw].filter(Boolean))]
      const name = getLocalizedText(row.name_i18n as I18nField, locale, row.name || row.slug)
      const description = getLocalizedText(row.description_i18n as I18nField, locale, row.description || '')
      const features = getLocalizedList(row.features_i18n as Record<string, string[]>, locale, [])
      const uses = getLocalizedList(row.applications_i18n as Record<string, string[]>, locale, ['Dietary supplements', 'Functional food & beverage'])
      const advantages = getLocalizedList(row.advantages_i18n as Record<string, string[]>, locale, [])
      const spec = specs['Specification'] || specs['Assay / Spec'] || specs['Active Content'] || specs['Spec'] || 'Standardized commercial specification'
      const cas = specs['CAS No.'] || specs['CAS'] || undefined
      const source = specs['Botanical / Raw Source'] || specs['Source'] || specs['Origin'] || 'Selected botanical & nutraceutical raw material'
      const method = specs['Test Method'] || specs['Assay Method'] || 'HPLC / UV / GC'
      const appearance = specs['Appearance'] || 'Fine powder / oil concentrate'
      const form = specs['Form'] || (/oil|liquid/i.test(`${name} ${appearance}`) ? 'Oil / liquid concentrate' : 'Fine powder')
      const organic = cat.slug === 'organic-ingredients' || /organic/i.test(name)
      const seoTitle = getLocalizedText(extra.seo_title_i18n as I18nField, locale, '')
      const seoDescription = getLocalizedText(extra.seo_description_i18n as I18nField, locale, '')

      return {
        id: row.id,
        slug: row.slug,
        name,
        category: cat.slug,
        categoryName: cat.name,
        description,
        spec,
        cas,
        source,
        method,
        appearance,
        form,
        organic,
        image: primaryImg,
        gallery,
        specs,
        features,
        uses,
        advantages,
        sectors: inferSectors({ name, category: cat.slug, uses, description }),
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        updatedAt: row.updated_at || undefined,
      }
    })
  },
  ['nutralive-products'],
  { revalidate: 60 },
)

export async function getCategories(locale = 'en'): Promise<CatalogCategory[]> {
  return fetchCategoriesCached(locale)
}

export async function getProducts(locale = 'en'): Promise<CatalogProduct[]> {
  return fetchProductsCached(locale)
}

export async function getProductBySlug(slug: string, locale = 'en'): Promise<CatalogProduct | undefined> {
  const list = await fetchProductsCached(locale)
  return list.find((p) => p.slug === slug)
}

export async function getProductsBySector(sectorSlug: string, locale = 'en'): Promise<CatalogProduct[]> {
  const list = await fetchProductsCached(locale)
  return list.filter((p) => p.sectors.includes(sectorSlug))
}

export function getFullIngredientDatabase(): FullIngredientRow[] {
  const items = Array.isArray(fullDatabaseRaw)
    ? fullDatabaseRaw
    : (fullDatabaseRaw as { items?: unknown[] })?.items ?? []
  return (items as Record<string, unknown>[]).map((item) => ({
    name: String(item.name || item.product_name || '').trim(),
    category: String(item.category || 'Herbal Extracts').trim(),
    spec: String(item.spec || item.specification || 'Standardized specification').trim(),
    cas: item.cas ? String(item.cas).trim() : undefined,
    source: item.source ? String(item.source).trim() : undefined,
    method: item.method ? String(item.method).trim() : undefined,
    organic: Boolean(item.organic || /organic/i.test(String(item.category || '') + ' ' + String(item.name || ''))),
  })).filter((r) => r.name.length > 0)
}
