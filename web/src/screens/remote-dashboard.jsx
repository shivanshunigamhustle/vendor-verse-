/*
 * Real-API vendor dashboard (F-VND-10), used instead of the seed-data dashboard when
 * VITE_API_BASE_URL is set (see the registry, `live(...)`).
 *
 * Every number comes from an API the backend has today: the vendor's listings, the RFQs
 * sent to it, its own quotes on those RFQs, its booking requests and its conversations.
 * Nothing is invented:
 *  - the conversations API has no unread count and there is no enquiry-analytics API yet, so
 *    the tile counts conversations (not unread) and the "customer enquiries" trend is not
 *    shown (it stays on the seed-data dashboard);
 *  - the RFQ funnel is built from the vendor's own quotes, looked up for its 25 most recently
 *    updated RFQs, and says so when there are more.
 */
import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, BarChart3, CalendarCheck, Check, ChevronRight, ClipboardList, Clock, FileText, MessageCircle, Package, Plus, Receipt, Send, ShieldCheck, Star, Store, UserRound } from 'lucide-react'
import { Badge, Button, Card, EmptyState, Screen, Stat, StatusBadge, cx } from '../ui.jsx'
import { Links, Page } from './blocks.jsx'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { authService } from '../services/authService.js'
import { ErrorBox, useLoad } from './remote-discovery.jsx'
import { VendorWorkspace } from './vendor.jsx'

export const QUOTE_LOOKUP_LIMIT = 25
const LISTING_STATUS = [
  ['approved', 'Live'], ['pending_review', 'In review'], ['changes_requested', 'Changes requested'],
  ['draft', 'Draft'], ['paused', 'Paused'], ['rejected', 'Rejected'], ['unpublished', 'Unpublished'],
]

/** Loads the core data the dashboard shows; fails with the first error so nothing is shown half-true.
 *  Quote lookups (one request per RFQ) are loaded afterwards so the page can paint first. */
export async function loadDashboard(country) {
  const mine = await authService.listMyVendors()
  if (!mine.ok) return mine
  const vendor = mine.vendors?.[0] || null
  if (!vendor) return { ok: true, vendor: null }
  const [listings, rfqs, bookings, categories, conversations] = await Promise.all([
    authService.listVendorListings(vendor.id),
    authService.listVendorRfqs(vendor.id),
    authService.listVendorBookings(vendor.id),
    authService.listCategories({ countryCode: country }),
    authService.listConversations(),
  ])
  for (const r of [listings, rfqs, bookings]) if (!r.ok) return r
  return {
    ok: true,
    vendor,
    listings: listings.listings,
    rfqs: rfqs.rfqs,
    bookings: bookings.bookings,
    conversations: conversations.ok ? conversations.conversations.filter((c) => c.viewerRole === 'vendor') : null,
    categoryNames: new Map((categories.ok ? categories.categories : []).map((c) => [c.categoryId, c.name])),
    lookupCapped: rfqs.rfqs.length > QUOTE_LOOKUP_LIMIT,
  }
}

