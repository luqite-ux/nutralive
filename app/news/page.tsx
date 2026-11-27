import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Newspaper } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { Button } from '@/components/ui/button'
import { getAllNews } from '@/lib/news'
import { CONTAINER } from '@/lib/site'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutraliveingredients.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'News',
  description: 'Company announcements, certification updates and technical notes from Nutralive Co.,Ltd.',
  alternates: { canonical: `${SITE_URL}/news` },
}

export default async function NewsPage() {
  const articles = await getAllNews('en')

  return (
    <>
      <PageHero
        eyebrow="News"
        title="Company news"
        description="Announcements, certification updates and supply notes published by Nutralive Co.,Ltd."
        crumbs={[{ label: 'News' }]}
      />
      <section className="bg-white py-14 lg:py-20">
        <div className={CONTAINER}>
          {articles.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-3xl border border-sage bg-cream p-10 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-forest ring-1 ring-sage">
                <Newspaper className="size-7" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold">No articles published yet</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Company updates and technical announcements will appear here once published. For immediate product specifications, COA documents or sample requests, contact our team directly.
              </p>
              <Button asChild size="lg" className="mt-6 bg-forest hover:bg-forest-deep">
                <Link href="/contact#rfq">
                  Contact our team <ArrowRight />
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <li key={a.slug} className="h-full">
                  <Link
                    href={`/news/${a.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sage bg-white transition-all hover:-translate-y-1 hover:border-leaf/60"
                  >
                    {a.image && (
                      <div className="aspect-[16/10] w-full overflow-hidden bg-cream">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={a.image}
                          alt={a.title}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <time className="text-xs font-medium text-muted-foreground">
                        {new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                      <h2 className="mt-2 line-clamp-2 font-sans text-xl font-semibold text-forest-deep group-hover:underline">
                        {a.title}
                      </h2>
                      {a.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                      )}
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-forest">
                        Read article <ArrowRight className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
