import { useState } from 'react'
import { FileSignature, Repeat, Package, Wrench, Layers, CalendarClock, ShieldCheck, Check, X, FileText, Download, Plus, Trash2, PenLine, Hourglass, CircleCheck, Handshake, ChevronRight, Banknote } from 'lucide-react'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { cat, listing as findListing } from '../data.jsx'
import { CONTRACT_TYPES, fmtC } from '../globaldata.jsx'
import {
  Screen, Card, Section, Button, Thumb, Chips, Segmented, Sheet, Input, Select, Toggle, Badge, Banner, EmptyState, KV, cx, Pill, StatusBadge, Timeline, Checkbox, PhaseBanner, PhaseTag, Stepper, ReasonSheet, Money, SOFT, SearchBar, Avatar,
} from '../ui.jsx'
import { VerifiedBadge, useStartChat } from './shared.jsx'

const TYPE_ICON = { recurring: Repeat, supply: Package, amc: Wrench, project: Layers }
const TYPE_DESC = { recurring: 'Same service on a schedule — weekly, monthly or on demand', supply: 'Repeat supply of goods with a delivery cadence', amc: 'Preventive + breakdown cover for a fixed term', project: 'One scope delivered in milestones' }

export function ContractCard({ c, role = 'customer', onClick }) {
  const { vendor, listings } = useApp()
  const v = vendor(c.vendorId)
  const Ic = TYPE_ICON[c.type]
  return (
    <Card onClick={onClick} className="!p-3.5">
      <div className="flex items-start gap-3">
        <span className={cx('grid size-12 shrink-0 place-items-center rounded-xl', SOFT.violet)}><Ic size={22} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-ink-500">{c.id}</span><StatusBadge s={c.state} /></div>
          <p className="mt-0.5 line-clamp-1 text-sm font-bold">{c.title}</p>
          <p className="mt-0.5 truncate text-xs text-ink-500">{role === 'vendor' ? c.customer : v?.name} · {CONTRACT_TYPES[c.type]} · {c.term}</p>
          {c.state === 'active' && <div className="mt-2"><div className="h-1.5 overflow-hidden rounded-full bg-ink-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(c.done / c.total) * 100}%` }} /></div><p className="mt-1 text-[11px] text-ink-500">{c.done} of {c.total} {c.type === 'project' ? 'milestones' : 'periods'} delivered</p></div>}
        </div>
      </div>
    </Card>
  )
}

/* ================= PROPOSE A CONTRACT (Phase 2) ================= */
export function ContractNew({ params = {} }) {
  const nav = useNav()
  const { vendors, listings, contracts, setContracts, notify, toast, me, vendor, published, bookings, rfqs } = useApp()
  /* the counterparty is chosen in step 1; arriving from a vendor, listing or renewal pre-selects it */
  const [vid, setVid] = useState(params.vendorId || (params.listingId && findListing(params.listingId, listings)?.vendorId) || null)
  const [lid, setLid] = useState(params.listingId || null)
  const [q, setQ] = useState('')
  const [vcat, setVcat] = useState('all')
  const l = lid ? findListing(lid, listings) : null
  const v0 = vid ? vendor(vid) : null
  const [step, setStep] = useState(vid ? 1 : 0)
  const [f, setF] = useState({ type: 'recurring', title: l ? `${l.title} — recurring` : '', scope: '', start: '2026-11-01', term: '12 months', freq: 'Monthly', price: l?.priceMin ? String(l.priceMin) : '', cur: l?.cur || 'INR', priceNote: 'per visit', sla: '', pay: 'direct', renew: true })
  const pickVendor = (x) => { setVid(x.id); setLid(null); setErr({}) }
  const pickListing = (x) => { setLid(x ? x.id : null); setF({ ...f, title: x ? `${x.title} — recurring` : '', price: x?.priceMin ? String(x.priceMin) : '', cur: x?.cur || 'INR' }) }
  const dealt = new Set([...bookings.filter((b) => b.customer === me.name).map((b) => b.vendorId), ...rfqs.filter((r) => r.customer === me.name).map((r) => r.vendorId)].filter(Boolean))
  const candidates = vendors.filter((x) => x.ver === 'approved' && listings.some((m) => m.vendorId === x.id && published(m)))
  const shown = candidates.filter((x) => (vcat === 'all' || x.cat === vcat) && (!q || x.name.toLowerCase().includes(q.toLowerCase())))
  const recent = shown.filter((x) => dealt.has(x.id))
  const others = shown.filter((x) => !dealt.has(x.id))
  const vlistings = v0 ? listings.filter((m) => m.vendorId === v0.id && published(m)) : []
  const vcats = [...new Set(candidates.map((x) => x.cat))]
  const [ms, setMs] = useState([['Kick-off & survey', '30'], ['Delivery', '40'], ['Handover & acceptance', '30']])
  const [err, setErr] = useState({})
  const set = (k) => (e) => { setF({ ...f, [k]: e?.target ? e.target.value : e }); setErr({ ...err, [k]: '' }) }
  const validate = () => {
    const e = {}
    if (step === 0) { if (!v0) e.vendor = 'Choose the vendor you are contracting with' }
    if (step === 1) { if (f.title.trim().length < 5) e.title = 'Give the contract a title'; if (f.scope.trim().length < 15) e.scope = 'Describe the scope (min 15 characters)' }
    if (step === 2) { if (!(+f.price > 0)) e.price = 'Enter the price'; if (f.sla.trim().length < 8) e.sla = 'State the service levels'; if (f.type === 'project' && ms.reduce((s, m) => s + (+m[1] || 0), 0) !== 100) e.ms = 'Milestone payments must add up to 100%' }
    setErr(e); return !Object.keys(e).length
  }
  const next = () => {
    if (!validate()) return
    if (step < 3) return setStep(step + 1)
    const id = 'CT-' + (503 + contracts.length)
    setContracts((c) => [{ id, customer: me.name, vendorId: v0.id, listingId: l?.id, title: f.title, type: f.type, term: f.term, start: f.start, freq: f.type === 'project' ? 'Milestone based' : f.freq, price: +f.price, cur: f.cur, priceNote: f.priceNote, sla: f.sla, paymentTerms: f.pay === 'direct' ? 'Direct to vendor (MVP)' : 'Escrow per milestone / period (Phase 2)', autoRenew: f.renew, state: 'proposed', done: 0, total: f.type === 'project' ? ms.length : f.term.startsWith('3') ? 3 : f.term.startsWith('6') ? 6 : 12, milestones: f.type === 'project' ? ms.map(([n], i) => [n, i === 0 ? 'progress' : 'todo', 'TBC']) : [], docs: [], history: [{ s: 'proposed', at: 'Just now', note: 'Sent to vendor — awaiting response', by: me.name }] }, ...c])
    notify('vendor', 'New contract proposal', `${me.name} · ${f.title}`, 'booking', ['v_contract', { id }])
    toast('Contract proposal sent'); nav.replace('c_contract', { id })
  }
  return (
    <Screen title="Propose a contract" subtitle={v0 ? `with ${v0.name}` : 'Choose who you are contracting with'} footer={<div className="flex gap-2">{step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}<Button className="flex-1" size="lg" disabled={step === 0 && !v0} onClick={next}>{step === 3 ? 'Send proposal to ' + v0.name : 'Continue'}</Button></div>}>
      <Banner tone="blue" title="Contract bookings — demonstrated in the MVP prototype">Recurring schedules, SLAs, milestones and renewals. E-signature and escrow payments are stubs (Phase 2).</Banner>
      <Stepper steps={['Vendor', 'Type & scope', 'Terms', 'Review']} current={step} />
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-ink-600">A contract is signed with one specific vendor. Pick who it is with — you can also link it to one of their services.</p>
          <SearchBar value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vendors" />
          <Chips value={vcat} onChange={setVcat} options={[{ id: 'all', label: 'All' }, ...vcats.map((c) => ({ id: c, label: cat(c).name }))]} />
          {err.vendor && <p className="text-xs font-medium text-red-600">{err.vendor}</p>}
          {[['Vendors you have worked with', recent], [recent.length ? 'All verified vendors' : 'Verified vendors', others]].map(([h, list]) => list.length > 0 && (
            <div key={h} className="space-y-2"><p className="text-xs font-bold uppercase tracking-wide text-ink-400">{h}</p>
              {list.map((x) => (
                <button key={x.id} onClick={() => pickVendor(x)} className={cx('flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-1 ring-inset', vid === x.id ? 'bg-brand-50 ring-2 ring-brand-600' : 'bg-white ring-ink-200')}>
                  <Avatar name={x.name} size={42} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{x.name}</span><span className="block truncate text-xs text-ink-500">{cat(x.cat).name} · {x.city}</span></span>
                  {vid === x.id ? <Check size={18} className="shrink-0 text-brand-600" strokeWidth={3} /> : <ChevronRight size={16} className="shrink-0 text-ink-300" />}
                </button>
              ))}
            </div>
          ))}
          {shown.length === 0 && <EmptyState icon={FileSignature} title="No vendors match" body="Try another category or clear the search." />}
          {v0 && vlistings.length > 0 && (
            <div className="space-y-2"><p className="text-xs font-bold uppercase tracking-wide text-ink-400">Link to a service (optional)</p>
              <Chips scroll={false} value={lid || 'none'} onChange={(id) => pickListing(id === 'none' ? null : vlistings.find((m) => m.id === id))} options={[{ id: 'none', label: 'No specific service' }, ...vlistings.map((m) => ({ id: m.id, label: m.title }))]} />
            </div>
          )}
        </div>
      )}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5">{Object.entries(CONTRACT_TYPES).map(([k, label]) => { const I = TYPE_ICON[k]; return <button key={k} onClick={() => setF({ ...f, type: k, priceNote: k === 'project' ? 'fixed' : k === 'amc' ? 'per year' : 'per visit', freq: k === 'supply' ? 'Quarterly' : k === 'amc' ? 'Quarterly' : 'Monthly' })} className={cx('rounded-2xl p-3.5 text-left ring-1 ring-inset', f.type === k ? 'bg-brand-50 ring-2 ring-brand-600' : 'bg-white ring-ink-200')}><span className={cx('grid size-10 place-items-center rounded-xl', f.type === k ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500')}><I size={19} /></span><p className="mt-2 text-sm font-bold">{label}</p><p className="mt-0.5 text-[11px] leading-snug text-ink-500">{TYPE_DESC[k]}</p></button> })}</div>
          <Card className="flex items-center gap-3 !p-3"><Avatar name={v0.name} size={38} /><div className="min-w-0 flex-1"><p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Contract with</p><p className="truncate text-sm font-bold">{v0.name}</p></div><button onClick={() => setStep(0)} className="text-xs font-bold text-brand-700">Change</button></Card>
          <Input label="Contract title" required value={f.title} onChange={set('title')} error={err.title} />
          <Input label="Scope of work / supply" required textarea rows={4} value={f.scope} onChange={set('scope')} error={err.scope} placeholder="What exactly is covered, quantities, locations, exclusions…" />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex gap-3"><Input label="Start date" type="date" value={f.start} onChange={set('start')} /><Select label="Term" value={f.term} onChange={set('term')} options={['3 months', '6 months', '12 months', '24 months', '45 days']} /></div>
          {f.type !== 'project' && <Select label="Frequency" value={f.freq} onChange={set('freq')} options={['Weekly', 'Fortnightly', 'Monthly', 'Quarterly', 'On demand']} />}
          <div className="flex gap-3"><Select label="Currency" value={f.cur} onChange={set('cur')} options={['INR', 'USD', 'AED', 'EUR', 'GBP']} /><Input label="Price" required inputMode="numeric" value={f.price} onChange={(e) => set('price')(e.target.value.replace(/\D/g, ''))} error={err.price} /></div>
          <Input label="Price applies" value={f.priceNote} onChange={set('priceNote')} placeholder="per visit / per year / fixed" />
          <Input label="Service levels (SLA)" required textarea rows={3} value={f.sla} onChange={set('sla')} error={err.sla} placeholder="Response time, quality guarantees, penalties / re-work…" />
          {f.type === 'project' && (
            <div>
              <p className="mb-2 text-[13px] font-semibold text-ink-700">Milestones & payment share</p>
              <div className="space-y-2">{ms.map((m, i) => <div key={i} className="flex gap-2"><input value={m[0]} onChange={(e) => setMs(ms.map((x, j) => (j === i ? [e.target.value, x[1]] : x)))} className="h-11 flex-1 rounded-xl bg-white px-3 text-sm outline-none ring-1 ring-inset ring-ink-200" /><input value={m[1]} inputMode="numeric" onChange={(e) => setMs(ms.map((x, j) => (j === i ? [x[0], e.target.value.replace(/\D/g, '')] : x)))} className="h-11 w-16 rounded-xl bg-white px-3 text-center text-sm outline-none ring-1 ring-inset ring-ink-200" /><button aria-label="Remove" onClick={() => setMs(ms.filter((_, j) => j !== i))} className="text-ink-400"><Trash2 size={17} /></button></div>)}</div>
              <button onClick={() => setMs([...ms, ['New milestone', '0']])} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-brand-700"><Plus size={14} />Add milestone</button>
              {err.ms && <p className="mt-1 text-xs font-medium text-red-600">{err.ms}</p>}
            </div>
          )}
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink-700">Payment terms</p>
            <div className="space-y-2">{[['direct', 'Pay the vendor directly', 'MVP-compatible — VendorVerse records the schedule only', 'MVP'], ['escrow', 'Escrow per period / milestone', 'Funds held and released on your approval', 'P2']].map(([id, a, b, p]) => <button key={id} onClick={() => setF({ ...f, pay: id })} className={cx('flex w-full items-center gap-3 rounded-xl p-3 text-left ring-1 ring-inset', f.pay === id ? 'bg-brand-50 ring-2 ring-brand-600' : 'bg-white ring-ink-200')}><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{a}</span><span className="block text-xs text-ink-500">{b}</span></span><PhaseTag p={p} /></button>)}</div>
          </div>
          <Card><Toggle label="Auto-renew" desc="You’re reminded 30 days before the end and can opt out" on={f.renew} onChange={(v) => setF({ ...f, renew: v })} /></Card>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <Card><p className="mb-2 text-sm font-bold">{f.title}</p><KV rows={[['Vendor', v0.name], ['Type', CONTRACT_TYPES[f.type]], ['Start · term', `${f.start} · ${f.term}`], ['Price', `${fmtC(+f.price, f.cur)} ${f.priceNote}`], ['Payment', f.pay === 'direct' ? 'Direct to vendor' : 'Escrow (Phase 2)'], ['Auto-renew', f.renew ? 'Yes' : 'No']]} /></Card>
          <Card><p className="text-xs font-bold uppercase tracking-wide text-ink-400">Service levels</p><p className="mt-1 text-sm text-ink-700">{f.sla}</p></Card>
          <Banner tone="blue" title="What happens next">The vendor can accept, counter or decline. When both sides e-sign, the terms are locked as an immutable snapshot — later changes need an amendment both parties approve.</Banner>
        </div>
      )}
    </Screen>
  )
}