export function RemoteVendorDashboard() {
  const nav = useNav()
  const app = useApp()
  const country = (app.locale ?? app.loc ?? {}).country || 'IN'
  const me = app.me || {}
  const load = useCallback(() => loadDashboard(country), [country])
  const dash = useLoad(load, [load])
  const [quotes, setQuotes] = useState({ ready: false, map: new Map() })
  useEffect(() => {
    const d0 = dash.data
    if (!d0?.vendor) return undefined
    let live = true
    const looked = d0.rfqs.slice(0, QUOTE_LOOKUP_LIMIT)
    Promise.all(looked.map((rfq) => authService.listRfqQuotes(rfq.id))).then((results) => {
      if (!live) return
      const map = new Map(looked.map((rfq, i) => [rfq.id, results[i].ok ? results[i].quotes.filter((q) => q.vendorId === d0.vendor.id && q.state !== 'withdrawn') : []]))
      setQuotes({ ready: true, map })
    })
    return () => { live = false }
  }, [dash.data])

  const firstName = me.name?.split(/\s+/)[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const today = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

  if (dash.loading && !dash.data) return <VendorWorkspace><div className="vv-admin-reference-dashboard vv-vendor-reference-dashboard vx-dash-skeleton" aria-busy="true" aria-label="Loading dashboard"><div className="vx-sk vx-sk-head" /><div className="vv-admin-reference-kpis">{[0, 1, 2, 3].map((i) => <div key={i} className="vx-sk vx-sk-kpi" />)}</div><div className="vv-admin-reference-grid"><div className="vx-sk vx-sk-card" /><div className="vx-sk vx-sk-card" /></div></div></VendorWorkspace>
  if (dash.error) return <VendorWorkspace><div className="vv-admin-reference-dashboard vv-vendor-reference-dashboard"><ErrorBox message={dash.error} onRetry={dash.reload} /></div></VendorWorkspace>
  const d = dash.data
  if (!d?.vendor) return <VendorWorkspace><Screen title="Vendor" back={false}><EmptyState icon={Store} title="Complete your registration" action={<Button onClick={() => nav.go('v_register')}>Start</Button>} /></Screen></VendorWorkspace>

  const { vendor, listings, rfqs, bookings, conversations, categoryNames } = d
  const myQuotes = quotes.map
  const quotesReady = quotes.ready
  const businessName = vendor.tradingName || vendor.legalName
  const live = listings.filter((l) => l.contentState === 'approved')
  const fix = listings.filter((l) => ['rejected', 'changes_requested'].includes(l.contentState))
  const toQuote = rfqs.filter((r) => r.state === 'open' && myQuotes.has(r.id) && !myQuotes.get(r.id).length)
  const quoted = rfqs.filter((r) => myQuotes.get(r.id)?.length)
  const accepted = rfqs.filter((r) => myQuotes.get(r.id)?.some((q) => q.state === 'accepted'))
  const bookingRequests = bookings.filter((b) => b.state === 'requested')
  const todo = toQuote.length + fix.length + bookingRequests.length
  const funnelMax = Math.max(rfqs.length, quoted.length, accepted.length, 1)
  const statusRows = LISTING_STATUS.map(([id, label]) => ({ id, label, value: listings.filter((l) => l.contentState === id).length })).filter((row) => row.value > 0)
  const statusMax = Math.max(...statusRows.map((row) => row.value), 1)

  const topCategories = [...live.reduce((m, l) => m.set(l.categoryId, (m.get(l.categoryId) || 0) + 1), new Map())]
    .map(([id, count]) => ({ id, count, name: categoryNames.get(id) || 'Other category' }))
    .sort((a, b) => b.count - a.count).slice(0, 5)

  const stats = [
    { label: 'Quote requests', value: quotesReady ? toQuote.length : '…', icon: FileText, caption: 'Ready for your quotation', route: 'v_work' },
    { label: 'Quotes sent', value: quotesReady ? quoted.length : '…', icon: Send, caption: quotesReady ? `${accepted.length} accepted` : 'Checking your quotes', route: 'v_work' },
    { label: 'Live listings', value: live.length, icon: Package, caption: `${listings.length} total listings`, route: 'v_listings' },
    { label: 'Booking requests', value: bookingRequests.length, icon: CalendarCheck, caption: 'Awaiting your response', route: 'v_work' },
    ...(conversations ? [{ label: 'Conversations', value: conversations.length, icon: MessageCircle, caption: 'Customer chats', route: 'messages' }] : []),
  ]
  const funnelRows = [
    { label: 'Requests', value: rfqs.length, color: 'bg-amber-600' },
    { label: 'Quotes sent', value: quotesReady ? quoted.length : 0, display: quotesReady ? quoted.length : '…', color: 'bg-amber-400' },
    { label: 'Accepted', value: quotesReady ? accepted.length : 0, display: quotesReady ? accepted.length : '…', color: 'bg-emerald-500' },
  ]
  const verified = vendor.roles?.some((role) => role.status === 'verified')
  const recentListings = listings.slice(0, 5)
  const statusForBadge = (state) => ({ approved: 'approved', pending_review: 'pending', changes_requested: 'info', draft: 'draft', paused: 'inactive', rejected: 'rejected', unpublished: 'inactive' }[state] || state)

  return <VendorWorkspace><div className="vv-admin-reference-dashboard vv-vendor-reference-dashboard">
    <div className="vv-admin-reference-heading">
      <div>
        <p>Workspace overview · {today} · {businessName}</p>
        <h1>{greeting}, {firstName}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {verified && <Badge tone="green">Verified</Badge>}
        <Button size="sm" variant="secondary" icon={UserRound} onClick={() => nav.go('v_profile')}>Edit profile</Button>
        <Button size="sm" variant="secondary" icon={BarChart3} onClick={() => nav.go('v_perf')}>Analytics</Button>
        <Button size="sm" icon={Plus} onClick={() => nav.go('v_listing_edit')}>Add listing</Button>
      </div>
    </div>

    <div className="vv-admin-reference-kpis">
      <Stat label="Quote requests" value={quotesReady ? toQuote.length : '…'} icon={FileText} tone="violet" caption="↗ Ready for quotation" onClick={() => nav.go('v_work')} />
      <Stat label="Quotes sent" value={quotesReady ? quoted.length : '…'} icon={Send} tone="rose" caption={quotesReady ? `↗ ${accepted.length} accepted` : 'Checking quotes'} onClick={() => nav.go('v_work')} />
      <Stat label="Live listings" value={live.length} icon={Package} tone="amber" caption={`↗ ${listings.length} total listings`} onClick={() => nav.go('v_listings')} />
      <Stat label="Booking requests" value={bookingRequests.length} icon={CalendarCheck} tone="emerald" caption="↗ Awaiting your reply" onClick={() => nav.go('v_work')} />
    </div>

    <div className="vv-admin-reference-grid">
      <Card className="vv-admin-reference-panel !p-0">
        <div className="vv-admin-reference-panel-head">
          <div>
            <h2>Recent listings</h2>
            <p>Your catalogue and publication status</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => nav.go('v_listings')}>View all</Button>
        </div>
        {recentListings.length > 0 && <div className="vv-admin-reference-table-head"><span>Listing</span><span>Category</span><span>Type</span><span>Status</span></div>}
        {recentListings.map((item) => (
          <button type="button" key={item.id} onClick={() => nav.go('v_listing_edit', { id: item.id })} className="vv-admin-reference-row">
            <span className="truncate font-bold">{item.title}</span>
            <span className="truncate">{categoryNames.get(item.categoryId) || 'Catalogue'}</span>
            <span>{item.listingType === 'service' ? 'Service' : 'Product'}</span>
            <StatusBadge s={statusForBadge(item.contentState)} />
          </button>
        ))}
        {!recentListings.length && <EmptyState icon={Package} title="No listings yet" body="Create a listing. It stays a draft until you submit it and it is approved." action={<Button size="sm" onClick={() => nav.go('v_listing_edit')}>Add listing</Button>} />}
      </Card>

      <div className="space-y-4">
        <Card className="vv-admin-reference-panel">
          <h2>Quote conversion</h2>
          {funnelRows.map((row) => (
            <div key={row.label} className="mt-4">
              <div className="flex justify-between text-xs font-semibold text-ink-600">
                <span>{row.label}</span>
                <span>{row.display ?? row.value}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
                <div className={cx('h-full rounded-full', row.color)} style={{ width: `${Math.max((row.value / funnelMax) * 100, row.value ? 8 : 0)}%` }} />
              </div>
            </div>
          ))}
          {d.lookupCapped && <p className="mt-3 text-[11px] text-ink-500">Quotes checked on your {QUOTE_LOOKUP_LIMIT} latest RFQs</p>}
        </Card>

        <Card className="vv-admin-reference-panel">
          <h2>Needs your attention</h2>
          <button type="button" onClick={() => nav.go('v_work')} className="vv-admin-moderation-row text-amber-800">
            <FileText size={16} />{quotesReady ? `${toQuote.length} open quote requests` : 'Checking quote requests…'} <ChevronRight size={15} />
          </button>
          <button type="button" onClick={() => nav.go('v_listings')} className="vv-admin-moderation-row text-rose-800">
            <AlertTriangle size={16} />{fix.length} listings need changes <ChevronRight size={15} />
          </button>
          <button type="button" onClick={() => nav.go('v_work')} className="vv-admin-moderation-row text-violet-800">
            <CalendarCheck size={16} />{bookingRequests.length} booking requests <ChevronRight size={15} />
          </button>
          {quotesReady && todo === 0 && <div className="mt-3 flex items-center gap-2 rounded-xl bg-ink-50 px-3 py-2 text-xs font-semibold text-ink-600"><Check size={14} />You are all caught up.</div>}
        </Card>
      </div>
    </div>

    <div className="vv-admin-reference-footer-stats">
      <button type="button" onClick={() => nav.go('messages')}><b>{conversations ? conversations.length : 0}</b><span>Conversations</span></button>
      <button type="button" onClick={() => nav.go('v_listings')}><b>{topCategories.length}</b><span>Live categories</span></button>
      <button type="button" onClick={() => nav.go('v_work')}><b>{bookings.length}</b><span>Total bookings</span></button>
    </div>
  </div></VendorWorkspace>
}


