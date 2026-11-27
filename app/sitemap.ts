import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/catalog'
import { getAllNews } from '@/lib/news'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutraliveingredients.com').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/applications`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/custom-processing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/quality`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const [products, news] = await Promise.all([getProducts('en'), getAllNews('en')])

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const newsRoutes: MetadataRoute.Sitemap = news.map((a) => ({
    url: `${SITE_URL}/news/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(a.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...newsRoutes]
}
