import { useState } from 'react'
import { Building2, Lock, FileText, Globe, CreditCard, Receipt, TrendingUp, Percent } from 'lucide-react'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { CATS, cat } from '../data.jsx'
import { Segmented, Select, Badge } from '../ui.jsx'
import { GEO, country, INDUSTRIES, fmtC, feeSplit } from '../globaldata.jsx'
import { COUNTRY_PACKS, packOf } from '../mvpdata.jsx'
import { Screen, Card, Button, Banner, Input, Chips, KV, Pill, ReasonSheet, EmptyState, PhaseTag, Stat, StatusBadge, PhaseBanner, HBar } from '../ui.jsx'

/* Admin portal screens that are web-only (D-015). */

const STATUS = {
  not_started: ['Not started', 'gray'], draft: ['Draft', 'gray'], submitted: ['Under review', 'amber'], more_info: ['More information needed', 'amber'], approved: ['Approved', 'green'], rejected: ['Rejected', 'red'],
}
const SBadge = ({ s }) => <Badge tone={(STATUS[s] || STATUS.not_started)[1]}>{(STATUS[s] || STATUS.not_started)[0]}</Badge>

/* ---------- admin: review company submissions ---------- */
export function AdminCompany({ params = {} }) {
  const { companies, saveCompany, notify, toast, addAudit, me } = useApp()
  const list = Object.values(companies).filter((c) => c.status !== 'not_started')
  const [sel, setSel] = useState(params.id || null)
  const [act, setAct] = useState(null)
  const c = sel && companies[sel]
  const decide = (status, reason) => {
    saveCompany(c.id, { status, decision: reason })
    notify('business', status === 'approved' ? 'Company approved' : status === 'more_info' ? 'Company: more information needed' : 'Company rejected', reason, 'onboarding', ['b_company', {}])
    addAudit(`Company ${status}`, c.legal, 'onboarding', reason, me.name || 'Admin')
    toast(status === 'approved' ? 'Company approved — badge is live' : 'Decision recorded')
    setAct(null)
  }
  return (
    <Screen title="Company verification" subtitle={`${list.filter((x) => x.status === 'submitted').length} awaiting review`} overlay={c && <ReasonSheet open={!!act} onClose={() => setAct(null)} title={act === 'approved' ? 'Approve company' : act === 'more_info' ? 'Request more information' : 'Reject company'} reasons={act === 'approved' ? ['Evidence verified', 'Site photos / audit reviewed'] : act === 'more_info' ? ['Registration number unclear', 'Certificate expired', 'Bank details mismatch'] : ['Registration not found', 'Documents do not match', 'Unable to verify entity', 'Other']} confirmLabel={act === 'approved' ? 'Approve' : act === 'more_info' ? 'Send request' : 'Reject'} danger={act === 'rejected'} onConfirm={(r) => decide(act, r)} />}>
      {!c && (list.length === 0 ? <EmptyState icon={Building2} title="No submissions" body="Company profiles submitted by Business owners appear here." /> : list.map((x) => (
        <Card key={x.id} onClick={() => setSel(x.id)} className="space-y-1"><div className="flex items-start justify-between gap-2"><p className="text-sm font-bold">{x.legal}</p><SBadge s={x.status} /></div><p className="text-xs text-ink-500">{x.entity} · {x.hq.city} · submitted {x.submittedAt}</p></Card>
      )))}
      {c && (
        <>
          <Button variant="ghost" size="sm" onClick={() => setSel(null)}>← All submissions</Button>
          <Card className="space-y-2"><div className="flex items-start justify-between gap-2"><p className="text-base font-extrabold">{c.legal}</p><SBadge s={c.status} /></div>
            <KV rows={[['Entity', `${c.entity} · est. ${c.year}`], ['Registration', c.regNo], ['Tax ID', c.gstin], ['Address', `${c.hq.addr}, ${c.hq.city}`], ['Industry', INDUSTRIES.find((i) => i.id === c.industry)?.name], ['Capacity', `${c.capacity} ${c.capUnit}`], ['Facilities', c.facilities.map((x) => x.name).join(', ')], ['Certifications', c.certs.map((x) => x.name).join(', ') || '—'], ['Signatory', `${c.signatory.name} · ${c.signatory.desig}`], ['Eligibility', c.eligibility ? `${c.eligibility.designation} · operating ${c.eligibility.years} yrs · registered` : '—'], ['Bank', `${c.bank.holder} · ${c.bank.acc}`]]} /></Card>
          {['submitted', 'more_info'].includes(c.status) ? <div className="grid grid-cols-1 gap-2"><Button full onClick={() => setAct('approved')}>Approve</Button><Button full variant="secondary" onClick={() => setAct('more_info')}>Ask for more information</Button><Button full variant="danger" onClick={() => setAct('rejected')}>Reject</Button></div> : <Banner tone={c.status === 'approved' ? 'green' : 'red'} title={STATUS[c.status][0]}>{c.decision}</Banner>}
        </>
      )}
    </Screen>
  )
}