/* ---------- customer dashboard: every count is read from the signed-in customer's own records ---------- */
const OPEN_BOOKING_STATES = ['requested', 'confirmed', 'in_progress', 'completed_awaiting']

async function loadCustomerDashboard() {
  const [bookings, rfqs, orders, contracts] = await Promise.all([
    authService.listMyBookings(),
    authService.listMyRfqs(),
    authService.listMyPurchaseOrders(),
    authService.listMyContracts(),
  ])
  for (const r of [bookings, rfqs, orders, contracts]) if (!r.ok) return r
  return { ok: true, bookings: bookings.bookings, rfqs: rfqs.rfqs, orders: orders.purchaseOrders, contracts: contracts.contracts }
}

const CUSTOMER_STAT_ITEMS = [
  { key: 'bookings', label: 'Open bookings', icon: Clock, count: (d) => (d.bookings || []).filter((b) => OPEN_BOOKING_STATES.includes(b.state)).length, go: (nav) => nav.go('c_activity', { tab: 'bookings' }) },
  { key: 'rfqs', label: 'Active RFQs', icon: ClipboardList, count: (d) => (d.rfqs || []).filter((r) => r.state === 'open').length, go: (nav) => nav.go('c_activity', { tab: 'rfqs' }) },
  { key: 'orders', label: 'Purchase orders', icon: Receipt, count: (d) => (d.orders || []).length, go: (nav) => nav.go('c_orders') },
  { key: 'contracts', label: 'Contracts', icon: FileText, count: (d) => (d.contracts || []).length, go: (nav) => nav.go('c_activity', { tab: 'contracts' }) },
]

