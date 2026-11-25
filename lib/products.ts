export type {
  CategorySlug,
  CatalogCategory as Category,
  CatalogProduct as Product,
  FullIngredientRow,
} from './catalog'
export { TRADE_TERMS } from './catalog'

export type SectorSlug =
  | 'skin-care'
  | 'joint-health'
  | 'cardiovascular-health'
  | 'cognition-improvement'
  | 'sports-nutrition'
  | 'vision-protection'

export type Crop = { x: number; y: number; scale?: number; zoom?: number }
