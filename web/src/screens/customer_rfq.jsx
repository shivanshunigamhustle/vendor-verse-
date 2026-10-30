import { rfqStatus } from '../mvpdata.jsx'
import { useState } from 'react'
import { FileText, Paperclip, X, Clock, Store, MessageCircle, GitCompare, TrendingDown, Zap, Download, CircleDollarSign, Package, Pencil, CalendarPlus, History, ShieldCheck, Lock, Check, Ban, Scale, TriangleAlert } from 'lucide-react'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { CATS, liveCats, cat, serves, CITIES } from '../data.jsx'
import { GEO, CUR } from '../globaldata.jsx'
import {
  Screen, Card, Section, Button, Thumb, Segmented, Sheet, Input, Select, Toggle, Badge, Banner, EmptyState, KV, fmt, cx, Pill, StatusBadge, Timeline, Meta, Checkbox, Scan, ReasonSheet, Missing, Countdown,
} from '../ui.jsx'
import { VerifiedBadge, useStartChat } from './shared.jsx'

const effStatus = (q) => (q.status === 'pending' && q.leftDays <= 0 ? 'expired' : q.status)
export const qLabel = { pending: 'quote_pending', expired: 'expired', accepted: 'accepted', unsuccessful: 'unsuccessful', withdrawn: 'withdrawn' }

export function RfqCard({ r, onClick, role = 'customer' }) {
  const { vendor } = useApp()
  const c = cat(r.cat)
  return (
    <Card onClick={onClick} className="!p-3.5">
      <div className="flex items-start gap-3">
        <Thumb tone={c.tone} icon={c.icon} size={46} round="rounded-xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-ink-500">{r.id}{role === 'vendor' ? ` · ${r.customer}` : ''}</span><StatusBadge s={rfqStatus(r)} /></div>
          <p className="mt-0.5 line-clamp-1 text-sm font-bold">{r.title}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-500"><span>{r.qty}</span><span>·</span><span>{r.quotes.filter((q) => q.status !== 'withdrawn').length} quotes</span><span>·</span><span>by {r.deadline}</span></p>
        </div>
      </div>
    </Card>
  )
}