/* ================= CONTRACT DETAIL (customer + vendor) ================= */
export function ContractDetail({ params }) {
  const nav = useNav()
  const start = useStartChat()
  const { contracts, patchContract, vendor, listings, notify, toast, me } = useApp()
  const c = contracts.find((x) => x.id === (params.id || 'CT-501'))
  const isVendor = me.role === 'vendor'
  const [sign, setSign] = useState(false)
  const [name, setName] = useState('')
  const [ok, setOk] = useState(false)
  const [counter, setCounter] = useState(false)
  const [cp, setCp] = useState({ price: '', note: '' })
  const [term, setTerm] = useState(false)
  if (!c) return <Screen title="Contract"><EmptyState title="Contract not found" /></Screen>
  const v = vendor(c.vendorId)
  const hist = (s, note) => [...c.history, { s, at: 'Just now', note, by: me.name }]
  const doSign = () => {
    patchContract(c.id, { state: 'active', docs: [`Contract-${c.id}.pdf`], history: hist('active', 'Both parties e-signed — terms locked') })
    notify(isVendor ? 'customer' : 'vendor', 'Contract signed', `${c.id} is now active`, 'booking', [isVendor ? 'c_contract' : 'v_contract', { id: c.id }])
    setSign(false); toast('Signed — contract active')
  }
  const advance = () => {
    const done = c.done + 1
    patchContract(c.id, (x) => ({ done, state: done >= x.total ? 'completed' : x.state, milestones: x.milestones.map((m, i) => (i < done ? [m[0], 'done', m[2]] : i === done ? [m[0], 'progress', m[2]] : m)), history: [...x.history, { s: done >= x.total ? 'completed' : 'active', at: 'Just now', note: c.type === 'project' ? `Milestone ${done} accepted` : `Period ${done} delivered`, by: me.name }] }))
    toast(done >= c.total ? 'Contract completed 🎉' : `${c.type === 'project' ? 'Milestone' : 'Period'} ${done} recorded`)
  }
  const acceptCounter = () => { patchContract(c.id, { price: c.counter.price, counter: null, state: 'proposed', history: hist('proposed', `Accepted counter at ${fmtC(c.counter.price, c.cur)} — ready to sign`) }); toast('Counter accepted — ready to sign') }
  const sendCounter = () => { patchContract(c.id, { counter: { by: isVendor ? 'Vendor' : 'Customer', price: +cp.price, note: cp.note }, state: 'negotiating', history: hist('negotiating', `Counter-offer ${fmtC(+cp.price, c.cur)}`) }); notify(isVendor ? 'customer' : 'vendor', 'Counter-offer', `${c.id}: ${fmtC(+cp.price, c.cur)}`, 'booking', [isVendor ? 'c_contract' : 'v_contract', { id: c.id }]); setCounter(false); toast('Counter-offer sent') }
  const myTurn = (c.state === 'proposed' && isVendor) || (c.state === 'negotiating' && c.counter && ((c.counter.by === 'Vendor' && !isVendor) || (c.counter.by === 'Customer' && isVendor)))
  return (
    <Screen
      title={c.id}
      subtitle={isVendor ? c.customer : v.name}
      right={<StatusBadge s={c.state} className="mr-2" />}
      overlay={
        <>
          <Sheet open={sign} onClose={() => setSign(false)} title="E-sign this contract" footer={<Button full disabled={name.trim().length < 3 || !ok} icon={PenLine} onClick={doSign}>Sign and activate</Button>}>
            <KV rows={[['Contract', c.title], ['Price', `${fmtC(c.price, c.cur)} ${c.priceNote}`], ['Term', `${c.term} from ${c.start}`]]} />
            <Input label="Type your full name to sign" value={name} onChange={(e) => setName(e.target.value)} placeholder={me.name} />
            <Checkbox checked={ok} onChange={setOk}>I agree to these terms. After both parties sign they are locked; changes need an amendment both approve.</Checkbox>
          </Sheet>
          <Sheet open={counter} onClose={() => setCounter(false)} title="Make a counter-offer" footer={<Button full disabled={!(+cp.price > 0)} onClick={sendCounter}>Send counter-offer</Button>}>
            <Input label={`New price (${c.cur})`} inputMode="numeric" value={cp.price} onChange={(e) => setCp({ ...cp, price: e.target.value.replace(/\D/g, '') })} />
            <Input label="What changes?" textarea rows={3} value={cp.note} onChange={(e) => setCp({ ...cp, note: e.target.value })} />
          </Sheet>
          <ReasonSheet open={term} onClose={() => setTerm(false)} title="End this contract" reasons={['Mutual agreement', 'Service levels not met', 'Business need changed', 'Other']} danger confirmLabel="Terminate" onConfirm={(r) => { patchContract(c.id, { state: 'terminated', history: hist('terminated', r) }); setTerm(false); toast('Contract terminated — record kept', 'warn') }} />
        </>
      }
    >
      <Banner tone="blue" title="Contract record">E-signature and in-platform payments are stubs (Phase 2); the terms below are the working record.</Banner>
      <Card>
        <div className="flex items-center gap-3"><span className={cx('grid size-12 place-items-center rounded-xl', SOFT.violet)}>{(() => { const I = TYPE_ICON[c.type]; return <I size={22} /> })()}</span><div className="min-w-0 flex-1"><p className="text-sm font-bold leading-snug">{c.title}</p><p className="text-xs text-ink-500">{CONTRACT_TYPES[c.type]}</p></div></div>
        <KV className="mt-3" rows={[[isVendor ? 'Customer' : 'Vendor', isVendor ? c.customer : <span className="flex items-center gap-1.5">{v.name}<VerifiedBadge id={v.id} compact /></span>], ['Price', <b>{fmtC(c.price, c.cur)} <span className="font-medium text-ink-500">{c.priceNote}</span></b>], ['Start · term', `${c.start} · ${c.term}`], ['Cadence', c.freq], ['Auto-renew', c.autoRenew ? 'Yes — reminder 30 days before' : 'No']]} />
        {['active', 'completed'].includes(c.state) && <div className="mt-3"><div className="h-2 overflow-hidden rounded-full bg-ink-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(c.done / c.total) * 100}%` }} /></div><p className="mt-1 text-xs text-ink-500">{c.done} of {c.total} {c.type === 'project' ? 'milestones' : 'periods'}</p></div>}
      </Card>
      {c.counter && <Banner tone="amber" title={`${c.counter.by} counter-offer: ${fmtC(c.counter.price, c.cur)}`}>{c.counter.note}</Banner>}
      <Card><p className="text-xs font-bold uppercase tracking-wide text-ink-400">Service levels</p><p className="mt-1 text-sm leading-relaxed text-ink-700">{c.sla}</p><p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink-400">Payment terms</p><p className="mt-1 text-sm text-ink-700">{c.paymentTerms}</p></Card>
      {c.milestones.length > 0 && <Section title="Milestones"><Card><ol className="space-y-3">{c.milestones.map(([n, st, d], i) => <li key={i} className="flex items-center gap-3"><span className={cx('grid size-7 place-items-center rounded-full text-xs font-bold', st === 'done' ? 'bg-emerald-100 text-emerald-700' : st === 'progress' ? 'bg-amber-100 text-amber-700' : 'bg-ink-100 text-ink-400')}>{st === 'done' ? <Check size={14} /> : i + 1}</span><span className="flex-1 text-sm font-semibold">{n}</span><span className="text-xs text-ink-500">{st === 'done' ? `Done ${d}` : `Due ${d}`}</span></li>)}</ol></Card></Section>}
      {c.docs.length > 0 && <Section title="Documents">{c.docs.map((d) => <div key={d} className="mb-2 flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-inset ring-ink-200"><FileText size={18} className="text-brand-600" /><span className="flex-1 truncate text-sm font-medium">{d}</span><Download size={16} className="text-ink-400" /></div>)}</Section>}
      <Section title="History"><Card><Timeline steps={c.history.map((h) => ({ label: { proposed: 'Proposed', negotiating: 'Negotiating', active: 'Active', completed: 'Completed', terminated: 'Terminated' }[h.s] || h.s, at: [h.at, h.by].join(' · '), note: h.note, done: true }))} /></Card></Section>

      <div className="space-y-2.5">
        {myTurn && c.state === 'proposed' && <div className="grid grid-cols-2 gap-2.5"><Button icon={PenLine} onClick={() => setSign(true)}>Accept & sign</Button><Button variant="secondary" onClick={() => setCounter(true)}>Counter-offer</Button></div>}
        {myTurn && c.state === 'negotiating' && <div className="grid grid-cols-2 gap-2.5"><Button onClick={acceptCounter}>Accept counter</Button><Button variant="secondary" onClick={() => setCounter(true)}>Counter again</Button></div>}
        {c.state === 'proposed' && !isVendor && <Banner tone="blue" title="Waiting for the vendor">They can accept, counter or decline.</Banner>}
        {c.state === 'proposed' && !isVendor && c.history.length > 1 && <Button full icon={PenLine} onClick={() => setSign(true)}>Sign now</Button>}
        {c.state === 'active' && <Button full icon={CircleCheck} onClick={advance}>{isVendor ? (c.type === 'project' ? 'Mark milestone complete' : 'Log period delivered') : (c.type === 'project' ? 'Approve milestone' : 'Confirm period delivered')}</Button>}
        {c.state === 'active' && !isVendor && <Button full variant="secondary" icon={Banknote} onClick={() => nav.go('c_pay', { ref: c.id, amount: c.price, cur: c.cur, vendorId: c.vendorId })}>Pay via escrow (Phase 2)</Button>}
        <Button full variant="secondary" onClick={() => start(c.vendorId, c.listingId, { type: 'rfq', id: c.id, label: `Contract ${c.id}` })}>Message {isVendor ? 'customer' : 'vendor'}</Button>
        {['active', 'negotiating'].includes(c.state) && <Button full variant="dangerSoft" onClick={() => setTerm(true)}>End contract</Button>}
        {c.state === 'completed' && !isVendor && <div className="grid grid-cols-2 gap-2.5"><Button onClick={() => nav.go('c_contract_new', { vendorId: c.vendorId, listingId: c.listingId })}>Renew</Button><Button variant="secondary" onClick={() => nav.go('c_review', { vendorId: c.vendorId })}>Rate vendor</Button></div>}
      </div>
    </Screen>
  )
}
