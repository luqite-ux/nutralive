import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, FileCheck2, FlaskConical, Leaf, Mail, MapPin, Package, Phone, ShieldCheck } from 'lucide-react'
import { PageHero } from '@/components/site/page-hero'
import { ProductCard } from '@/components/site/product-card'
import { ProductDetailGallery, ProductHeroGallery, type GalleryItem } from '@/components/products/product-gallery'
import { RfqForm } from '@/components/site/rfq-form'
import { getProductBySlug, getProducts, TRADE_TERMS } from '@/lib/catalog'
import { getSector } from '@/lib/sectors'
import { COMPANY, CONTAINER, IMG } from '@/lib/site'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nutraliveingredients.com').replace(/\/$/, '')

export async function generateStaticParams() {
  const products = await getProducts('en')
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await getProductBySlug(slug, 'en')
  if (!p) return { title: 'Product not found' }
  const title = p.seoTitle || p.name
  const description =
    p.seoDescription ||
    `${p.name} (${p.spec}) supplied by ${COMPANY.legalName}. View full technical specifications, COA, sample and MOQ options.`
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/products/${p.slug}` },
    openGraph: {
      title: `${title} | NutraLive`,
      description,
      url: `${SITE_URL}/products/${p.slug}`,
      images: p.image ? [{ url: p.image, alt: p.name }] : [{ url: IMG.banner1, alt: p.name }],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, allProducts] = await Promise.all([getProductBySlug(slug, 'en'), getProducts('en')])
  if (!product) notFound()

  const related = allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4)
  const sectors = product.sectors.map((s) => getSector(s)).filter(Boolean)

  const badges = [
    { icon: Package, label: 'MOQ', value: TRADE_TERMS.moq },
    { icon: FlaskConical, label: 'Sample', value: TRADE_TERMS.sample },
    { icon: FileCheck2, label: 'Documents', value: TRADE_TERMS.coa },
    { icon: Clock, label: 'Lead time', value: TRADE_TERMS.leadTime },
  ]

  const extraSpecRows = Object.entries(product.specs).filter(
    ([k]) => !['product name', 'category'].includes(k.toLowerCase()),
  )
  const rows: [string, string][] = [
    ['Product name', product.name],
    ['Category', product.categoryName],
    ...(extraSpecRows.length > 0
      ? extraSpecRows
      : [
          ['CAS No.', product.cas ?? '—'],
          ['Source', product.source],
          ['Specification', product.spec],
          ['Test method', product.method],
          ['Appearance', product.appearance],
          ['Form', product.form],
        ] as [string, string][]),
    ['Packaging', TRADE_TERMS.packaging],
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${SITE_URL}/products/${product.slug}#product`,
        name: product.name,
        description: product.description || `${product.name} — ${product.spec}`,
        category: product.categoryName,
        image: product.gallery.length > 0 ? product.gallery : [IMG.banner1],
        brand: { '@type': 'Brand', name: COMPANY.brand },
        manufacturer: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
          { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/products/${product.slug}` },
        ],
      },
    ],
  }

  const heroGallery = product.gallery.length > 0 ? product.gallery.slice(0, 3) : (product.image ? [product.image] : [])
  const detailPhotos: GalleryItem[] = [
    ...product.gallery.slice(3).map((url, idx) => ({
      url,
      alt: `${product.name} material close-up view ${idx + 4}`,
      caption: `${product.name} — close-up material appearance and texture (${idx + 1})`,
    })),
    {
      url: IMG.packaging,
      alt: 'NutraLive sample bottles and aluminum foil pouches',
      caption: 'Sample dispatch format: NutraLive-labelled bottles and sealed aluminum foil pouches with COA & SPEC.',
    },
    {
      url: IMG.warehouse,
      alt: '25 kg fiber drums stacked on pallets in NutraLive warehouse',
      caption: 'Commercial bulk packaging: 25 kg fiber drums with double food-grade inner liner, palletized for export.',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow={product.categoryName}
        title={product.name}
        description={`${product.spec} · ${product.form}`}
        crumbs={[{ label: 'Products', href: '/products' }, { label: product.name }]}
      />

      <section className="bg-white py-12 lg:py-16">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[1.05fr_1fr]`}>
          <div>
            <ProductHeroGallery productName={product.name} images={heroGallery} />
          </div>

          <div>
            {product.description && (
              <p className="mb-6 text-base leading-relaxed text-foreground/90">{product.description}</p>
            )}

            <ul className="grid gap-3 sm:grid-cols-2">
              {badges.map((b) => (
                <li key={b.label} className="flex items-start gap-3 rounded-xl border border-sage bg-cream p-4">
                  <b.icon className="mt-0.5 size-5 shrink-0 text-forest" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-leaf-dark">{b.label}</p>
                    <p className="mt-0.5 text-sm font-medium text-forest-deep">{b.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            {product.organic && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-forest">
                <Leaf className="size-4" aria-hidden="true" /> USDA NOP organic product list (CERES GmbH)
              </p>
            )}

            <h2 className="mt-8 font-sans text-xl font-semibold text-forest-deep">Specification</h2>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-sage">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">{product.name} specification</caption>
                <tbody>
                  {rows.map(([k, v]) => (
                    <tr key={k} className="border-b border-sage last:border-0">
                      <th scope="row" className="w-2/5 bg-cream px-4 py-3 font-semibold text-forest-deep">
                        {k}
                      </th>
                      <td className="px-4 py-3 text-foreground/85">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {product.features.length > 0 && (
              <>
                <h2 className="mt-8 font-sans text-xl font-semibold text-forest-deep">Key product features</h2>
                <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 className="mt-8 font-sans text-xl font-semibold text-forest-deep">Typical applications</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.uses.map((u) => (
                <li key={u} className="rounded-full border border-sage bg-white px-3 py-1 text-sm text-forest-deep">
                  {u}
                </li>
              ))}
            </ul>
            {sectors.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                Health sectors:{' '}
                {sectors.map((s, i) => (
                  <span key={s!.slug}>
                    {i > 0 && ', '}
                    <Link href={`/applications#${s!.slug}`} className="font-medium text-forest hover:underline">
                      {s!.name}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-sage bg-white py-14 lg:py-20">
        <div className={CONTAINER}>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-dark">Product Visual Details</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep">
              Material Appearance, Sample &amp; Bulk Packaging
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Inspect real lot photography, particle texture, sample dispatch bottles and 25 kg fiber-drum export packaging. Click any image to zoom.
            </p>
          </div>
          <div className="mt-8">
            <ProductDetailGallery productName={product.name} items={detailPhotos} />
          </div>
        </div>
      </section>

      <section id="rfq" className="border-y border-sage bg-cream py-14 lg:py-20">
        <div className={`${CONTAINER} grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]`}>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-dark">Product inquiry</p>
              <h2 className="mt-2 text-3xl font-semibold">Request a quote for {product.name}</h2>
              <p className="mt-4 text-muted-foreground">
                Tell us the quantity and destination. We will reply with availability, sample options and the COA and
                SPEC for this ingredient.
              </p>
            </div>

            <div className="rounded-2xl border border-sage bg-white p-6">
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-forest-deep">
                Direct supply support
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-foreground/85">
                <li className="flex items-start gap-3">
                  <FileCheck2 className="mt-0.5 size-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                  <span>Full COA, SPEC sheet, SDS and flow chart provided with every inquiry</span>
                </li>
                <li className="flex items-start gap-3">
                  <FlaskConical className="mt-0.5 size-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                  <span>Evaluation samples shipped in NutraLive-labelled bottles or foil pouches</span>
                </li>
                <li className="flex items-start gap-3">
                  <Package className="mt-0.5 size-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                  <span>Standard MOQ from 25 kg; custom granulation, premix, tablets &amp; capsules from 500 kg</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                  <span>ISO 9001 · ISO 22000 · HACCP · Halal · USDA NOP Organic certified supply</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-sage bg-white p-6">
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-forest-deep">
                Direct Contact — {COMPANY.legalName}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-foreground/85">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden="true" />
                  <a href={`mailto:${COMPANY.email}`} className="font-medium text-forest hover:underline">
                    {COMPANY.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden="true" />
                  <span className="flex flex-col">
                    {COMPANY.phones.map((p) => (
                      <a key={p.href} href={p.href} className="hover:text-forest hover:underline">
                        {p.label}
                      </a>
                    ))}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden="true" />
                  <span className="text-muted-foreground">{COMPANY.address}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="rounded-3xl border border-sage bg-white p-7 shadow-sm lg:p-9">
            <RfqForm defaultProduct={`${product.name} — ${product.spec}`} idPrefix="product-rfq" />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-14 lg:py-20">
          <div className={CONTAINER}>
            <h2 className="text-2xl font-semibold">More in {product.categoryName}</h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
