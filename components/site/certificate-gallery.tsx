'use client'

import { useState } from 'react'
import { BadgeCheck, Building2, ZoomIn } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { CERTIFICATES, type Certificate } from '@/lib/certificates'
import { Reveal } from './reveal'

export function CertificateGallery({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<Certificate | null>(null)

  return (
    <>
      <ul className={compact ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-5' : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'}>
        {CERTIFICATES.map((c, i) => (
          <li key={c.id}>
            <Reveal delay={i * 70} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-sage bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(22,54,26,0.3)]">
                <button
                  type="button"
                  onClick={() => setActive(c)}
                  aria-label={`Zoom ${c.name} certificate`}
                  className="group relative block aspect-[4/3] w-full overflow-hidden border-b border-sage bg-cream p-3 focus-visible:outline-2 focus-visible:outline-leaf"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={`${c.name} original certificate for Nutralive Co.,Ltd`}
                    loading="lazy"
                    className="size-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-forest shadow">
                    <ZoomIn className="size-3.5" aria-hidden="true" /> Zoom
                  </span>
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-sans text-lg font-semibold text-forest-deep">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.short}</p>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    <div className="flex items-start gap-2">
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
                      <div>
                        <dt className="text-xs text-muted-foreground">{c.numberLabel}</dt>
                        <dd className="font-semibold tabular-nums text-forest-deep">{c.number}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
                      <div>
                        <dt className="text-xs text-muted-foreground">Issuing body</dt>
                        <dd className="text-foreground/90">{c.issuer}</dd>
                        <dd className="text-xs text-muted-foreground">{c.accreditation}</dd>
                      </div>
                    </div>
                  </dl>
                  {!compact && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.scope}</p>}
                  {c.validity && <p className="mt-auto pt-4 text-xs font-medium text-forest">{c.validity}</p>}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-auto bg-white p-4 sm:p-6">
          <DialogTitle className="font-sans text-lg text-forest-deep">{active?.name}</DialogTitle>
          <DialogDescription>
            {active?.numberLabel}: {active?.number} · {active?.issuer}
          </DialogDescription>
          {active?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={active.image}
              alt={`${active.name} original certificate`}
              className="mx-auto h-auto max-h-[75vh] w-auto max-w-full rounded-md border border-sage object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
