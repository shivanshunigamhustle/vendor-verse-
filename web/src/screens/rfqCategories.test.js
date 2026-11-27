import { describe, expect, it } from 'vitest'
import { INDUSTRIES, VENDORS0 } from '../data.jsx'
import {
  buildRfqCategoryOptions,
  resolveInitialRfqCategory,
  selectDirectoryVendorsForIndustry,
  servesCity,
} from './rfqCategories.js'

describe('RFQ category options', () => {
  it('includes all 30 marketplace categories even when backend listings are empty', () => {
    const options = buildRfqCategoryOptions({ industries: INDUSTRIES, remoteCategories: [], listingItems: [] })
    expect(options).toHaveLength(30)
    expect(options.map((option) => option.label)).toEqual(INDUSTRIES.map((industry) => industry.name))
    expect(new Set(options.map((option) => option.value)).size).toBe(30)
  })

  it('merges live backend categories without dropping any of the 30 industries', () => {
    const options = buildRfqCategoryOptions({
      industries: INDUSTRIES,
      remoteCategories: [
        { categoryId: 'uuid-1', name: 'Plumbing' },
        { categoryId: 'uuid-2', name: 'Construction & infrastructure' },
      ],
      listingItems: [
        { categoryId: 'uuid-3', categoryName: 'Event catering' },
      ],
    })
    expect(options.length).toBe(32)
    expect(options.find((o) => o.label === 'Construction & infrastructure')).toMatchObject({
      value: 'uuid-2',
      isRemote: true,
    })
    expect(options.find((o) => o.label === 'Plumbing')).toMatchObject({
      value: 'uuid-1',
      isRemote: true,
    })
    expect(options.find((o) => o.label === 'Event catering')).toMatchObject({
      value: 'uuid-3',
      isRemote: true,
    })
  })

  it('resolves initial category from either industry id or legacy cat code', () => {
    expect(resolveInitialRfqCategory({ categoryId: 'uuid-1', industries: INDUSTRIES })).toBe('uuid-1')
    expect(resolveInitialRfqCategory({ cat: 'i_manu', industries: INDUSTRIES })).toBe('i_manu')
    expect(resolveInitialRfqCategory({ cat: 'build', industries: INDUSTRIES })).toBe('i_constr')
    expect(resolveInitialRfqCategory({ industries: INDUSTRIES })).toBe('')
  })

  it('finds verified directory vendors for every one of the 30 industries', () => {
    for (const industry of INDUSTRIES) {
      const vendors = selectDirectoryVendorsForIndustry({ industry, allVendors: VENDORS0, city: 'Onriya' })
      expect(vendors.length).toBeGreaterThan(0)
    }
  })

  it('detects whether a vendor serves the caller city or works remotely', () => {
    expect(servesCity({ city: 'Jaipur', areas: ['Jaipur'], remote: false }, 'Jaipur')).toBe(true)
    expect(servesCity({ city: 'Bengaluru', areas: ['Bengaluru'], remote: true }, 'Onriya')).toBe(true)
    expect(servesCity({ city: 'Jaipur', areas: ['Ajmer'], remote: false }, 'Onriya')).toBe(false)
  })
})
