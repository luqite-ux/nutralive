const R2_CERTS = 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/nutralive/certs'

export type Certificate = {
  id: string
  name: string
  short: string
  number: string
  numberLabel: string
  issuer: string
  accreditation: string
  scope: string
  validity?: string
  image: string
}

export const CERTIFICATES: Certificate[] = [
  {
    id: 'iso-9001',
    name: 'ISO 9001:2015',
    short: 'Quality Management System',
    number: '36826Q01358R001',
    numberLabel: 'Certificate No.',
    issuer: 'EICC (Ench Inspection & Certification)',
    accreditation: 'IAF · CNAS',
    scope: 'Sales of herbal extracts, vitamins, amino acids and other functional food additives.',
    validity: 'Valid until 2029.07.27',
    image: `${R2_CERTS}/cert_iso9001_en.jpg`,
  },
  {
    id: 'iso-22000',
    name: 'ISO 22000:2018',
    short: 'Food Safety Management System',
    number: '164FSMS2500291',
    numberLabel: 'Certificate No.',
    issuer: 'Huazhong Certification',
    accreditation: 'IAF · CNAS',
    scope: 'Food safety management system covering ingredient supply and processing.',
    validity: 'Valid until 2028.05.28',
    image: `${R2_CERTS}/cert_iso22000_en.jpg`,
  },
  {
    id: 'haccp',
    name: 'HACCP System',
    short: 'Hazard Analysis & Critical Control Points',
    number: '164HACCP2500230',
    numberLabel: 'Certificate No.',
    issuer: 'Huazhong Certification',
    accreditation: 'CNAS',
    scope: 'HACCP food safety system covering ingredient supply and processing.',
    validity: 'Valid until 2028.05.28',
    image: `${R2_CERTS}/cert_haccp_en.jpg`,
  },
  {
    id: 'halal',
    name: 'Halal Product Certificate',
    short: 'American Halal Foundation',
    number: 'HP-7676-CH',
    numberLabel: 'AHF Certificate No.',
    issuer: 'American Halal Foundation (AHF)',
    accreditation: 'AHF 5600:2020 · MUI LPPOM · OIC/SMIIC · GSO · MS 1500',
    scope: 'Approved to manufacture halal products under the listed international halal standards.',
    validity: 'Valid Feb 17, 2026 – Feb 16, 2029',
    image: `${R2_CERTS}/cert_halal_p1.jpg`,
  },
  {
    id: 'usda-nop',
    name: 'USDA NOP Organic',
    short: 'Organic Product List',
    number: 'CE-209939',
    numberLabel: 'Operator / NOP ID 4080209939',
    issuer: 'CERES GmbH',
    accreditation: 'USDA National Organic Program',
    scope: 'Organic product listing under the USDA National Organic Program.',
    validity: 'CERES Organic Certified List',
    image: `${R2_CERTS}/cert_nop_p1.jpg`,
  },
]
