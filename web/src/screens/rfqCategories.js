const normalizeName = (value) => String(value || '').trim().toLowerCase()

const INDUSTRY_CAT_FALLBACK = {
  i_textile: 'elec',
  i_chem: 'elec',
  i_food: 'event',
  i_edu: 'clean',
  i_fin: 'staff',
  i_media: 'office',
  i_energy: 'elec',
  i_mining: 'build',
  i_hosp: 'event',
  i_real: 'build',
  i_beauty: 'home',
  i_sport: 'clean',
  i_print: 'staff',
  i_telecom: 'office',
  i_aero: 'elec',
  i_marine: 'print',
  i_env: 'agri',
  i_lux: 'elec',
  i_print2: 'elec',
}

/** Resolves the configured category key (`CATS` id) for any of the 30 industries. */
export function resolveIndustryCat(industry) {
  if (!industry) return ''
  return industry.cat || INDUSTRY_CAT_FALLBACK[industry.id] || 'elec'
}

/**
 * Builds the category options for the RFQ form so all 30 marketplace
 * categories are always selectable alongside any live backend categories.
 */
export function buildRfqCategoryOptions({ industries = [], remoteCategories = [], listingItems = [] } = {}) {
  const remoteById = new Map()
  const remoteByName = new Map()

  for (const cat of remoteCategories) {
    if (!cat?.categoryId || !cat?.name) continue
    remoteById.set(cat.categoryId, { categoryId: cat.categoryId, name: cat.name })
    remoteByName.set(normalizeName(cat.name), { categoryId: cat.categoryId, name: cat.name })
  }

  for (const item of listingItems) {
    if (!item?.categoryId || !item?.categoryName) continue
    if (!remoteById.has(item.categoryId)) {
      remoteById.set(item.categoryId, { categoryId: item.categoryId, name: item.categoryName })
    }
    const key = normalizeName(item.categoryName)
    if (!remoteByName.has(key)) {
      remoteByName.set(key, { categoryId: item.categoryId, name: item.categoryName })
    }
  }

  const options = []
  const seenValues = new Set()
  const seenNames = new Set()

  for (const industry of industries) {
    const key = normalizeName(industry.name)
    const matchedRemote = remoteByName.get(key)
    const value = matchedRemote ? matchedRemote.categoryId : industry.id
    if (seenValues.has(value)) continue
    seenValues.add(value)
    seenNames.add(key)
    options.push({
      value,
      label: industry.name,
      industry,
      isRemote: Boolean(matchedRemote),
    })
  }

  for (const remote of remoteById.values()) {
    const key = normalizeName(remote.name)
    if (seenValues.has(remote.categoryId) || seenNames.has(key)) continue
    seenValues.add(remote.categoryId)
    seenNames.add(key)
    options.push({
      value: remote.categoryId,
      label: remote.name,
      industry: null,
      isRemote: true,
    })
  }

  return options
}

/**
 * Resolves an initial RFQ category value from route params (`categoryId` or `cat`).
 */
export function resolveInitialRfqCategory({ categoryId, cat, industries = [] } = {}) {
  if (categoryId) return categoryId
  if (!cat) return ''
  if (industries.some((industry) => industry.id === cat)) return cat
  return industries.find((industry) => industry.cat === cat)?.id || ''
}

export function servesCity(vendor, city) {
  const normalizedCity = normalizeName(city)
  if (!normalizedCity || !vendor) return false
  if (normalizeName(vendor.city) === normalizedCity) return true
  if (vendor.remote) return true
  return (vendor.areas || []).some((area) => normalizeName(area) === normalizedCity)
}

/**
 * Picks verified directory vendors matching a marketplace industry, preferring
 * vendors serving the caller's city before falling back to other verified vendors.
 */
export function selectDirectoryVendorsForIndustry({ industry, allVendors = [], city = '', limit = 12 } = {}) {
  if (!industry) return []
  const targetCat = resolveIndustryCat(industry)
  const matching = allVendors.filter((vendor) => {
    if (vendor?.status !== 'approved') return false
    if (industry.id === 'i_manu') {
      return vendor.group === 'Manufacturing and supply' || vendor.cat === 'elec'
    }
    return vendor.cat === targetCat
  })

  return [...matching]
    .sort((a, b) => {
      const aLocal = servesCity(a, city) ? 1 : 0
      const bLocal = servesCity(b, city) ? 1 : 0
      if (aLocal !== bLocal) return bLocal - aLocal
      const ratingDiff = (Number(b.rating) || 0) - (Number(a.rating) || 0)
      if (ratingDiff !== 0) return ratingDiff
      return (Number(b.reviews) || 0) - (Number(a.reviews) || 0)
    })
    .slice(0, limit)
}
