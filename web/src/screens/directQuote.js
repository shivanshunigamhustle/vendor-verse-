import { openAuthDialog } from '../components/MarketplaceAuthDialog.jsx'
import { authService } from '../services/authService.js'

export const DIRECTORY_THREAD_PREFIX = 'dir-'

export const isDirectoryThreadId = (id) => String(id || '').startsWith(DIRECTORY_THREAD_PREFIX)

/**
 * Ensures a local DM thread exists in `app.threads.customer` for a directory vendor
 * (used when the vendor is from the directory catalog rather than a live DB row).
 */
export function ensureDirectoryThread({ setThreads, vendorId, vendorName, cat, city }) {
  const threadId = `${DIRECTORY_THREAD_PREFIX}${vendorId}`
  if (typeof setThreads === 'function') {
    setThreads((prev) => {
      const list = prev?.customer || []
      if (list.some((t) => t.id === threadId)) return prev
      const nextThread = {
        id: threadId,
        vendorId,
        name: vendorName || 'Vendor',
        cat: cat || 'elec',
        city: city || '',
        isDirectory: true,
        ctx: 'Vendor chat',
        unread: 0,
        msgs: [],
      }
      return { ...prev, customer: [nextThread, ...list] }
    })
  }
  return threadId
}

/**
 * Opens a vendor's DM (`chat`). Gates unauthenticated users through sign-in
 * and resumes straight into that vendor's DM afterward.
 */
export async function openVendorDm({
  me,
  nav,
  setThreads,
  vendorId,
  vendorName,
  categoryId,
  cat,
  city,
  listingId,
  isDirectory = false,
  onError,
}) {
  if (!vendorId) return
  const nextParams = {
    vendorId,
    ...(vendorName ? { vendorName } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(cat ? { cat } : {}),
    ...(city ? { city } : {}),
    ...(listingId ? { listingId } : {}),
    ...(isDirectory ? { isDirectory: '1' } : {}),
  }

  if (!me?.loggedIn) {
    openAuthDialog('signin', 'customer', { next: 'chat', nextParams })
    return
  }

  if (isDirectory || !authService.isRemote) {
    const id = ensureDirectoryThread({ setThreads, vendorId, vendorName, cat, city })
    nav.go('chat', { ...nextParams, id })
    return
  }

  const res = await authService.startConversation(vendorId, listingId)
  if (!res.ok) {
    onError?.(res.message || 'Could not open a conversation.')
    return
  }
  nav.go('chat', { ...nextParams, id: res.conversation.id })
}

/**
 * Formats requirements / quote request details as a readable DM message inside chat.
 */
export function formatDirectQuoteMessage({
  kind = 'service',
  title,
  scope,
  quantity,
  budget,
  deadline,
}) {
  const lines = [
    `Quote Request (${kind === 'goods' ? 'Goods' : 'Service'})`,
    `Need: ${String(title || '').trim()}`,
    `Requirements: ${String(scope || '').trim()}`,
  ]
  if (String(quantity || '').trim()) lines.push(`Quantity: ${String(quantity).trim()}`)
  if (String(budget || '').trim()) lines.push(`Budget: ${String(budget).trim()}`)
  if (String(deadline || '').trim()) lines.push(`Needed by: ${String(deadline).trim()}`)
  return lines.join('\n')
}
