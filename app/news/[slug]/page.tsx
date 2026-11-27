import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { getNewsBySlug } from '@/lib/news'
import { COMPANY, CONTAINER } from '@/lib/site'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutraliveingredients.com').replace(/\/$/, '')

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsBySlug(slug, 'en')
  if (!article) return { title: 'Article not found' }
  return {
    title: article.title,
    description: article.excerpt || article.title,
    alternates: { canonical: `${SITE_URL}/news/${article.slug}` },
    openGraph: {
      title: `${article.title} | NutraLive`,
      description: article.excerpt || article.title,
      type: 'article',
      url: `${SITE_URL}/news/${article.slug}`,
      ...(article.image ? { images: [{ url: article.image, alt: article.title }] } : {}),
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsBySlug(slug, 'en')
  if (!article) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt || article.title,
        datePublished: article.date,
        dateModified: article.updatedAt || article.date,
        ...(article.image ? { image: [article.image] } : {}),
        publisher: { '@id': `${SITE_URL}/#organization` },
        author: { '@type': 'Organization', name: COMPANY.legalName },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
          { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/news/${article.slug}` },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="News"
        title={article.title}
        description={article.excerpt}
        crumbs={[{ label: 'News', href: '/news' }, { label: article.title }]}
      />
      <article className="bg-white py-14 lg:py-20">
        <div className={`${CONTAINER} max-w-3xl`}>
          {article.image && (
            <div className="mb-8 overflow-hidden rounded-3xl border border-sage bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.image} alt={article.title} className="aspect-[16/9] w-full object-cover" />
            </div>
          )}
          <div className="prose prose-slate max-w-none whitespace-pre-line text-base leading-relaxed text-foreground/90">
            {article.content}
          </div>
          <div className="mt-10 border-t border-sage pt-6">
            <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline">
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to News
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
