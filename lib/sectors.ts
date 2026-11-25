import type { SectorSlug } from './products'

export type Sector = {
  slug: SectorSlug
  name: string
  summary: string
  focus: string[]
}

export const SECTORS: Sector[] = [
  {
    slug: 'skin-care',
    name: 'Skin Care',
    summary:
      'Antioxidant, collagen-support and hydration ingredients for beauty-from-within supplements and cosmetic formulations.',
    focus: ['Beauty-from-within supplements', 'Cosmetic actives', 'Antioxidant systems'],
  },
  {
    slug: 'joint-health',
    name: 'Joint Health',
    summary:
      'Mobility and cartilage-support actives for tablets, capsules and powdered joint formulas.',
    focus: ['Mobility formulas', 'Cartilage support', 'Botanical joint blends'],
  },
  {
    slug: 'cardiovascular-health',
    name: 'Cardiovascular Health',
    summary:
      'Lipid-management, heart-support and vascular wellness ingredients including DHA, CoQ10 and phytosterols.',
    focus: ['Omega-3 and heart health', 'Lipid management', 'Vascular wellness'],
  },
  {
    slug: 'cognition-improvement',
    name: 'Cognition Improvement',
    summary:
      'Focus, memory and healthy-aging ingredients for nootropic and brain-support formulas.',
    focus: ['Focus and relaxation', 'Brain-support blends', 'Healthy aging'],
  },
  {
    slug: 'sports-nutrition',
    name: 'Sports Nutrition',
    summary:
      'Amino acids, BCAA blends and performance botanicals for powders, stick packs and pre-workout formulas.',
    focus: ['BCAA and EAA blends', 'Pre-workout formulas', 'Recovery nutrition'],
  },
  {
    slug: 'vision-protection',
    name: 'Vision Protection',
    summary:
      'Carotenoids and anthocyanin extracts for eye-health softgels, tablets and capsules.',
    focus: ['Macular support', 'Eye-health softgels', 'Antioxidant carotenoids'],
  },
]

export function getSector(slug: string) {
  return SECTORS.find((s) => s.slug === slug)
}