/* ---------- admin: country packs (international readiness) ---------- */
export function AdminCountry({ params = {} }) {
  const [code, setCode] = useState(params.code || 'IN')
  const c = country(code)
  const pk = packOf(code)
  const live = Object.keys(COUNTRY_PACKS)
  return (
    <Screen title="Country packs" subtitle="Per-country rules without code changes">
      <Chips scroll value={code} onChange={setCode} options={[...live, ...GEO.map((g) => g.code).filter((x) => !live.includes(x)).slice(0, 8)].map((id) => ({ id, label: `${country(id).flag} ${country(id).name}` }))} />
      {!COUNTRY_PACKS[code] && <Banner tone="amber" title="Pack not configured">Defaults are shown. Configure tax ID, evidence and rules before launching {c.name}.</Banner>}
      <Card className="space-y-2"><p className="text-sm font-extrabold">{c.flag} {c.name}</p><KV rows={[['Currency', c.cur || '—'], ['Time zone', pk.tz], ['Tax ID', pk.taxId], ['Date format', pk.calendar], ['SMS / OTP', pk.sms]]} /></Card>
      <Card className="space-y-2"><p className="text-sm font-extrabold">Verification evidence</p>{Object.entries(pk.docs).map(([k, v]) => <div key={k}><p className="text-xs font-bold capitalize text-ink-500">{k}</p><ul className="list-disc pl-5 text-[13px]">{v.map((d) => <li key={d}>{d}</li>)}</ul></div>)}</Card>
      <Card className="space-y-1.5"><p className="text-sm font-extrabold">Local rules</p>{pk.rules.map((r) => <p key={r} className="text-[13px]">• {r}</p>)}</Card>
    </Screen>
  )
}


