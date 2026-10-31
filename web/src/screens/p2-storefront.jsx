import { useState } from 'react'
import { Building2, Package, Award, MapPin, Check, Minus, Plus, CheckCircle2 } from 'lucide-react'
import { Avatar, Badge, Banner, Button, Card, EmptyState, Input, KV, Pill, SearchBar, Section, Segmented, Select, StatusBadge, Timeline, fmt } from '../ui.jsx'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { COMPANIES0, COMPANY_CATALOG } from '../data.jsx'
import { Page } from './blocks.jsx'
import { useCompany } from './biz-screens.jsx'

/* Company storefront and direct ordering (F-BIZ-03). Decision D-015 (2026-10-30): Phase 2, shown with a badge.
   Shapes and wording follow the mobile mockup (read-only reference). Payment is settled directly with the company. */

const live = () => Object.values(COMPANIES0).filter((c) => c.status === 'approved' && (COMPANY_CATALOG[c.id] || []).length)

export function CompanyDirectory() {
  const nav = useNav()
  const [q, setQ] = useState('')
  const all = live()
  const list = all.filter((c) => !q || `${c.name} ${c.products} ${c.city}`.toLowerCase().includes(q.toLowerCase()))
  return <Page title="Companies" subtitle={`${all.length} verified companies selling directly`} phase2>
    <SearchBar value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search companies or products" />
    {list.length === 0 && <EmptyState icon={Building2} title="No companies match" body="Try a different search." />}
    {list.map((c) => <Card key={c.id} onClick={() => nav.go('c_company', { id: c.id })} className="space-y-2">
      <div className="flex items-start gap-3"><Avatar name={c.name} size={44} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{c.name}</p><p className="text-xs text-ink-500">{c.industry} · {c.city} · {c.employees} staff</p></div></div>
      <p className="text-[13px] text-ink-600">{c.products}</p>
      <p className="text-xs text-ink-500">{COMPANY_CATALOG[c.id].length} products · MOQ from {Math.min(...COMPANY_CATALOG[c.id].map((p) => p.moq))} · lead {c.lead}</p>
    </Card>)}
  </Page>
}

export function CompanyStore({ params = {} }) {
  const nav = useNav()
  const c = COMPANIES0[params.id || 'biz1']
  if (!c || c.status !== 'approved') return <Page title="Company" phase2><EmptyState icon={Building2} title="Not available" body="This company is not verified yet." /></Page>
  const items = COMPANY_CATALOG[c.id] || []
  return <Page title={c.name} subtitle={`${c.industry} · ${c.city}`} phase2>
    <Card className="space-y-2.5">
      <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-extrabold"><Building2 size={15} />Verified company</p><Badge tone="green"><CheckCircle2 size={11} />Verified</Badge></div>
      <KV rows={[['Established', c.year], ['Employees', c.employees], ['Capacity', c.capacity], ['Plants', c.plants.join(', ')]]} />
      <div className="flex flex-wrap gap-1.5">{c.certs.map((x) => <Pill key={x} icon={Award}>{x}</Pill>)}</div>
      <p className="text-[11px] text-ink-500">Registration and certificates reviewed by VendorVerse on {c.verifiedOn}.</p>
    </Card>
    <p className="px-1 text-sm font-extrabold">Products</p>
    {items.map((p) => <Card key={p.id} className="space-y-2">
      <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><Package size={20} /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold leading-snug">{p.name}</p><p className="text-xs text-ink-500">{p.note}</p></div></div>
      <div className="flex items-center justify-between"><p className="text-sm"><b>{fmt(p.price)}</b> <span className="text-xs text-ink-500">/ {p.unit} · MOQ {p.moq} · lead {p.lead}</span></p><Button size="sm" icon={Package} onClick={() => nav.go('c_company_order', { id: c.id, product: p.id })}>Order</Button></div>
    </Card>)}
    <Banner tone="blue" title="Ordering from a company">Place an order and the company accepts it. Payment terms are settled directly with the company. VendorVerse tracks status only.</Banner>
  </Page>
}

