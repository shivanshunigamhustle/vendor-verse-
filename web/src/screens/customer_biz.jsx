import { useState } from 'react'
import { Building2, CheckCircle2, Package, Award, Factory, Minus, Plus, Check, MapPin } from 'lucide-react'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { INDUSTRIES, country } from '../globaldata.jsx'
import { COMPANY_CATALOG } from '../mvpdata.jsx'
import { Screen, Card, Button, Banner, Input, Select, KV, Pill, Badge, SearchBar, Avatar, EmptyState, Money } from '../ui.jsx'

const live = (companies) => Object.values(companies).filter((c) => c.status === 'approved' && (COMPANY_CATALOG[c.id] || []).length)
const nameOf = (c) => c.brand || c.legal

/* ================= verified companies customers can buy from ================= */
export function CompanyDirectory() {
  const nav = useNav()
  const { companies } = useApp()
  const [q, setQ] = useState('')
  const all = live(companies)
  const list = all.filter((c) => !q || `${nameOf(c)} ${c.products} ${c.hq.city}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <Screen title="Companies" subtitle={`${all.length} verified companies selling directly`} pad={false}>
      <div className="space-y-3 bg-white px-4 pb-3 pt-3">
        <SearchBar value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search companies or products" />
      </div>
      <div className="space-y-2.5 p-4">
        {list.length === 0 && <EmptyState icon={Building2} title="No companies match" body="Try a different search." />}
        {list.map((c) => {
          const ind = INDUSTRIES.find((i) => i.id === c.industry)
          return (
            <Card key={c.id} onClick={() => nav.go('c_company', { id: c.id })} className="space-y-2">
              <div className="flex items-start gap-3"><Avatar name={nameOf(c)} size={44} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{nameOf(c)}</p><p className="text-xs text-ink-500">{ind?.name} · {c.hq.city} · {c.employees} staff</p></div><Badge tone="green"><CheckCircle2 size={11} />Verified</Badge></div>
              <p className="text-[13px] text-ink-600">{c.products}</p>
              <p className="text-xs text-ink-500">{COMPANY_CATALOG[c.id].length} products · MOQ from {Math.min(...COMPANY_CATALOG[c.id].map((p) => p.moq))} · lead {c.lead || '—'}</p>
            </Card>
          )
        })}
      </div>
    </Screen>
  )
}

/* ================= company storefront ================= */
export function CompanyStore({ params = {} }) {
  const nav = useNav()
  const { companies } = useApp()
  const c = companies[params.id || 'biz1']
  if (!c || c.status !== 'approved') return <Screen title="Company"><EmptyState icon={Building2} title="Not available" body="This company is not verified yet." /></Screen>
  const items = COMPANY_CATALOG[c.id] || []
  const ind = INDUSTRIES.find((i) => i.id === c.industry)
  return (
    <Screen title={nameOf(c)} subtitle={`${ind?.name} · ${c.hq.city}`}>
      <Card className="space-y-2.5">
        <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-extrabold"><Building2 size={15} />Verified company</p><Badge tone="green"><CheckCircle2 size={11} />Verified</Badge></div>
        <KV rows={[['Established', c.year], ['Employees', c.employees], ['Capacity', `${c.capacity} ${c.capUnit}`], ['Plants', [...new Set(c.facilities.map((x) => x.city))].join(', ')], ['Markets', c.markets.map((m) => country(m).flag).join(' ')]]} />
        <div className="flex flex-wrap gap-1.5">{c.certs.map((x) => <Pill key={x.name} icon={Award}>{x.name}</Pill>)}</div>
        <p className="text-[11px] text-ink-500">Registration and certificates reviewed by VendorVerse on {c.submittedAt}.</p>
      </Card>
      <p className="px-1 text-sm font-extrabold">Products</p>
      {items.map((p) => (
        <Card key={p.id} className="space-y-2">
          <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><Package size={20} /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold leading-snug">{p.name}</p><p className="text-xs text-ink-500">{p.note}</p></div></div>
          <div className="flex items-center justify-between"><p className="text-sm"><b><Money n={p.price} /></b> <span className="text-xs text-ink-500">/ {p.unit} · MOQ {p.moq} · lead {p.lead}</span></p><Button size="sm" icon={Package} onClick={() => nav.go('c_company_order', { id: c.id, product: p.id })}>Order</Button></div>
        </Card>
      ))}
      <Banner tone="blue" title="Ordering from a company">Place an order and the company accepts it. Payment terms are settled directly with the company; VendorVerse tracks status only.</Banner>
    </Screen>
  )
}

/* ================= place an order with a company ================= */
export function CompanyOrderNew({ params = {} }) {
  const nav = useNav()
  const { companies, orders, setOrders, me, loc, notify, toast } = useApp()
  const c = companies[params.id || 'biz1']
  const items = COMPANY_CATALOG[c?.id] || []
  const [pid, setPid] = useState(params.product || items[0]?.id)
  const p = items.find((x) => x.id === pid) || items[0]
  const [qty, setQty] = useState(String(p?.moq || 1))
  const [addr, setAddr] = useState('24, Vaishali Nagar, Jaipur 302021')
  const [by, setBy] = useState('2026-11-20')
  const [pay, setPay] = useState('50% advance, 50% before dispatch')
  const [err, setErr] = useState({})
  const [done, setDone] = useState(null)
  if (!c || c.status !== 'approved' || !p) return <Screen title="Order"><EmptyState icon={Building2} title="Not available" body="This company is not available to order from." /></Screen>
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
    const id = 'PO-' + (3010 + orders.length)
    const [y, m, d] = by.split('-')
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]
    setOrders((o) => [{ id, buyer: me.name, org: me.name, vendorId: null, bizId: c.id, rfq: null, title: `${p.name} — ${n.toLocaleString('en-IN')} ${p.unit}`, items: [{ name: p.name, qty: n, unit: p.unit, price: p.price }], cur: 'INR', delivery: addr, by: `${d} ${mon} ${y}`, payTerms: `${pay} (direct to company)`, incoterm: 'Delivered (DAP)', state: 'po_created', tracking: null, history: [{ s: 'po_created', at: 'Just now', note: 'Order placed — awaiting company acceptance', by: me.name }] }, ...o])
    notify('business', 'New customer order', `${id} · ${p.name} × ${n}`, 'order', ['b_order', { id }])
    setDone(id)
    toast(`Order sent to ${nameOf(c)}`)
  }
  if (done) {
    return (
      <Screen title="Order placed" back={false} footer={<Button full size="lg" onClick={() => nav.replace('c_order', { id: done })}>Track order</Button>}>
        <Card className="text-center !p-6"><div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check size={34} /></div><h2 className="mt-3 text-lg font-extrabold">Order sent · {done}</h2><p className="mt-1 text-sm text-ink-600">{nameOf(c)} will accept or reject the order. You’ll be notified at each step.</p></Card>
      </Screen>
    )
  }
  return (
    <Screen title="Order from company" subtitle={nameOf(c)} footer={<Button full size="lg" onClick={send}>Place order · <Money n={p.price * n} /></Button>}>
      <Select label="Product" value={pid} onChange={(e) => pick(e?.target ? e.target.value : e)} options={items.map((x) => ({ value: x.id, label: x.name }))} />
      <div>
        <Input label={`Quantity (${p.unit})`} required inputMode="numeric" value={qty} onChange={(e) => { setQty(e.target.value.replace(/\D/g, '')); setErr({}) }} error={err.qty} />
        <div className="mt-2 flex gap-2"><Button size="sm" variant="secondary" icon={Minus} onClick={() => step(-1)}>Less</Button><Button size="sm" variant="secondary" icon={Plus} onClick={() => step(1)}>More</Button></div>
      </div>
      <Input label="Delivery address" required textarea rows={2} value={addr} onChange={(e) => setAddr(e.target.value)} error={err.addr} />
      <Input label="Required by" type="date" value={by} onChange={(e) => setBy(e.target.value)} />
      <Select label="Payment terms" value={pay} onChange={(e) => setPay(e?.target ? e.target.value : e)} options={['50% advance, 50% before dispatch', '100% advance', '30% advance, balance on delivery', 'Net 30 days']} />
      <Card className="space-y-2">
        <p className="text-sm font-extrabold">Summary</p>
        <KV rows={[['Item', p.name], ['Rate', <span key="r"><Money n={p.price} /> / {p.unit}</span>], ['Quantity', `${n.toLocaleString('en-IN')} ${p.unit}`], ['Lead time', p.lead], ['Total (excl. tax & freight)', <b key="t"><Money n={p.price * n} /></b>]]} />
        <p className="flex items-start gap-1.5 text-[11px] text-ink-400"><MapPin size={12} className="mt-0.5 shrink-0" />Delivery from {c.hq.city}. Payment is made directly to the company — VendorVerse does not hold funds.</p>
      </Card>
    </Screen>
  )
}