/* ================= ADMIN: REVENUE, COMMISSION, TAX, REFUNDS ================= */
export function AdminCommission() {
  const { commission, setCommission, payments, payouts, vendors, refunds, taxes, setTaxes, invoices, toast, addAudit, me } = useApp()
  const [tab, setTab] = useState('revenue')
  const [rules, setRules] = useState(commission)
  const [tx, setTx] = useState(taxes)
  const [sheet, setSheet] = useState(null)
  const subRev = vendors.reduce((s, v) => s + ({ Starter: 499, Growth: 1499, Pro: 3999 }[v.sub.plan] || 0) * (['active', 'grace', 'cancelled'].includes(v.sub.status) ? 1 : 0), 0)
  const gstCollected = Math.round(subRev * 0.18)
  const set = (i, k, val) => setRules(rules.map((r, j) => (j === i ? { ...r, [k]: val } : r)))
  return (
    <Screen title="Revenue & commission" overlay={sheet && <ReasonSheet open onClose={() => setSheet(null)} title={sheet === 'tax' ? 'Save tax rates' : 'Save commission rules'} reasons={['Rollout of a new region', 'Pricing review', 'Tax rate change', 'Correction']} confirmLabel="Save" onConfirm={(r) => { if (sheet === 'tax') setTaxes(tx); else setCommission(rules); addAudit(sheet === 'tax' ? 'Changed tax rates' : 'Changed commission rules', sheet === 'tax' ? 'Tax' : 'Commission', 'config', r, me.name); setSheet(null); toast('Saved — applies to new invoices and payments only') }} />}>
      <Chips value={tab} onChange={setTab} options={[['revenue', 'Revenue'], ['rules', 'Commission'], ['tax', 'Tax'], ['payouts', 'Payouts'], ['refunds', 'Refunds']].map(([id, label]) => ({ id, label }))} />
      {tab === 'revenue' && (<>
        <div className="grid grid-cols-2 gap-3"><Stat label="Subscriptions / mo" value={fmtC(subRev)} icon={CreditCard} tone="emerald" delta="+9%" /><Stat label="GST collected / mo" value={fmtC(gstCollected)} icon={Receipt} tone="sky" /><Stat label="Sponsored / mo" value={fmtC(18600)} icon={TrendingUp} tone="amber" delta="+14%" /><Stat label="Invoices issued" value={invoices.length} icon={FileText} tone="violet" /></div>
        <div className="flex items-center gap-2"><PhaseTag p="MVP" /><span className="text-xs text-ink-500">Subscription + sponsored are the only platform revenue at launch</span></div>
        <PhaseBanner p="P2" title="Commission & payment fees" />
        <div className="grid grid-cols-2 gap-3"><Stat label="GMV in escrow" value={fmtC(payments.filter((p) => p.status === 'held').reduce((s, p) => s + p.amount, 0))} icon={Lock} tone="violet" /><Stat label="Commission (est.)" value={fmtC(payments.reduce((s, p) => s + p.fee, 0))} icon={Percent} tone="sky" /></div>
        <Card><p className="mb-3 text-sm font-bold">Revenue mix (projected at scale)</p><div className="space-y-3"><HBar label="Subscriptions" value={46} max={100} right="46%" /><HBar label="Commission" value={38} max={100} right="38%" color="bg-sky-500" /><HBar label="Sponsored visibility" value={16} max={100} right="16%" color="bg-amber-500" /></div></Card>
      </>)}
      {tab === 'rules' && (<>
        <PhaseBanner p="P2" title="Commission rules by category & region" />
        {rules.map((r, i) => <Card key={r.id} className="space-y-3"><div className="flex items-center justify-between"><p className="text-sm font-extrabold">{r.scope}</p><Pill icon={Globe}>{r.region}</Pill></div><div className="grid grid-cols-3 gap-3"><Input label="Rate %" inputMode="decimal" value={String(r.rate)} onChange={(e) => set(i, 'rate', e.target.value.replace(/[^\d.]/g, ''))} /><Input label="Min fee" inputMode="numeric" value={String(r.min)} onChange={(e) => set(i, 'min', e.target.value.replace(/\D/g, ''))} /><Input label="Cap" inputMode="numeric" value={String(r.cap)} onChange={(e) => set(i, 'cap', e.target.value.replace(/\D/g, ''))} /></div><p className="text-xs text-ink-500">Example on ₹10,000: vendor pays {fmtC(feeSplit({ amount: 10000, rate: +r.rate || 0, min: +r.min || 0, cap: +r.cap || 1e9 }).commission)} + tax.</p></Card>)}
        <Button full size="lg" onClick={() => setSheet('rules')}>Save rules</Button>
      </>)}
      {tab === 'tax' && (<>
        <Banner tone="blue" title="Tax on platform charges">Applied to subscriptions, sponsored visibility and (Phase 2) commission. Vendors’ own taxes appear on their invoices.</Banner>
        {tx.map((t, i) => <Card key={t.code} className="space-y-2"><div className="flex items-center justify-between"><p className="text-sm font-extrabold">{t.name}</p><Pill>{t.label}</Pill></div><Input label="Rate %" inputMode="decimal" value={String(t.rate)} onChange={(e) => setTx(tx.map((x, j) => (j === i ? { ...x, rate: +e.target.value.replace(/[^\d.]/g, '') || 0 } : x)))} />{t.note && <p className="text-xs text-ink-500">{t.note}</p>}</Card>)}
        <Button full size="lg" onClick={() => setSheet('tax')}>Save tax rates</Button>
      </>)}
      {tab === 'payouts' && (<>
        <PhaseBanner p="P2" title="Payout queue" />
        {payouts.map((p) => <Card key={p.id} className="!p-3.5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-ink-500">{p.id}</span><StatusBadge s={p.status === 'paid' ? 'paid' : 'scheduled'} /></div><p className="mt-1 text-lg font-extrabold">{fmtC(p.amount, p.cur)}</p><p className="text-xs text-ink-500">{p.items} payments · {p.bank}</p>{p.status === 'scheduled' && <div className="mt-2 flex gap-2"><Button size="sm" variant="secondary" className="flex-1" onClick={() => toast('Payout placed on hold — reason required in production')}>Hold</Button><Button size="sm" className="flex-1" onClick={() => toast('Released to bank')}>Release now</Button></div>}</Card>)}
        <Banner tone="blue" title="Controls">Holds apply for disputes, fraud review and unverified bank accounts. Billing operators can’t change trust state; trust staff can’t release funds.</Banner>
      </>)}
      {tab === 'refunds' && (<>
        <PhaseBanner p="P2" title="Refunds & disputes" />
        {refunds.map((r) => <Card key={r.id} className="!p-3.5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-ink-500">{r.id} · {r.ref}</span><StatusBadge s={r.status === 'refunded' ? 'refunded' : r.status === 'requested' ? 'pending' : r.status} /></div><p className="mt-1 text-sm font-bold">{r.vendor}</p><p className="text-lg font-extrabold">{fmtC(r.amount, r.cur)}</p><p className="text-xs text-ink-500">{r.reason} · {r.policy}</p></Card>)}
        <Banner tone="blue" title="Policy">Escrowed funds refund instantly under the cancellation policy. Released funds are the vendor’s to refund; support facilitates and can enforce platform policy but never refunds from its own funds.</Banner>
      </>)}
    </Screen>
  )
}


