import { HeroBanner } from '@/components/home/hero-banner'
import { CategoryMatrix } from '@/components/home/category-matrix'
import { IngredientVisualizer } from '@/components/home/ingredient-visualizer'
import { FeaturedProducts } from '@/components/home/featured-products'
import { HealthApplications } from '@/components/home/health-applications'
import { CustomProcessingShowcase } from '@/components/home/custom-processing-showcase'
import { CertificationsShowcase } from '@/components/home/certifications-showcase'
import { FacilityQcEvidence } from '@/components/home/facility-qc-evidence'
import { GlobalPartnerSectors } from '@/components/home/global-partner-sectors'
import { FaqAndRfq } from '@/components/home/faq-and-rfq'
import { FAQS } from '@/lib/site'
import { getSiteContent } from '@/lib/site-content/site-content'

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

export default async function HomePage() {
  let contentVersion: string | undefined
  try {
    const snapshot = await getSiteContent('en')
    if (snapshot?.version) contentVersion = snapshot.version
  } catch {
    // Static fallback when site-content adapter is not yet published or configured
  }

  return (
    <div {...(contentVersion ? { 'data-hq-content-version': contentVersion } : {})}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <HeroBanner />
      <CategoryMatrix />
      <IngredientVisualizer />
      <FeaturedProducts />
      <HealthApplications />
      <CustomProcessingShowcase />
      <CertificationsShowcase />
      <FacilityQcEvidence />
      <GlobalPartnerSectors />
      <FaqAndRfq />
    </div>
  )
}
