import { describe, expect, it, vi } from 'vitest'
import {
  DIRECTORY_THREAD_PREFIX,
  ensureDirectoryThread,
  formatDirectQuoteMessage,
  isDirectoryThreadId,
  openVendorDm,
} from './directQuote.js'

describe('vendor DM & in-chat quote request helpers', () => {
  it('creates and reuses a deterministic directory thread id', () => {
    let state = { customer: [] }
    const setThreads = (updater) => { state = updater(state) }
    const id1 = ensureDirectoryThread({
      setThreads,
      vendorId: 'v-staff-001',
      vendorName: 'Vanguard Architects Consultants',
      cat: 'staff',
      city: 'Bengaluru',
    })
    const id2 = ensureDirectoryThread({
      setThreads,
      vendorId: 'v-staff-001',
      vendorName: 'Vanguard Architects Consultants',
      cat: 'staff',
      city: 'Bengaluru',
    })
    expect(id1).toBe(`${DIRECTORY_THREAD_PREFIX}v-staff-001`)
    expect(id2).toBe(id1)
    expect(isDirectoryThreadId(id1)).toBe(true)
    expect(state.customer).toHaveLength(1)
    expect(state.customer[0].name).toBe('Vanguard Architects Consultants')
  })

  it('opens a directory vendor DM cleanly when signed in', async () => {
    const nav = { go: vi.fn() }
    let state = { customer: [] }
    const setThreads = (updater) => { state = updater(state) }
    await openVendorDm({
      me: { loggedIn: true },
      nav,
      setThreads,
      vendorId: 'v-staff-001',
      vendorName: 'Vanguard Architects Consultants',
      cat: 'staff',
      city: 'Bengaluru',
      isDirectory: true,
    })
    expect(nav.go).toHaveBeenCalledWith('chat', {
      id: 'dir-v-staff-001',
      vendorId: 'v-staff-001',
      vendorName: 'Vanguard Architects Consultants',
      cat: 'staff',
      city: 'Bengaluru',
      isDirectory: '1',
    })
  })

  it('formats requirements and quote request details cleanly for chat messages', () => {
    const body = formatDirectQuoteMessage({
      kind: 'service',
      title: 'Office interior design',
      scope: '2,400 sq ft turnkey floor plan',
      quantity: '1 project',
      budget: '₹3,00,000',
      deadline: '2026-12-15',
    })
    expect(body).toContain('Quote Request (Service)')
    expect(body).toContain('Need: Office interior design')
    expect(body).toContain('Requirements: 2,400 sq ft turnkey floor plan')
    expect(body).toContain('Quantity: 1 project')
    expect(body).toContain('Budget: ₹3,00,000')
    expect(body).toContain('Needed by: 2026-12-15')
  })
})
