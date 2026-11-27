const R2_BASE = 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/nutralive'
const R2_PACK = `${R2_BASE}/v0-pack`

export const IMG = {
  logo: `${R2_BASE}/brand/logo-nutralive.png`,
  favicon: `${R2_BASE}/brand/favicon-nutralive.png`,
  banner1: `${R2_BASE}/banners/banner-1-botanical-extracts.jpg`,
  banner2: `${R2_BASE}/banners/banner-2-quality-lab.jpg`,
  banner3: `${R2_BASE}/banners/banner-3-oem-custom-processing.jpg`,
  phycocyanin: `${R2_PACK}/rep-phycocyanin.jpg`,
  turmeric: `${R2_PACK}/rep-turmeric.jpg`,
  tocopherol: `${R2_PACK}/rep-tocopherol-oil.jpg`,
  beetroot: `${R2_PACK}/rep-beetroot.jpg`,
  chlorella: `${R2_PACK}/rep-chlorella.jpg`,
  packaging: 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/nutralive/company-v2/packaging-samples/nutralive-packaging-samples-06.jpg',
  labHplc: `${R2_PACK}/rep-lab-hplc.jpg`,
  factory: `${R2_PACK}/rep-factory-cleanroom.jpg`,
  warehouse: `${R2_PACK}/rep-warehouse-drums.jpg`,
  certIso9001: `${R2_BASE}/certs/cert_iso9001_en.jpg`,
  certIso22000: `${R2_BASE}/certs/cert_iso22000_en.jpg`,
  certHaccp: `${R2_BASE}/certs/cert_haccp_en.jpg`,
  certHalal: `${R2_BASE}/certs/cert_halal_p1.jpg`,
  certUsdaNop: `${R2_BASE}/certs/cert_nop_p1.jpg`,
} as const

export const COMPANY = {
  legalName: 'Nutralive Co.,Ltd',
  brand: 'NutraLive',
  tagline: 'Where Health Lives',
  founded: 2019,
  address: 'Unit 2 (Fudi Center), No. 89 Kazimen, Qinhuai District, Nanjing, Jiangsu Province, China',
  phones: [
    { label: '0086 (0)25 5218 3406', href: 'tel:+862552183406' },
    { label: '0086 153 8084 0764', href: 'tel:+8615380840764' },
  ],
  email: 'info@nutraliveingredients.com',
  markets: ['Europe', 'United States', 'Asia', 'Southeast Asia'],
} as const

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Custom Processing', href: '/custom-processing' },
  { label: 'Quality', href: '/quality' },
  { label: 'About', href: '/about' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
] as const

export const CONTAINER = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'

export const FAQS = [
  {
    q: 'What are your minimum order quantities?',
    a: 'Standard stock ingredients are available from 25 kg. Custom-processed and OEM batches such as granulation, premixes, tablets and capsules start from 500 kg. Tell us your target volume in the inquiry and we will confirm the exact MOQ for the specification you need.',
  },
  {
    q: 'Do you provide samples?',
    a: 'Yes. Free samples are available for qualified commercial inquiries on selected items; other samples are offered as paid samples with courier cost. Samples ship in NutraLive-labelled bottles or foil pouches with the matching COA and specification sheet.',
  },
  {
    q: 'Which documents come with each shipment?',
    a: 'Each lot is supplied with a Certificate of Analysis (COA) and product specification (SPEC). Safety data sheets, flow charts and certificate copies are available on request during supplier qualification.',
  },
  {
    q: 'What is your typical lead time?',
    a: 'Typical lead time is 7–10 days for standard items after order confirmation. Custom processing and organic lots are scheduled per project; we confirm the timeline in the quotation.',
  },
  {
    q: 'Can you process ingredients to our own formula?',
    a: 'Yes. NutraLive offers custom granulation, premix blending, herbal extract tableting and hard capsule filling for food, dietary supplement, cosmetic and pharmaceutical manufacturers. Share your formula, target dosage form and packaging format to start.',
  },
  {
    q: 'Which certifications do you hold?',
    a: 'ISO 9001:2015, ISO 22000:2018, HACCP, Halal (American Halal Foundation) and the USDA NOP Organic Product List (CERES GmbH). Certificate numbers and issuing bodies are shown on our Quality page.',
  },
  {
    q: 'Which markets do you export to?',
    a: 'We supply end-use manufacturers, contract manufacturers, wholesalers and distributors in Europe, the United States, Asia and Southeast Asia.',
  },
] as const
