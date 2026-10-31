/* Business account (D-005): option lists and demo companies. Wording and shapes follow the mobile mockup (read-only reference). */
export const MIN_YEARS = 3
export const OWNER_ROLES = ['Owner / proprietor', 'Founder', 'Director', 'Managing partner']
export const NON_OWNER_ROLES = ['Manager / employee', 'Consultant / agent', 'Other']
export const ENTITY_TYPES = ['Private Limited', 'Public Limited', 'LLP', 'Partnership', 'Proprietorship', 'Co-operative', 'Other']
export const EMP_BANDS = ['1–10', '11–50', '51–200', '201–500', '501–1,000', '1,000+']
export const TURNOVER_BANDS = ['Under ₹1 crore', '₹1–5 crore', '₹5–25 crore', '₹25–100 crore', '₹100–500 crore', 'Above ₹500 crore']
export const FACILITY_TYPES = ['Head office', 'Manufacturing plant', 'Warehouse', 'Branch office', 'R&D / lab', 'Showroom']
export const INCOTERMS = ['EXW', 'FOB', 'CIF', 'DAP', 'DDP']
export const CERT_OPTIONS = ['ISO 9001', 'ISO 14001', 'ISO 45001', 'BIS / ISI', 'CE', 'UL', 'RoHS', 'GMP', 'FSSAI', 'IATF 16949']
export const COMPANY_STEPS = ['Identity', 'Industry', 'Operations', 'Compliance', 'People', 'Submit']
export const COMPANY_DOCS = ['Certificate of incorporation / registration', 'GST registration certificate', 'PAN of the company', 'Factory / trade licence', 'Quality certificates (ISO, BIS, CE…)', 'Factory photos or audit report']
export const BIZ_SERVICES = ['Raw material supply', 'Job work / contract manufacturing', 'Bulk & OEM orders', 'Logistics & warehousing', 'Equipment & tooling', 'Packaging materials', 'Quality testing & certification', 'Trade credit terms']
export const COMPANY_KINDS = {
  manufacturer: { label: 'Manufacturer', hint: 'Makes products in its own plants' },
  supplier: { label: 'Supplier / distributor', hint: 'Stocks and supplies goods in bulk' },
  contractor: { label: 'Contractor', hint: 'Builds or installs for clients' },
  service: { label: 'Service company', hint: 'Delivers services at company scale' },
}
export const COMPANY_STATUS = {
  not_started: ['Not started', 'gray'], draft: ['Draft', 'gray'], submitted: ['Under review', 'amber'], more_info: ['More information needed', 'amber'], approved: ['Approved', 'green'], rejected: ['Rejected', 'red'],
}

const fac = (name, city, type, area) => ({ name, city, type, area })
export const COMPANIES_SEED = {
  biz1: {
    id: 'biz1', legal: 'Atlas Industrial Supply Co.', brand: 'Atlas Industrial', entity: 'Private Limited', regNo: 'U31300RJ2011PTC034512', year: '2011', gstin: '08AAACA1234A1Z5', pan: 'AAACA1234A', website: 'www.atlasindustrial.example',
    hq: { country: 'IN', state: 'Rajasthan', city: 'Jaipur', pin: '302022', addr: 'Plot 14, Sitapura Industrial Area' },
    industry: 'elec', kind: 'manufacturer', products: 'Copper cables, house wire and control cable', hs: '8544',
    facilities: [fac('Jaipur plant', 'Jaipur', 'Manufacturing plant', '85,000 sq ft'), fac('Neemrana warehouse', 'Neemrana', 'Warehouse', '30,000 sq ft')],
    employees: '201–500', turnover: '₹25–100 crore', capacity: '40,000', capUnit: 'coils / month', shifts: '2', moq: '5 coils', lead: '4 days', markets: ['IN'], incoterms: ['EXW', 'DAP'],
    certs: [{ name: 'ISO 9001', expires: '31 Dec 2028' }, { name: 'BIS / ISI', expires: '30 Jun 2028' }], docs: {}, signatory: { name: 'Marcus Reed', desig: 'Director', id: 'DIN 01234567' }, contacts: 'Sales desk: orders@atlasindustrial.example', bank: { holder: 'Atlas Industrial Supply Co.', acc: '50200012345678', ifsc: 'HDFC0000123' }, clients: 'Regional EPC contractors and electrical wholesalers',
    serves: ['Raw material supply', 'Bulk & OEM orders', 'Trade credit terms'], servesNote: 'We supply cable and wire in bulk to electrical vendors with 30-day credit for verified accounts.',
    status: 'approved', submittedAt: '14 Aug 2026', decision: 'Evidence verified', eligibility: { designation: 'Director', years: 15, registered: true },
  },
  biz3: {
    id: 'biz3', legal: 'Aurora Packaging Industries', brand: 'Aurora Packaging', entity: 'LLP', regNo: 'AAB-4821', year: '2016', gstin: '08AABFA5678B1Z2', pan: 'AABFA5678B', website: 'www.aurorapack.example',
    hq: { country: 'IN', state: 'Rajasthan', city: 'Jaipur', pin: '302013', addr: 'B-22, VKI Area, Sikar Road' },
    industry: 'elec', kind: 'manufacturer', products: 'Corrugated and printed cartons, contract packing', hs: '4819',
    facilities: [fac('Jaipur factory', 'Jaipur', 'Manufacturing plant', '40,000 sq ft')],
    employees: '51–200', turnover: '₹5–25 crore', capacity: '2,000,000', capUnit: 'cartons / month', shifts: '2', moq: '500 pcs', lead: '6 days', markets: ['IN'], incoterms: ['EXW'],
    certs: [{ name: 'ISO 9001', expires: '31 Mar 2028' }], docs: {}, signatory: { name: 'Meena Shah', desig: 'Managing partner', id: 'ID 7788' }, contacts: '', bank: { holder: 'Aurora Packaging Industries', acc: '60100098765', ifsc: 'ICIC0000456' }, clients: '',
    serves: ['Packaging materials', 'Job work / contract manufacturing'], servesNote: 'Custom corrugated boxes and kitting for vendors who ship goods.',
    status: 'approved', submittedAt: '02 Sep 2026', decision: 'Evidence verified', eligibility: { designation: 'Managing partner', years: 10, registered: true },
  },
}

/* How complete a company profile is (shown as a bar on the business home). */
export function companyDone(c) {
  if (!c || c.status === 'not_started') return 0
  const keys = ['legal', 'entity', 'regNo', 'year', 'gstin', 'industry', 'kind', 'products', 'employees', 'turnover', 'capacity', 'signatory']
  const filled = keys.filter((k) => c[k] && (typeof c[k] !== 'object' || Object.values(c[k]).some(Boolean))).length + (c.facilities?.length ? 1 : 0) + (c.certs?.length ? 1 : 0) + (c.markets?.length ? 1 : 0) + (c.bank?.acc ? 1 : 0)
  return Math.round((filled / (keys.length + 4)) * 100)
}