/* ================= CREATE / EDIT RFQ (spec §9.1, §9.4) ================= */
export function RfqNew({ params = {} }) {
  const nav = useNav()
  return <RfqForm params={params} nav={nav} />
}
export function RfqEdit({ params = {} }) {
  const nav = useNav()
  return <RfqForm params={params} nav={nav} editing />
}
function RfqForm({ params, nav, editing }) {
  const { rfqs, setRfqs, patchRfq, notify, toast, listings, vendors, published, vendor, loc, me } = useApp()
  const ex = editing ? rfqs.find((r) => r.id === params.id) : null
  const [f, setF] = useState(ex ? { title: ex.title, cat: ex.cat, qty: ex.qty, budget: ex.budget, deadline: '2026-10-30', location: ex.location, timeline: ex.timeline, desc: ex.specs.map(([k, v]) => `${k}: ${v}`).join('\n'), answers: Object.fromEntries(ex.specs.map(([k, v]) => [k, v])) } : { title: params.title ? `Quote: ${params.title}` : '', cat: params.cat || 'constr', qty: '', budget: '', deadline: '2026-10-30', location: loc.city, timeline: '', desc: '', answers: {} })
  const [files, setFiles] = useState(ex?.files || [])
  const [gx, setGx] = useState({ dest: 'IN', inco: '', tcur: 'INR', target: '', samples: false })
  const [errs, setErrs] = useState({})
  const c = cat(f.cat)
  const set = (k) => (e) => { setF({ ...f, [k]: e?.target ? e.target.value : e }); setErrs({ ...errs, [k]: '' }) }
  const eligible = vendors.filter((v) => listings.some((l) => l.vendorId === v.id && l.cat === f.cat && published(l) && l.areas.includes(f.location)))
  const submit = () => {
    const e = {}
    if (f.title.trim().length < 5) e.title = 'Add a short title (min 5 characters)'
    if (!f.qty.trim()) e.qty = 'Enter quantity / scope'
    if (!f.timeline.trim()) e.timeline = 'Add a date or timeline'
    if (!f.budget.trim()) e.budget = 'Add a budget range'
    c.rfq.forEach((k) => { if (!(f.answers[k] || '').trim()) e['a_' + k] = 'Required for this category' })
    setErrs(e)
    if (Object.keys(e).length) return toast('Please complete the required fields', 'warn')
    const [y, m, d] = f.deadline.split('-')
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]
    const specs = [...c.rfq.map((k) => [k, f.answers[k]]), ...(gx.target ? [['Target price', `${CUR[gx.tcur].sym}${gx.target} (${gx.tcur})`]] : []), ...(gx.inco ? [['Incoterm', gx.inco]] : []), ...(gx.dest !== 'IN' ? [['Destination', GEO.find((g) => g.code === gx.dest).name]] : []), ...(gx.samples ? [['Samples', 'Requested']] : [])]
    if (ex) {
      patchRfq(ex.id, (x) => ({ title: f.title, qty: f.qty, budget: f.budget, timeline: f.timeline, specs, files, location: f.location, rev: x.rev + 1, revisions: [...x.revisions, { n: x.rev + 1, at: 'Just now', note: 'Material edit — vendors who quoted were notified' }] }))
      notify('vendor', 'RFQ was revised', `${ex.id} · revision ${ex.rev + 1}`, 'rfq', ['v_rfq', { id: ex.id }])
      toast(`Saved as revision ${ex.rev + 1} — vendors notified`)
      nav.back()
      return
    }
    const id = 'RFQ-' + (321 + rfqs.length)
    setRfqs((r) => [{ id, customer: me.name, title: f.title, cat: f.cat, specs, qty: f.qty, budget: f.budget, location: f.location, timeline: f.timeline, deadline: `${d} ${mon} ${y}`, extended: false, files, state: 'open', created: '19 Oct 2026', rev: 1, recipients: eligible.length, revisions: [{ n: 1, at: 'Just now', note: 'RFQ published' }], quotes: [], thread: null }, ...r])
    notify('vendor', 'RFQ matches your category', `${id} · ${f.title}`, 'rfq', ['v_rfq', { id }])
    toast(`RFQ sent to ${eligible.length} eligible vendor${eligible.length === 1 ? '' : 's'}`)
    nav.replace('c_rfq', { id })
  }
  return (
    <Screen title={editing ? `Edit ${ex.id}` : 'Request quotation'} subtitle={editing ? `Creates revision ${ex.rev + 1}` : 'Structured request for eligible vendors'} footer={<Button full size="lg" onClick={submit}>{editing ? 'Save revision' : 'Send RFQ'}</Button>}>
      {editing && <Banner tone="amber" title="Edits are tracked">Material changes create a revision and notify vendors. After you accept a quote you can no longer edit — changes then need a separate agreement.</Banner>}
      <Select label="Category" value={f.cat} onChange={set('cat')} options={liveCats().filter((x) => x.mode !== 'booking').map((x) => ({ value: x.id, label: x.name }))} />
      <Input label="What do you need?" required placeholder="e.g. Complete rewiring for a 3,200 sq ft office" value={f.title} onChange={set('title')} error={errs.title} />
      <Input label="Quantity / scope" required placeholder="e.g. 3,200 sq ft · 200 units" value={f.qty} onChange={set('qty')} error={errs.qty} />
      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-700">{c.name} — specific questions</p>
        <div className="space-y-3">{c.rfq.map((k) => <Input key={k} label={k} required value={f.answers[k] || ''} onChange={(e) => setF({ ...f, answers: { ...f.answers, [k]: e.target.value } })} error={errs['a_' + k]} />)}</div>
        <p className="mt-1.5 text-xs text-ink-500">These fields come from the category’s RFQ schema and can differ per category.</p>
      </div>
      <div className="flex gap-3"><Input label="Budget range" required placeholder="₹1,50,000 – ₹2,20,000" value={f.budget} onChange={set('budget')} error={errs.budget} /><Input label="Date / timeline" required placeholder="Start by 4 Nov" value={f.timeline} onChange={set('timeline')} error={errs.timeline} /></div>
      <div className="flex gap-3"><Input label="Quotes needed by" required type="date" value={f.deadline} onChange={set('deadline')} /><Select label="Service / delivery location" value={f.location} onChange={set('location')} options={CITIES} /></div>
      {c.mode !== 'booking' && (
        <div className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-ink-100">
          <p className="flex items-center gap-2 text-sm font-extrabold">Sourcing details <span className="text-xs font-medium text-ink-400">(optional)</span></p>
          <div className="flex gap-3"><Select label="Deliver to" value={gx.dest} onChange={(e) => setGx({ ...gx, dest: e.target.value })} options={GEO.map((g) => ({ value: g.code, label: `${g.flag} ${g.name}` }))} /><Select label="Incoterm" value={gx.inco} onChange={(e) => setGx({ ...gx, inco: e.target.value })} options={[{ value: '', label: 'Not applicable' }, 'EXW', 'FCA', 'FOB', 'CIF', 'DAP', 'DDP']} /></div>
          <div className="flex gap-3"><Select label="Currency" value={gx.tcur} onChange={(e) => setGx({ ...gx, tcur: e.target.value })} options={Object.keys(CUR)} /><Input label="Target unit price" inputMode="decimal" value={gx.target} onChange={(e) => setGx({ ...gx, target: e.target.value.replace(/[^\d.]/g, '') })} /></div>
          <Toggle label="I need samples first" on={gx.samples} onChange={(v) => setGx({ ...gx, samples: v })} />
          {(gx.dest !== 'IN' || gx.inco) && <p className="rounded-lg bg-sky-50 p-2.5 text-xs text-sky-900"><b>Phase 2:</b> cross-border quoting, customs documents and freight bundles. In the MVP this is recorded on the RFQ and agreed with the vendor in chat.</p>}
        </div>
      )}
      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-700">Reference files</p>
        <div className="space-y-2">
          {files.map((n) => <div key={n} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-inset ring-ink-200"><FileText size={18} className="text-brand-600" /><span className="flex-1 truncate text-sm font-medium">{n}</span><span className="text-[11px] font-semibold text-emerald-700">Scanned ✓</span><button onClick={() => setFiles(files.filter((x) => x !== n))} aria-label="Remove"><X size={17} className="text-ink-400" /></button></div>)}
          <button onClick={() => setFiles([...files, ['Floor-plan.pdf', 'Spec-sheet.xlsx', 'Site-photo.jpg'][files.length % 3]])} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300 py-3.5 text-sm font-semibold text-ink-500"><Paperclip size={16} />Add file</button>
          <Scan>PDF, images, Office files up to 10 MB · type and size checked, malware scanned, visible only to you and vendors who receive this RFQ.</Scan>
        </div>
      </div>
      <Card>
        <p className="text-sm font-bold">Who receives it</p>
        <p className="mt-1 text-xs text-ink-500">Only eligible vendors — right category, serving {f.location}, publicly listed — receive or can discover this RFQ.</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">{eligible.length ? eligible.map((v) => <Pill key={v.id}>{v.name}</Pill>) : <Missing>No eligible vendors serve {f.location} yet</Missing>}</div>
        {eligible.length === 0 && <p className="mt-2 text-xs font-semibold text-amber-700">You can still publish — vendors who join later and match will see it until the deadline.</p>}
        <p className="mt-2 text-[11px] text-ink-400">Contact details come from your account and stay hidden. The RFQ captures its deadline, matching criteria and revision number.</p>
      </Card>
    </Screen>
  )
}

/* ================= RFQ DETAIL ================= */
export function RfqDetail({ params }) {
  const nav = useNav()
  const start = useStartChat()
  const { rfqs, patchRfq, vendor, notify, toast, me, orders, setOrders } = useApp()
  const r = rfqs.find((x) => x.id === (params.id || 'RFQ-311'))
  const [tab, setTab] = useState('quotes')
  const [cmp, setCmp] = useState(false)
  const [acc, setAcc] = useState(null)
  const [agree, setAgree] = useState(false)
  const [ext, setExt] = useState(false)
  const [closeR, setCloseR] = useState(false)
  if (!r) return <Screen title="RFQ"><EmptyState title="RFQ not found" /></Screen>
  const quotes = r.quotes.map((q) => ({ ...q, eff: effStatus(q) }))
  const valid = quotes.filter((q) => q.eff === 'pending')
  const best = valid.length ? Math.min(...valid.map((q) => q.price)) : 0
  const sorted = [...quotes].sort((a, b) => (a.eff === 'pending' ? 0 : 1) - (b.eff === 'pending' ? 0 : 1) || a.price - b.price)
  const accepted = r.accepted
  const locked = r.state !== 'open'
  const accept = () => {
    // One atomic step: re-check ownership, RFQ state, quote status and validity, then write the winner + losers + snapshot together.
    if (r.state !== 'open') return toast('RFQ_CLOSED — another quote was already accepted', 'warn')
    if (effStatus(acc) !== 'pending') return toast('QUOTE_EXPIRED — this quote can no longer be accepted', 'warn')
    const wo = 'WO-' + (118 + rfqs.length)
    patchRfq(r.id, (x) => ({
      state: 'accepted',
      quotes: x.quotes.map((q) => (q.id === acc.id ? { ...q, status: 'accepted', audit: [...q.audit, 'Accepted by customer · just now'] } : q.status === 'pending' && q.leftDays > 0 ? { ...q, status: 'unsuccessful', audit: [...q.audit, 'Marked unsuccessful — another quote was accepted'] } : q)),
      accepted: { quoteId: acc.id, vendorId: acc.vendorId, price: acc.price, at: 'Just now', snapshot: { price: `${fmt(acc.price)} (INR)`, scope: acc.scope, incl: acc.incl, excl: acc.excl, timeline: acc.timeline, validity: `Valid till ${acc.validity} (accepted before expiry)`, version: `Quote v${(acc.revised || 0) + 1} · terms hash ${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 5)}` }, workOrder: wo },
      revisions: [...x.revisions, { n: x.rev, at: 'Just now', note: `Quote from ${vendor(acc.vendorId).name} accepted — RFQ closed to further acceptance` }],
    }))
    notify('vendor', 'Your quotation was accepted 🎉', `${r.id} · ${fmt(acc.price)} · work order ${wo} created`, 'rfq', ['v_rfq', { id: r.id }])
    valid.filter((q) => q.id !== acc.id).forEach((q) => notify('vendor', 'Quotation not selected', `${r.id} · the customer chose another vendor`, 'rfq', ['v_rfq', { id: r.id }]))
    if (acc.terms) {
      const po = 'PO-' + (3004 + orders.length)
      const qn = parseInt(String(acc.terms.qty).replace(/,/g, ''), 10) || 1
      setOrders((o) => [{ id: po, buyer: r.customer, org: r.buyerOrg || 'Mehta Retail LLP', vendorId: acc.vendorId, rfq: r.id, title: r.title, items: [{ name: r.title, qty: qn, unit: 'pc', price: Math.round((acc.price / qn) * 100) / 100 }], cur: 'INR', delivery: (r.specs.find(([k]) => /deliver/i.test(k)) || [0, r.location])[1], by: r.timeline.replace('By ', ''), payTerms: acc.terms.pay, incoterm: acc.terms.inco, state: 'po_created', history: [{ s: 'po_created', at: 'Just now', note: `Created from accepted quote ${acc.id}`, by: r.customer }] }, ...o])
      patchRfq(r.id, (x) => ({ accepted: { ...x.accepted, next: { kind: 'po', id: po } } }))
      notify('vendor', 'New purchase order', `${po} from ${r.id}`, 'order', ['v_order', { id: po }])
      toast(`Accepted — purchase order ${po} created`)
    } else {
      patchRfq(r.id, (x) => ({ accepted: { ...x.accepted, next: { kind: 'wo', id: wo } } }))
      toast(`Accepted — work order ${wo} created`)
    }
    setAcc(null); setAgree(false)
  }
  const extend = (d) => {
    patchRfq(r.id, (x) => ({ state: 'open', extended: true, deadline: d, revisions: [...x.revisions, { n: x.rev, at: 'Just now', note: `Deadline extended to ${d}` }] }))
    notify('vendor', 'RFQ deadline extended', `${r.id} now closes ${d}`, 'rfq', ['v_rfq', { id: r.id }])
    setExt(false); toast('Deadline extended — vendors reminded')
  }
  return (
    <Screen
      title={r.id}
      right={<StatusBadge s={rfqStatus(r)} className="mr-2" />}
      overlay={
        <>
          <Sheet open={!!acc} onClose={() => { setAcc(null); setAgree(false) }} title="Accept this quotation" footer={<Button full disabled={!agree} onClick={accept}>Accept exactly these terms</Button>}>
            {acc && <>
              <Card className="!bg-ink-50 shadow-none">
                <p className="text-sm font-bold">{vendor(acc.vendorId).name}</p>
                <KV className="mt-2" rows={[['Price', <b>{fmt(acc.price)} INR</b>], ['Scope', acc.scope], ['Included', acc.incl], ['Excluded', acc.excl], ['Timeline', acc.timeline], ['Valid till', acc.validity]]} />
              </Card>
              <Banner tone="amber" title="This locks the terms">Acceptance is final for this RFQ. Other quotes are closed as unsuccessful, and the accepted terms can’t be edited — changes need a separate agreement. You pay the vendor directly.</Banner>
              <Checkbox checked={agree} onChange={setAgree}>I’ve read the scope, inclusions, exclusions, timeline and validity.</Checkbox>
            </>}
          </Sheet>
          <Sheet open={ext} onClose={() => setExt(false)} title="Extend the deadline"><p className="text-sm text-ink-600">Eligible vendors are reminded when you extend.</p><div className="grid grid-cols-3 gap-2">{[['+3 days', '27 Oct 2026'], ['+7 days', '31 Oct 2026'], ['+14 days', '07 Nov 2026']].map(([a, d]) => <Button key={a} variant="secondary" onClick={() => extend(d)}>{a}</Button>)}</div></Sheet>
          <ReasonSheet open={closeR} onClose={() => setCloseR(false)} title="Close this RFQ" intro="Closing prevents any further acceptance." confirmLabel="Close RFQ" danger reasons={['No longer needed', 'Found a vendor elsewhere', 'Requirement changed', 'Other']} onConfirm={(why) => { patchRfq(r.id, (x) => ({ state: 'closed', revisions: [...x.revisions, { n: x.rev, at: 'Just now', note: `Closed by customer: ${why}` }] })); setCloseR(false); toast('RFQ closed') }} />
        </>
      }
    >
      <Card>
        <p className="text-base font-bold leading-snug">{r.title}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs"><Meta icon={Package}>{r.qty}</Meta><Meta icon={CircleDollarSign}>{r.budget}</Meta><Meta icon={Clock}>Quotes by {r.deadline}{r.extended ? ' (extended)' : ''}</Meta><Meta icon={Store}>{cat(r.cat).name}</Meta></div>
        <p className="mt-2 text-[11px] text-ink-400">Revision {r.rev} · sent to {r.recipients} eligible vendors</p>
      </Card>

      {accepted && (
        <Card className="space-y-3 !ring-2 !ring-emerald-500">
          <div className="flex items-center gap-2"><Lock size={16} className="text-emerald-700" /><p className="text-sm font-bold text-emerald-800">Accepted terms · work order {accepted.workOrder}</p></div>
          <KV rows={[['Vendor', vendor(accepted.vendorId).name], ['Agreed price', <b>{accepted.snapshot.price}</b>], ['Scope', accepted.snapshot.scope], ['Included', accepted.snapshot.incl], ['Excluded', accepted.snapshot.excl], ['Timeline', accepted.snapshot.timeline], ['Validity', accepted.snapshot.validity], ['Accepted', accepted.at]]} />
          <p className="flex items-start gap-1.5 text-[11px] text-ink-500"><ShieldCheck size={12} className="mt-0.5 shrink-0" />Immutable snapshot ({accepted.snapshot.version}). The vendor can’t edit it, and neither can you. For changes use a separate agreement or support. Payment stays directly between you and the vendor.</p>
          {accepted.next?.kind === 'po' && <Button full onClick={() => nav.go('c_order', { id: accepted.next.id })}>View purchase order {accepted.next.id}</Button>}
          <div className="flex gap-2"><Button className="flex-1" size="sm" icon={MessageCircle} onClick={() => start(accepted.vendorId, null, { type: 'rfq', id: r.id, label: `${r.id} · accepted quote` })}>Message vendor</Button><Button size="sm" variant="secondary" onClick={() => nav.go('c_report', { type: 'booking', id: r.id, label: r.title, kind: 'issue' })}>Report issue</Button></div>
        </Card>
      )}
      {r.state === 'no_quotes' && <Banner tone="gray" title="No quotes arrived" action={<div className="flex gap-2"><Button size="sm" onClick={() => nav.go('c_rfq_edit', { id: r.id })}>Revise requirement</Button><Button size="sm" variant="secondary" onClick={() => nav.go('c_explore', { cat: r.cat })}>Contact vendors</Button></div>}>You’ve already extended the deadline once. Try revising the requirement or message vendors directly.</Banner>}
      {r.state === 'open' && quotes.length === 0 && <Banner tone="blue" title="Waiting for quotes" action={<Button size="sm" variant="secondary" icon={CalendarPlus} onClick={() => setExt(true)}>Extend deadline</Button>}>Eligible vendors have been notified and will be reminded. You’ll get an alert for every quotation.</Banner>}
      {r.state === 'closed' && <Banner tone="gray" title="RFQ closed">No further quotes can be accepted.</Banner>}
      {r.draft && <Banner tone="gray" title="Draft — not sent" action={<Button size="sm" onClick={() => { patchRfq(r.id, { draft: false, sentAt: 'just', rev: 1, recipients: 3, deadline: '05 Nov 2026', revisions: [{ n: 1, at: 'Just now', note: 'RFQ sent' }] }); toast('RFQ sent to eligible vendors') }}>Complete & send</Button>}>Vendors can’t see this until you send it.</Banner>}
      {r.state === 'withdrawn' && <Banner tone="gray" title="Withdrawn by you">Vendors who quoted were told this RFQ is no longer active.</Banner>}
      {r.state === 'expired' && <Banner tone="amber" title="Expired" action={<Button size="sm" onClick={() => setExt(true)}>Reopen with new deadline</Button>}>The deadline passed without an accepted quote.</Banner>}
      {r.state === 'rejected' && <Banner tone="red" title="All quotations rejected">You rejected every quotation. Revise the requirement to try again.</Banner>}

      <Segmented value={tab} onChange={setTab} options={[{ id: 'quotes', label: 'Quotes', count: quotes.length }, { id: 'details', label: 'Details' }, { id: 'history', label: 'Revisions' }]} />

      {tab === 'quotes' && (
        <div className="space-y-3">
          {quotes.length > 1 && <Button full variant="soft" icon={GitCompare} onClick={() => setCmp(!cmp)}>{cmp ? 'Hide comparison' : 'Compare quotations'}</Button>}
          {cmp && (
            <Card pad={false} className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[340px] text-left text-xs">
                <thead><tr className="border-b border-ink-100 bg-ink-50"><th className="p-3 font-semibold text-ink-500"> </th>{sorted.map((q) => <th key={q.id} className="p-3 font-bold">{vendor(q.vendorId).name.split(' ')[0]}</th>)}</tr></thead>
                <tbody>{[...(quotes.some((q) => q.terms) ? [['Unit price', (q) => q.terms?.unit || '—'], ['Quantity', (q) => q.terms?.qty || '—'], ['Lead time', (q) => q.terms?.lead || '—'], ['Payment terms', (q) => q.terms?.pay || '—'], ['Incoterm', (q) => q.terms?.inco || '—']] : []), ['Price', (q) => <b className={q.price === best && q.eff === 'pending' ? 'text-emerald-600' : ''}>{fmt(q.price)}</b>], ['Timeline', (q) => q.timeline], ['Included', (q) => q.incl], ['Excluded', (q) => q.excl || '—'], ['Valid till', (q) => q.eff === 'expired' ? <span className="font-bold text-red-600">Expired</span> : q.validity], ['Verified', (q) => (vendor(q.vendorId).ver === 'approved' ? '✓' : '—')], ['Rating', (q) => (vendor(q.vendorId).rating || <Missing>None yet</Missing>)]].map(([k, fn]) => <tr key={k} className="border-b border-ink-100 align-top last:border-0"><td className="p-3 font-semibold text-ink-500">{k}</td>{sorted.map((q) => <td key={q.id} className="p-3">{fn(q)}</td>)}</tr>)}</tbody>
              </table>
            </Card>
          )}
          {sorted.map((q) => {
            const v = vendor(q.vendorId)
            return (
              <Card key={q.id} className={cx(q.eff === 'accepted' && '!ring-2 !ring-emerald-500', ['unsuccessful', 'expired', 'withdrawn'].includes(q.eff) && 'opacity-70')}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5"><Thumb tone={v.tone} icon={cat(v.cat).icon} size={40} round="rounded-xl" /><div><p className="text-sm font-bold leading-tight">{v.name}</p><div className="mt-1"><VerifiedBadge id={v.id} compact /></div></div></div>
                  <StatusBadge s={qLabel[q.eff]} />
                </div>
                <div className="mt-3 flex items-end justify-between"><div><p className="text-2xl font-extrabold">{fmt(q.price)}<span className="ml-1 text-xs font-semibold text-ink-400">INR</span></p><p className="text-xs text-ink-500">{q.timeline}</p></div><div className="flex flex-col items-end gap-1">{q.price === best && valid.length > 1 && q.eff === 'pending' && <Badge tone="green"><TrendingDown size={11} />Lowest</Badge>}{q.eff === 'pending' && <Countdown mins={q.leftDays * 1440} label="valid" />}{q.eff === 'expired' && <Badge tone="red">Expired {q.validity}</Badge>}</div></div>
                <div className="mt-3 space-y-1.5 rounded-xl bg-ink-50 p-3 text-[12.5px] text-ink-700"><p><b>Scope:</b> {q.scope}</p><p><b>Included:</b> {q.incl}</p><p><b>Excluded:</b> {q.excl || '—'}</p>{q.notes && <p><b>Notes:</b> {q.notes}</p>}</div>
                {q.revised > 0 && <p className="mt-2 text-xs font-semibold text-brand-700">Revised by vendor — you were notified; you’ll accept the current terms.</p>}
                {q.eff === 'expired' && <p className="mt-2 text-xs text-ink-500">Can’t be accepted. The vendor may issue a new quote while the RFQ is open.</p>}
                {q.eff === 'pending' && !locked && (
                  <div className="mt-3 flex flex-wrap gap-2"><Button variant="secondary" size="sm" className="flex-1" icon={MessageCircle} onClick={() => start(q.vendorId, null, { type: 'rfq', id: r.id, label: `${r.id} · negotiation` })}>Negotiate</Button><Button size="sm" className="flex-1" onClick={() => setAcc(q)}>Accept quote</Button><Button variant="ghost" size="sm" className="flex-1" onClick={() => { patchRfq(r.id, (x) => ({ negotiating: true, quotes: x.quotes.map((y) => (y.id === q.id ? { ...y, ask: true, audit: [...y.audit, 'Customer asked for a revision · just now'] } : y)) })); notify('vendor', 'Revision requested', `${r.id} · the customer asked you to revise your quotation`, 'rfq', ['v_rfq', { id: r.id }]); toast('Revision requested — vendor notified') }}>Request revision</Button><Button variant="ghost" size="sm" className="flex-1 !text-red-600" onClick={() => { patchRfq(r.id, (x) => ({ quotes: x.quotes.map((y) => (y.id === q.id ? { ...y, status: 'unsuccessful', audit: [...y.audit, 'Rejected by customer · just now'] } : y)) })); toast('Quote rejected') }}>Reject</Button></div>
                )}
              </Card>
            )
          })}
        </div>
      )}
      {tab === 'details' && (
        <div className="space-y-3">
          <Card><KV rows={[...r.specs, ['Budget', r.budget], ['Location', r.location], ['Timeline', r.timeline], ['Created', r.created]]} /></Card>
          {r.files.length > 0 && <Section title="Attachments"><div className="space-y-2">{r.files.map((f) => <div key={f} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-inset ring-ink-200"><FileText size={18} className="text-brand-600" /><span className="flex-1 truncate text-sm font-medium">{f}</span><Download size={16} className="text-ink-400" /></div>)}<Scan /></div></Section>}
          {r.state === 'open' && (
            <div className="grid grid-cols-2 gap-2.5"><Button variant="secondary" icon={Pencil} onClick={() => nav.go('c_rfq_edit', { id: r.id })}>Edit RFQ</Button><Button variant="secondary" icon={CalendarPlus} onClick={() => setExt(true)}>Extend deadline</Button><Button full variant="dangerSoft" className="col-span-2" icon={Ban} onClick={() => setCloseR(true)}>Close RFQ</Button></div>
          )}
          {r.state === 'open' && !r.draft && <Button full variant="dangerSoft" onClick={() => { patchRfq(r.id, { state: 'withdrawn', revisions: [...r.revisions, { n: r.rev, at: 'Just now', note: 'RFQ withdrawn by customer' }] }); notify('vendor', 'RFQ withdrawn', r.id, 'rfq', ['v_rfq', { id: r.id }]); toast('RFQ withdrawn') }}>Withdraw RFQ</Button>}
      {r.state === 'accepted' && <Banner tone="gray" title="Editing is locked">After acceptance, changes require a separate agreement rather than editing the accepted terms.</Banner>}
        </div>
      )}
      {tab === 'history' && <Card><Timeline steps={r.revisions.map((h) => ({ label: `Rev ${h.n} · ${h.note}`, at: h.at, done: true }))} /></Card>}

      {r.state === 'open' && valid.length > 1 && (
        <Card className="!bg-ink-100 shadow-none">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Mockup control · concurrency</p>
          <p className="mt-1 text-xs text-ink-600">Simulate a second device accepting a different quote at the same moment.</p>
          <Button className="mt-2" size="sm" variant="secondary" icon={Scale} onClick={() => toast('Only one acceptance can win. The slower request fails safely: RFQ_CLOSED', 'warn')}>Race two acceptances</Button>
        </Card>
      )}
    </Screen>
  )
}
