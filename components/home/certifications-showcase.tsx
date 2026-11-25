import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTAINER } from '@/lib/site'
import { SectionHeading } from '@/components/site/section-heading'
import { CertificateGallery } from '@/components/site/certificate-gallery'
import { Reveal } from '@/components/site/reveal'

export function CertificationsShowcase() {
  return (
    <section id="certifications-showcase" className="bg-white py-20 lg:py-28">
      <div className={CONTAINER}>
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Certifications"
              title="Five international certifications, each individually documented"
              description="Certificate numbers and issuing bodies are shown for every standard. Click a preview to zoom into the original certificate."
            />
            <Button asChild variant="outline" className="border-forest text-forest">
              <Link href="/quality">
                Quality system <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
        <div className="mt-12">
          <CertificateGallery />
        </div>
      </div>
    </section>
  )
}
