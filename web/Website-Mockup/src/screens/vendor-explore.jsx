import { Explore } from './customer1.jsx'

// Supplier marketplace for vendor buyers. It keeps the marketplace visual system
// shared with customer Explore while forcing business-supplier-only results.
export function VendorExplore({ params = {} }) {
  return <Explore params={{ ...params, mode: params.mode || 'all' }} supplierOnlyOverride hideVendorMode />
}