/* ---------- admin: add a vendor or business supplier (on hold, O-01) ---------- */
export function AdminVendorNew() {
  const nav = useNav()
  const { setVendors, addAudit, toast, stamp, me } = useApp()
  const [f, setF] = useState({ name: '', owner: '', type: 'vendor', cat: CATS[0]?.id || 'home', city: '', email: '', phone: '' })
  const [err, setErr] = useState('')
  const save = () => {
    if (f.name.trim().length < 3 || f.owner.trim().length < 3 || !f.city.trim()) return setErr('Business name, owner and city are required')
    const id = `admin-v-${Date.now()}`
    const record = {
      id, name: f.name.trim(), owner: f.owner.trim(), cat: f.cat, city: f.city.trim(), areas: [f.city.trim()], branches: 1, acct: 'pending',
      kind: f.type === 'business' ? 'supplier' : cat(f.cat).type === 'product' ? 'supplier' : 'service', ver: 'not_started', tone: cat(f.cat).tone || 'teal', since: new Date().getFullYear(),
      gstin: '', phone: f.phone, email: f.email, resp: null, jobs: 0, rating: 0, reviews: 0, langs: ['English'], docs: [],
      sub: { plan: 'Free', status: 'none', renews: '—', paidUntil: null, autoRenew: false, leads: 0 }, history: [{ s: 'created by admin', at: stamp(), by: me.name || 'Admin' }],
      country: 'IN', tier: 0, website: '',
    }
    setVendors((all) => [record, ...all])
    addAudit(f.type === 'business' ? 'Created business supplier' : 'Created vendor account', record.name, 'user', 'Admin-created account', me.name || 'Admin')
    toast(f.type === 'business' ? 'Business supplier added' : 'Vendor added')
    nav.go('ad_vendor', { id })
  }
  return (
    <Screen title={f.type === 'business' ? 'Add business supplier' : 'Add vendor'} footer={<Button full size="lg" onClick={save}>Create account</Button>}>
      <Banner tone="amber" title="On hold (O-01)">Whether admins may create accounts on a vendor’s behalf is not decided yet. This screen is kept as it was and is not changed until the owner answers.</Banner>
      <Banner tone="blue">Admin-created accounts enter verification as pending. The account owner must provide evidence before approval.</Banner>
      <Segmented value={f.type} onChange={(type) => setF({ ...f, type })} options={[{ id: 'vendor', label: 'Vendor' }, { id: 'business', label: 'Business supplier' }]} />
      <Input label="Business name" required value={f.name} onChange={(e) => { setF({ ...f, name: e.target.value }); setErr('') }} />
      <Input label="Owner / authorised contact" required value={f.owner} onChange={(e) => { setF({ ...f, owner: e.target.value }); setErr('') }} />
      <Select label="Primary category" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })} options={CATS.map((c) => ({ value: c.id, label: c.name }))} />
      <Input label="City / coverage base" required value={f.city} onChange={(e) => { setF({ ...f, city: e.target.value }); setErr('') }} />
      <div className="grid gap-3 sm:grid-cols-2"><Input label="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /><Input label="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      {err && <p className="text-sm font-medium text-red-600">{err}</p>}
    </Screen>
  )
}