export function CompanyOrderNew({ params = {} }) {
  const nav = useNav()
  const { me, companyOrders, setCompanyOrders, notify, toast, stamp } = useApp()
  const c = COMPANIES0[params.id || 'biz1']
  const items = COMPANY_CATALOG[c?.id] || []
  const [pid, setPid] = useState(params.product || items[0]?.id)
  const p = items.find((x) => x.id === pid) || items[0]
  const [qty, setQty] = useState(String(p?.moq || 1))
  const [addr, setAddr] = useState('24, Vaishali Nagar, Jaipur 302021')
  const [by, setBy] = useState('2026-11-20')
  const [pay, setPay] = useState('50% advance, 50% before dispatch')
  const [err, setErr] = useState({})
  const [done, setDone] = useState(null)
  if (!c || c.status !== 'approved' || !p) return <Page title="Order" phase2><EmptyState icon={Building2} title="Not available" body="This company is not available to order from." /></Page>
  const n = parseInt(qty || '0', 10)
  const pick = (id) => { const np = items.find((x) => x.id === id); setPid(id); setQty(String(np.moq)); setErr({}) }
  const step = (d) => setQty(String(Math.max(0, n + d * (p.moq >= 100 ? 100 : 1))))
  const send = () => {
    if (done) return
    const e = {}
    if (n < p.moq) e.qty = `Minimum order is ${p.moq} ${p.unit}`
    if (addr.trim().length < 8) e.addr = 'Enter the delivery address'
    setErr(e)
    if (Object.keys(e).length) return toast('Please fix the highlighted fields', 'warn')
    const id = 'CO-' + (3010 + companyOrders.length)
    setCompanyOrders((o) => [{ id, bizId: c.id, buyer: me.name, title: `${p.name}: ${n} ${p.unit}`, item: p.id, qty: n, total: p.price * n, address: addr, by, terms: pay, status: 'placed', history: [{ s: 'placed', at: stamp() }] }, ...o])
    notify('business', 'New customer order', `${id} · ${p.name} x ${n}`, 'order')
    setDone(id); toast(`Order sent to ${c.name}`)
  }
  if (done) return <Page title="Order placed" back={false} phase2 footer={<Button full size="lg" onClick={() => nav.replace('c_company_track', { id: done })}>Track order</Button>}>
    <Card className="text-center !p-6"><div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check size={34} /></div><h2 className="mt-3 text-lg font-extrabold">Order sent · {done}</h2><p className="mt-1 text-sm text-ink-600">{c.name} will accept or reject it. You will be notified.</p></Card>
  </Page>
  return <Page title="Order from company" subtitle={c.name} phase2 footer={<Button full size="lg" onClick={send}>Place order · {fmt(p.price * n)}</Button>}>
    <Select label="Product" value={pid} onChange={(e) => pick(e.target.value)} options={items.map((x) => ({ value: x.id, label: x.name }))} />
    <div><Input label={`Quantity (${p.unit})`} required inputMode="numeric" value={qty} onChange={(e) => { setQty(e.target.value.replace(/\D/g, '')); setErr({}) }} error={err.qty} /><div className="mt-2 flex gap-2"><Button size="sm" variant="secondary" icon={Minus} onClick={() => step(-1)}>Less</Button><Button size="sm" variant="secondary" icon={Plus} onClick={() => step(1)}>More</Button></div></div>
    <Input label="Delivery address" required textarea rows={2} value={addr} onChange={(e) => setAddr(e.target.value)} error={err.addr} />
    <Input label="Required by" type="date" value={by} onChange={(e) => setBy(e.target.value)} />
    <Select label="Payment terms" value={pay} onChange={(e) => setPay(e.target.value)} options={['50% advance, 50% before dispatch', '100% advance', '30% advance, balance on delivery', 'Net 30 days']} />
    <Card className="space-y-2"><p className="text-sm font-extrabold">Summary</p><KV rows={[['Item', p.name], ['Rate', `${fmt(p.price)} / ${p.unit}`], ['Quantity', `${n} ${p.unit}`], ['Lead time', p.lead], ['Total (excl. tax and freight)', fmt(p.price * n)]]} /><p className="flex items-start gap-1.5 text-[11px] text-ink-400"><MapPin size={12} className="mt-0.5 shrink-0" />Delivery from {c.city}. Payment is made directly to the company. VendorVerse does not hold funds.</p></Card>
  </Page>
}