export function RemoteCustomerDashboard() {
  const nav = useNav()
  const { me } = useApp()
  const load = useCallback(() => loadCustomerDashboard(), [])
  const dash = useLoad(load, [load])
  const d = dash.data
  const actions = [
    [ClipboardList, 'Request a quotation', 'Services or goods', 'c_rfq_new'],
    [Store, 'Find a supplier', 'Suppliers and manufacturers', 'c_explore_suppliers'],
    [Star, 'My reviews', 'Ratings you have given', 'c_reviews'],
    [UserRound, 'Edit profile', 'Name, photo and contact details', 'c_profile_edit'],
  ]
  return <Page title="Dashboard" subtitle={me?.name}>
    <div className="vv-cdash">
      {dash.error && <ErrorBox message={dash.error} onRetry={dash.reload} />}
      {!dash.error && <section aria-label="Your activity" aria-busy={dash.loading && !d ? 'true' : undefined} className="vv-cdash-stats">
        {CUSTOMER_STAT_ITEMS.map(({ key, label, icon: Icon, count, go }) => (
          <button key={key} type="button" onClick={() => go(nav)} className="vv-cdash-stat">
            <span className="vv-cdash-stat-icon"><Icon size={18} /></span>
            <span className="vv-cdash-stat-value">{d ? count(d) : <span className="vv-sk-bar vv-cdash-stat-sk" aria-hidden="true" />}</span>
            <span className="vv-cdash-stat-label">{label}</span>
          </button>
        ))}
      </section>}
      <h2 className="vv-cdash-heading">Quick actions</h2>
      <section className="vv-cdash-actions">
        {actions.map(([Icon, title, desc, id]) => (
          <button key={id} type="button" onClick={() => nav.go(id)} className="vv-cdash-action">
            <span className="vv-cdash-action-icon"><Icon size={22} /></span>
            <span className="vv-cdash-action-text"><b>{title}</b><small>{desc}</small></span>
            <ChevronRight size={18} className="vv-cdash-action-arrow" />
          </button>
        ))}
      </section>
    </div>
  </Page>
}
