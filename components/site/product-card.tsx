import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CatalogProduct } from '@/lib/catalog'

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sage bg-white transition-all hover:-translate-y-1 hover:border-leaf/60 hover:shadow-[0_18px_40px_-20px_rgba(22,54,26,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-cream to-accent text-sm font-medium text-forest">
            {product.name}
          </div>
        )}
        {product.organic && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-forest shadow-sm">
            USDA NOP Organic
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-leaf-dark">{product.categoryName}</p>
        <h3 className="mt-1.5 line-clamp-2 font-sans text-lg font-semibold leading-snug text-forest-deep">
          {product.name}
        </h3>
        <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-foreground/80">Spec</dt>
            <dd className="line-clamp-2">{product.spec}</dd>
          </div>
          {product.cas && (
            <div className="flex gap-2">
              <dt className="shrink-0 font-medium text-foreground/80">CAS</dt>
              <dd className="tabular-nums">{product.cas}</dd>
            </div>
          )}
        </dl>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-forest">
          View specification
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