const FLOW = ['placed', 'accepted', 'processing', 'shipped', 'delivered']
const LABEL = { placed: 'Placed', accepted: 'Accepted', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', rejected: 'Rejected' }

/* business side: orders received */
export function BizOrders() {
  const nav = useNav()
  const { companyOrders } = useApp()
  const { id: bizId } = useCompany()
  const [flt, setFlt] = useState('all')
  const mine = companyOrders.filter((o) => o.bizId === bizId)
  const shown = mine.filter((o) => flt === 'all' || (flt === 'open' ? !['delivered', 'rejected'].includes(o.status) : ['delivered', 'rejected'].includes(o.status)))
  return <Page title="Orders" subtitle="Customer orders received" phase2 back={false}>
    <Segmented value={flt} onChange={setFlt} options={[{ id: 'all', label: 'All' }, { id: 'open', label: 'In progress' }, { id: 'done', label: 'Closed' }]} />
    {shown.length === 0 && <EmptyState icon={Package} title="No orders yet" body="Customer orders from your storefront appear here." />}
    {shown.map((o) => <Card key={o.id} onClick={() => nav.go('b_order', { id: o.id })} className="space-y-1.5"><div className="flex items-start justify-between gap-2"><p className="text-sm font-bold leading-snug">{o.title}</p><StatusBadge s={o.status === 'processing' ? 'processing' : o.status === 'accepted' ? 'confirmed' : o.status} /></div><p className="text-xs text-ink-500">{o.id} · {o.buyer} · due {o.by}</p></Card>)}
  </Page>
}

/* order detail: the company accepts, processes and ships; the customer tracks */
export function CompanyOrderDetail({ params = {}, as }) {
  const nav = useNav()
  const { companyOrders, patchCompanyOrder, notify, toast, stamp } = useApp()
  const o = companyOrders.find((x) => x.id === (params.id || 'CO-3002')) || companyOrders[0]
  if (!o) return <Page title="Order" phase2><EmptyState icon={Package} title="Order not found" /></Page>
  const seller = as === 'business'
  const c = COMPANIES0[o.bizId]
  const idx = FLOW.indexOf(o.status)
  const go = (status, note) => { patchCompanyOrder(o.id, (x) => ({ status, history: [...x.history, { s: status, at: stamp(), note }] })); notify(seller ? 'customer' : 'business', `Order ${LABEL[status].toLowerCase()}`, `${o.id} · ${o.title}`, 'order'); toast(`Order ${LABEL[status].toLowerCase()}`) }
  const next = FLOW[idx + 1]
  return <Page title={o.id} subtitle={seller ? `Customer: ${o.buyer}` : c?.name} phase2 right={<StatusBadge s={o.status === 'accepted' ? 'confirmed' : o.status === 'processing' ? 'processing' : o.status} />}>
    <Card className="space-y-2"><p className="text-sm font-bold">{o.title}</p><KV rows={[['Total (excl. tax and freight)', fmt(o.total)], ['Deliver to', o.address], ['Required by', o.by], ['Payment terms', o.terms]]} /><p className="text-[11px] text-ink-500">Payment is settled directly between the customer and the company.</p></Card>
    <Card><Timeline steps={o.status === 'rejected' ? [{ label: 'Placed', done: true }, { label: 'Rejected by company', current: true }] : FLOW.map((s, i) => ({ label: LABEL[s], done: i < idx || o.status === 'delivered', current: i === idx && o.status !== 'delivered' }))} /></Card>
    {seller && o.status === 'placed' && <div className="flex gap-2"><Button full onClick={() => go('accepted', 'Accepted by company')}>Accept order</Button><Button full variant="danger" onClick={() => go('rejected', 'Rejected by company')}>Reject</Button></div>}
    {seller && ['accepted', 'processing', 'shipped'].includes(o.status) && next && <Button full onClick={() => go(next, `Marked ${LABEL[next].toLowerCase()}`)}>{next === 'processing' ? 'Start processing' : next === 'shipped' ? 'Mark shipped' : 'Mark delivered'}</Button>}
    {!seller && <Button full variant="secondary" onClick={() => nav.go('c_report', { ref: o.id })}>Report a problem</Button>}
  </Page>
}
export const BizOrder = (p) => <CompanyOrderDetail {...p} as="business" />
export const CompanyTrack = (p) => <CompanyOrderDetail {...p} as="buyer" />
