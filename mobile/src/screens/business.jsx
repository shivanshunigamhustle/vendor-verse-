import { useState, useEffect } from 'react'
import {
  Building2, Factory, Lock, ShieldCheck, FileText, Package, Users, Repeat, LogOut, MapPin, Plus, Trash2, Award, Globe, Inbox, CheckCircle2, Clock, XCircle, Pencil, MessageCircle, Briefcase, Search, UserCheck, Info,
} from 'lucide-react'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { GEO, country, INDUSTRIES, KIND_LABEL, lookupPin } from '../globaldata.jsx'
import {
  VENDOR_TYPES, COUNTRY_PACKS, packOf, ENTITY_TYPES, EMP_BANDS, TURNOVER_BANDS, FACILITY_TYPES, INCOTERMS, CERT_OPTIONS, COMPANY_STEPS, COMPANY_DOCS, companyDone, OWNER_ROLES, NON_OWNER_ROLES, MIN_YEARS, BIZ_SERVICES,
} from '../mvpdata.jsx'
import {
  Screen, Card, Button, Banner, Input, Select, Chips, Checkbox, DocTile, Stepper, KV, Pill, Badge, ListRow, Sheet, ReasonSheet, EmptyState, Timeline, SearchBar, Segmented, Avatar, cx,
} from '../ui.jsx'
import { useBizChat, LangButton } from './shared.jsx'
import { Logo } from './auth.jsx'

const STATUS = {
  not_started: ['Not started', 'gray'], draft: ['Draft', 'gray'], submitted: ['Under review', 'amber'], more_info: ['More information needed', 'amber'], approved: ['Approved', 'green'], rejected: ['Rejected', 'red'],
}
const SBadge = ({ s }) => <Badge tone={(STATUS[s] || STATUS.not_started)[1]}>{(STATUS[s] || STATUS.not_started)[0]}</Badge>

/* Business is its own account type (company owners only) — it never shares a vendor identity */
const useCompany = () => {
  const { me, companies } = useApp()
  const id = me.bizId || 'biz-me'
  return { id, company: companies[id] || { id, status: 'not_started' } }
}
const YEAR_MAX = new Date('2026-10-27').getFullYear() - MIN_YEARS

/* ---------- eligibility: only the owner of a long-standing registered company may open a Business account ---------- */
export function BizEligibility() {
  const nav = useNav()
  const { setMe, saveCompany, toast } = useApp()
  const { id, company } = useCompany()
  const ex = company.eligibility
  const [f, setF] = useState({ designation: ex?.designation || '', years: ex?.years ? String(ex.years) : '', registered: ex ? (ex.registered ? 'yes' : 'no') : '', confirm: false })
  const [fails, setFails] = useState(null)
  const check = () => {
    const bad = []
    if (!f.designation) bad.push('Choose your role in the company')
    else if (!OWNER_ROLES.includes(f.designation)) bad.push('Only the owner, founder, director or managing partner can open a Business account')
    if (!f.registered) bad.push('Say whether the company is a registered entity')
    else if (f.registered === 'no') bad.push('The company must be a registered entity (incorporation, LLP, partnership or registered proprietorship)')
    if (f.years === '') bad.push('Enter how many years the company has operated')
    else if (+f.years < MIN_YEARS) bad.push(`The company must have operated for ${MIN_YEARS}+ years`)
    if (!bad.length && !f.confirm) bad.push('Please confirm the declaration')
    setFails(bad)
    if (bad.length) return
    saveCompany(id, { eligibility: { designation: f.designation, years: +f.years, registered: true } })
    toast('Eligibility confirmed')
    nav.replace('b_register')
  }
  const vendorInstead = () => { setMe({ role: null, loggedIn: false, guest: false, vendorId: null, hasVendor: false, bizId: null, name: '' }); nav.reset('register') }
  return (
    <Screen title="Business account" subtitle="Eligibility" back={false} footer={<Button full size="lg" onClick={check}>Confirm & continue</Button>}>
      <Banner tone="blue" title="Company owners only">A Business account is for the owner of an established, registered company — industries and manufacturers. It is a separate account from a vendor: vendors reach you by message, customers cannot.</Banner>
      <Select label="Your role in the company" required value={f.designation} onChange={(e) => { setF({ ...f, designation: e.target.value }); setFails(null) }} options={[{ value: '', label: 'Select…' }, ...[...OWNER_ROLES, ...NON_OWNER_ROLES].map((r) => ({ value: r, label: r }))]} />
      <Input label="Years the company has operated" required inputMode="numeric" maxLength={2} value={f.years} onChange={(e) => { setF({ ...f, years: e.target.value.replace(/\D/g, '') }); setFails(null) }} hint={`${MIN_YEARS}+ years — Business accounts are for long-term businesses`} />
      <div><p className="mb-2 text-[13px] font-semibold text-ink-700">Is the company a registered entity?</p><Segmented value={f.registered} onChange={(v) => { setF({ ...f, registered: v }); setFails(null) }} options={[{ id: 'yes', label: 'Yes, registered' }, { id: 'no', label: 'No' }]} /></div>
      <Checkbox checked={f.confirm} onChange={(v) => { setF({ ...f, confirm: v }); setFails(null) }}>I declare that I am the owner / authorised principal of this company and the details are true. VendorVerse may verify them.</Checkbox>
      {fails && fails.length > 0 && (
        <Banner tone="red" title="Not eligible yet">
          <ul className="list-disc space-y-0.5 pl-4">{fails.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="mt-2">Individual service providers and managers should register as a vendor instead.</p>
          <Button size="sm" variant="secondary" className="mt-2" onClick={vendorInstead}>Register as a vendor instead</Button>
        </Banner>
      )}
    </Screen>
  )
}

/* ---------- company-level wizard ---------- */
const EMPTY = {
  legal: '', brand: '', entity: 'Private Limited', regNo: '', year: '2015', gstin: '', pan: '', website: '',
  hq: { country: 'IN', state: 'Rajasthan', city: 'Jaipur', pin: '', addr: '' },
  industry: 'i_whole', kind: 'manufacturer', products: '', hs: '',
  facilities: [{ name: '', city: '', type: 'Manufacturing plant', area: '' }],
  employees: '51–200', turnover: '₹5–25 crore', capacity: '', capUnit: 'units / month', shifts: '1', moq: '', lead: '', markets: ['IN'], incoterms: ['EXW'],
  certs: [], docs: {}, signatory: { name: '', desig: '', id: '' }, contacts: '', bank: { holder: '', acc: '', ifsc: '' }, clients: '',
}

export function CompanyForm() {
  const nav = useNav()
  const { me, companies, saveCompany, notify, toast, addAudit } = useApp()
  const id = me.bizId || 'biz-me'
  const ex = companies[id]
  const elig = ex?.eligibility
  useEffect(() => { if (!elig) nav.replace('b_eligibility') }, [])
  const [step, setStep] = useState(0)
  const [f, setF] = useState({ ...EMPTY, signatory: { name: me.name || '', desig: elig?.designation || '', id: '' }, ...(ex && ex.status !== 'not_started' ? ex : {}) })
  const [consent, setConsent] = useState(false)
  const [errs, setErrs] = useState({})
  const [certSel, setCertSel] = useState((f.certs || []).map((c) => c.name))
  const pk = packOf(f.hq.country)
  const set = (k) => (e) => { setF({ ...f, [k]: e?.target ? e.target.value : e }); setErrs({ ...errs, [k]: '' }) }
  const nest = (g, k) => (e) => { setF({ ...f, [g]: { ...f[g], [k]: e?.target ? e.target.value : e } }); setErrs({ ...errs, [g + k]: '' }) }
  if (!elig) return null
  const country0 = GEO.find((g) => g.code === f.hq.country) || GEO[0]
  const states = country0.states
  const st = states.find((s) => s.name === f.hq.state) || states[0]
  const onPin = (v) => {
    const x = v.toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 8)
    const d = lookupPin(x)
    setF({ ...f, hq: { ...f.hq, pin: x, ...(d && !d.unknown ? { country: d.country, state: d.state, city: d.city } : {}) } })
  }
  const types = Object.entries(VENDOR_TYPES)
  const docNeeds = f.kind === 'service' ? COMPANY_DOCS.slice(0, 3) : COMPANY_DOCS
  const validate = () => {
    const e = {}
    if (step === 0) {
      if (f.legal.trim().length < 3) e.legal = 'Enter the registered legal name'
      if (f.regNo.trim().length < 4) e.regNo = 'Enter the company / registration number'
      if (f.hq.country === 'IN') {
        if (!/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(f.gstin.toUpperCase())) e.gstin = 'Enter a valid 15-character GSTIN'
        if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(f.pan.toUpperCase())) e.pan = 'Enter a valid PAN'
      } else if (f.gstin.trim().length < 4) e.gstin = `Enter your ${pk.taxId}`
      if (!f.hq.addr.trim()) e.hqaddr = 'Enter the registered address'
      if (!f.hq.pin.trim()) e.hqpin = 'Enter a postal code'
    }
    if (step === 1) { if (f.products.trim().length < 5) e.products = 'Describe what the company makes or supplies' }
    if (step === 2) {
      if (f.facilities.some((x) => !x.name.trim() || !x.city.trim())) e.facilities = 'Each facility needs a name and a city'
      if (!f.capacity.trim()) e.capacity = 'Enter monthly capacity'
      if (!f.markets.length) e.markets = 'Choose at least one market you serve'
    }
    if (step === 3) { const miss = docNeeds.filter((d) => !f.docs[d]); if (miss.length) e.docs = `${miss.length} required document${miss.length > 1 ? 's' : ''} missing` }
    if (step === 4) {
      if (!f.signatory.name.trim() || !OWNER_ROLES.includes(f.signatory.desig)) e.signatory = 'The signatory must be the owner, founder, director or managing partner'
      if (!f.bank.holder.trim() || !/\d{4}/.test(f.bank.acc) || f.bank.ifsc.trim().length < 6) e.bank = 'Add the account holder, account number and IFSC / SWIFT'
    }
    if (step === 5 && !consent) e.consent = 'Please confirm to submit'
    setErrs(e)
    return Object.keys(e).length === 0
  }
  const next = () => {
    if (!validate()) return toast('Please fix the highlighted fields', 'warn')
    if (step < 5) return setStep(step + 1)
    saveCompany(id, { ...f, id, certs: certSel.map((n) => f.certs.find((c) => c.name === n) || { name: n, expires: '31 Dec 2028' }), status: 'submitted', submittedAt: '26 Oct 2026', decision: '' })
    notify('admin', 'Company awaiting verification', `${f.legal} submitted a company profile.`, 'onboarding', ['ad_company', {}])
    addAudit('Company profile submitted', f.legal, 'onboarding', 'Company submission', me.name)
    toast('Company submitted for verification')
    nav.reset('b_company')
  }
  const ind = INDUSTRIES.find((i) => i.id === f.industry)
  const setFac = (i, k, v) => setF({ ...f, facilities: f.facilities.map((x, j) => (j === i ? { ...x, [k]: v } : x)) })
  return (
    <Screen title="Company profile" subtitle={`Step ${step + 1} of 6 · ${COMPANY_STEPS[step]}`} back={step === 0} footer={<div className="flex gap-2">{step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}<Button className="flex-1" size="lg" onClick={next}>{step === 5 ? 'Submit for verification' : 'Continue'}</Button></div>}>
      <Stepper steps={COMPANY_STEPS} current={step} />

      {step === 0 && (
        <div className="space-y-4">
          <Banner tone="blue">One company-level form for the registered entity. Opened by the owner; it is independent of any vendor account.</Banner>
          <Input label="Registered legal name" required value={f.legal} onChange={set('legal')} error={errs.legal} />
          <Input label="Trade / brand name" value={f.brand} onChange={set('brand')} />
          <Select label="Entity type" value={f.entity} onChange={set('entity')} options={ENTITY_TYPES} />
          <Input label="Company registration no. (CIN / LLPIN / reg. no.)" required value={f.regNo} onChange={set('regNo')} error={errs.regNo} />
          <Select label="Year of incorporation" value={f.year} onChange={set('year')} options={Array.from({ length: 54 }, (_, i) => String(YEAR_MAX - i))} />
          <Input label={f.hq.country === 'IN' ? 'GSTIN' : pk.taxId} required maxLength={f.hq.country === 'IN' ? 15 : 30} value={f.gstin} onChange={(e) => set('gstin')(e.target.value.toUpperCase())} error={errs.gstin} />
          {f.hq.country === 'IN' && <Input label="Company PAN" required maxLength={10} value={f.pan} onChange={(e) => set('pan')(e.target.value.toUpperCase())} error={errs.pan} />}
          <Input label="Website" placeholder="www.example.com" value={f.website} onChange={set('website')} />
          <Card className="space-y-3">
            <p className="flex items-center gap-2 text-sm font-extrabold"><MapPin size={15} />Registered address</p>
            <Input label="Postal code / pincode" required value={f.hq.pin} onChange={(e) => onPin(e.target.value)} error={errs.hqpin} hint="State and city fill in automatically" />
            <Select label="Country" value={f.hq.country} onChange={(e) => { const c = GEO.find((g) => g.code === e.target.value); setF({ ...f, hq: { ...f.hq, country: c.code, state: c.states[0].name, city: c.states[0].cities[0].n } }) }} options={GEO.map((g) => ({ value: g.code, label: `${g.flag} ${g.name}` }))} />
            <Select label="State / region" value={st.name} onChange={(e) => { const s = states.find((x) => x.name === e.target.value); setF({ ...f, hq: { ...f.hq, state: s.name, city: s.cities[0].n } }) }} options={states.map((s) => s.name)} />
            <Select label="City" value={f.hq.city} onChange={nest('hq', 'city')} options={st.cities.map((c) => c.n)} />
            <Input label="Street address" required value={f.hq.addr} onChange={nest('hq', 'addr')} error={errs.hqaddr} />
          </Card>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div><p className="mb-2 text-[13px] font-semibold text-ink-700">Company kind</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{types.map(([k, t]) => <button key={k} onClick={() => set('kind')(k)} className={cx('rounded-2xl p-3 text-left ring-1 ring-inset', f.kind === k ? 'bg-brand-50 ring-2 ring-brand-600' : 'bg-white ring-ink-200')}><p className="text-sm font-bold">{t.label}</p><p className="text-[11.5px] text-ink-500">{t.hint}</p></button>)}</div></div>
          <Select label="Industry" value={f.industry} onChange={set('industry')} options={INDUSTRIES.map((i) => ({ value: i.id, label: i.name }))} />
          {ind && <div><p className="mb-2 text-[13px] font-semibold text-ink-700">Categories in {ind.name}</p><Chips scroll={false} multi value={f.cats || []} onChange={set('cats')} options={ind.subs} /></div>}
          <Input label="Products / services" required textarea rows={3} value={f.products} onChange={set('products')} error={errs.products} hint="What does the company make, supply or build?" />
          {f.kind !== 'service' && <Input label="HS code(s)" placeholder="e.g. 8544" value={f.hs} onChange={set('hs')} hint="Used for cross-border RFQs" />}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Card className="space-y-3">
            <div className="flex items-center justify-between"><p className="text-sm font-extrabold">Plants, warehouses & offices</p><Button size="sm" icon={Plus} variant="secondary" onClick={() => setF({ ...f, facilities: [...f.facilities, { name: '', city: '', type: 'Warehouse', area: '' }] })}>Add</Button></div>
            {f.facilities.map((x, i) => (
              <div key={i} className="space-y-2.5 rounded-xl bg-ink-50 p-3">
                <Input label="Name" value={x.name} onChange={(e) => setFac(i, 'name', e.target.value)} />
                <div className="grid grid-cols-1 gap-2.5 min-[400px]:grid-cols-2"><Input label="City" value={x.city} onChange={(e) => setFac(i, 'city', e.target.value)} /><Input label="Area" placeholder="sq ft" value={x.area} onChange={(e) => setFac(i, 'area', e.target.value)} /></div>
                <Select label="Type" value={x.type} onChange={(e) => setFac(i, 'type', e.target.value)} options={FACILITY_TYPES} />
                {f.facilities.length > 1 && <button className="flex items-center gap-1 text-xs font-bold text-red-600" onClick={() => setF({ ...f, facilities: f.facilities.filter((_, j) => j !== i) })}><Trash2 size={13} />Remove</button>}
              </div>
            ))}
            {errs.facilities && <p className="text-xs font-medium text-red-600">{errs.facilities}</p>}
          </Card>
          <Select label="Employees" value={f.employees} onChange={set('employees')} options={EMP_BANDS} />
          <Select label="Annual turnover" value={f.turnover} onChange={set('turnover')} options={TURNOVER_BANDS} />
          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2"><Input label="Monthly capacity" required inputMode="numeric" value={f.capacity} onChange={(e) => set('capacity')(e.target.value.replace(/[^\d,]/g, ''))} error={errs.capacity} /><Input label="Unit" value={f.capUnit} onChange={set('capUnit')} /></div>
          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-3"><Select label="Shifts" value={f.shifts} onChange={set('shifts')} options={['1', '2', '3']} /><Input label="MOQ" value={f.moq} onChange={set('moq')} /><Input label="Lead time" value={f.lead} onChange={set('lead')} /></div>
          <div><p className="mb-2 text-[13px] font-semibold text-ink-700">Markets served</p><Chips scroll={false} multi value={f.markets} onChange={set('markets')} options={GEO.slice(0, 14).map((g) => ({ id: g.code, label: `${g.flag} ${g.name}` }))} />{errs.markets && <p className="mt-1.5 text-xs font-medium text-red-600">{errs.markets}</p>}</div>
          <div><p className="mb-2 text-[13px] font-semibold text-ink-700">Incoterms offered</p><Chips scroll={false} multi value={f.incoterms} onChange={set('incoterms')} options={INCOTERMS} /></div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div><p className="mb-2 text-[13px] font-semibold text-ink-700">Certifications</p><Chips scroll={false} multi value={certSel} onChange={setCertSel} options={CERT_OPTIONS} /></div>
          <Banner tone="blue">Evidence for {country(f.hq.country).name}: {(COUNTRY_PACKS[f.hq.country]?.docs[f.kind === 'service' ? 'service' : 'manufacturer'] || ['Business registration']).join(' · ')}</Banner>
          <div className="space-y-2.5">{docNeeds.map((d) => <DocTile key={d} name={d} status={f.docs[d] ? 'pending' : 'missing'} onAction={() => setF({ ...f, docs: { ...f.docs, [d]: !f.docs[d] } })} actionLabel={f.docs[d] ? 'Remove' : 'Upload'} note={f.docs[d] ? 'Uploaded · scanned' : 'Required'} />)}</div>
          {errs.docs && <p className="text-xs font-medium text-red-600">{errs.docs}</p>}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <Card className="space-y-3"><p className="text-sm font-extrabold">Owner / authorised signatory</p>
            <Input label="Full name" value={f.signatory.name} onChange={nest('signatory', 'name')} />
            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2"><Select label="Role" value={f.signatory.desig} onChange={nest('signatory', 'desig')} options={[{ value: '', label: 'Select…' }, ...OWNER_ROLES]} /><Input label="DIN / ID no." value={f.signatory.id} onChange={nest('signatory', 'id')} /></div>
            {errs.signatory && <p className="text-xs font-medium text-red-600">{errs.signatory}</p>}
          </Card>
          <Input label="Key contacts" textarea rows={2} value={f.contacts} onChange={set('contacts')} hint="Hidden from customers by default" />
          <Card className="space-y-3"><p className="text-sm font-extrabold">Company bank account</p>
            <Input label="Account holder" value={f.bank.holder} onChange={nest('bank', 'holder')} />
            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2"><Input label="Account no." inputMode="numeric" value={f.bank.acc} onChange={nest('bank', 'acc')} /><Input label="IFSC / SWIFT" value={f.bank.ifsc} onChange={(e) => nest('bank', 'ifsc')(e.target.value.toUpperCase())} /></div>
            {errs.bank && <p className="text-xs font-medium text-red-600">{errs.bank}</p>}
            <p className="text-xs text-ink-500">Used for verification only in the MVP — payouts are Phase 2.</p>
          </Card>
          <Input label="Key clients / references" textarea rows={2} value={f.clients} onChange={set('clients')} />
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <Card><KV rows={[['Company', f.legal], ['Entity', `${f.entity} · est. ${f.year}`], ['Registration', f.regNo], ['Industry', ind?.name], ['Kind', KIND_LABEL[f.kind]], ['Facilities', `${f.facilities.length}`], ['Capacity', `${f.capacity} ${f.capUnit}`], ['Markets', f.markets.map((m) => country(m).flag).join(' ')], ['Certifications', certSel.join(', ') || '—'], ['Documents', `${Object.values(f.docs).filter(Boolean).length} / ${docNeeds.length}`]]} /></Card>
          <Banner tone="amber" title="What happens next">A reviewer checks the registration, tax ID and evidence. Your company appears in the vendor Business network only after approval.</Banner>
          <div><Checkbox checked={consent} onChange={(v) => { setConsent(v); setErrs({}) }}>I confirm the company details are accurate and consent to VendorVerse verifying them.</Checkbox>{errs.consent && <p className="mt-1.5 text-xs font-medium text-red-600">{errs.consent}</p>}</div>
        </div>
      )}
    </Screen>
  )
}

/* ---------- workspace ---------- */
export function BizHome() {
  const nav = useNav()
  const { me, threads } = useApp()
  const { company } = useCompany()
  const pct = companyDone(company)
  const inbox = threads.business.filter((t) => t.bizId === me.bizId)
  const unread = inbox.reduce((n, t) => n + t.unread, 0)
  const live = company.status === 'approved'
  const start = () => nav.go(company.eligibility ? 'b_register' : 'b_eligibility')
  return (
    <Screen headerless pad={false}>
      <div className="flex items-center gap-3 border-b border-ink-100 bg-white px-4 pb-3 pt-3">
        <Logo size={40} />
        <div className="min-w-0"><p className="text-[17px] font-extrabold leading-tight text-ink-900">Business</p><p className="truncate text-xs text-ink-500">{company.brand || company.legal || me.biz || me.name}</p></div>
      </div>
      <div className="space-y-4 p-4">
        <Card className="space-y-3">
          <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-brand-600 text-white"><Building2 size={24} /></span><div className="min-w-0 flex-1"><p className="truncate text-base font-extrabold">{company.legal || me.biz || 'Your company'}</p><p className="text-xs text-ink-500">{company.entity ? `${company.entity} · est. ${company.year}` : 'Company profile not set up'}</p></div><SBadge s={company.status} /></div>
          <div><div className="flex justify-between text-xs font-semibold text-ink-600"><span>Profile completeness</span><span>{pct}%</span></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100"><div className="h-full rounded-full bg-brand-600" style={{ width: `${pct}%` }} /></div></div>
          {company.status === 'not_started' && <Button full onClick={start}>{company.eligibility ? 'Set up company profile' : 'Confirm eligibility to start'}</Button>}
          {company.status === 'rejected' && <Banner tone="red" title="Rejected">{company.decision}</Banner>}
          {company.status === 'more_info' && <Banner tone="amber" title="More information needed" action={<Button size="sm" onClick={() => nav.go('b_register')}>Update</Button>}>{company.decision}</Banner>}
        </Card>
        <div className="grid grid-cols-3 gap-2">{[['Vendor chats', inbox.length, 'messages'], ['Unread', unread, 'messages'], ['Services', company.serves?.length || 0, 'b_services']].map(([k, n, id]) => <Card key={k} onClick={() => nav.go(id)} className="!p-3 text-center"><p className="text-xl font-extrabold">{n}</p><p className="text-[11px] text-ink-500">{k}</p></Card>)}</div>
        <Card className="space-y-1">
          <ListRow icon={Building2} title="Company profile" subtitle="Identity, plants, capacity, certifications" onClick={() => nav.go('b_company')} />
          <ListRow icon={Briefcase} tone="violet" title="Services for vendors" subtitle="What vendors can approach you for" onClick={() => nav.go('b_services')} />
          <ListRow icon={Package} tone="emerald" title="Customer orders" subtitle="Orders customers place for your products" onClick={() => nav.go('b_orders')} />
          <ListRow icon={MessageCircle} tone="amber" title="Vendor messages" subtitle="Vendors reach you here, by message only" onClick={() => nav.go('messages')} />
          <ListRow icon={Users} tone="slate" title="Team & roles" onClick={() => nav.go('team')} last />
        </Card>
        {live
          ? <Banner tone="green" title="Live in the Business network">Verified vendors can see your company profile and message you. Customers can find your company and order your products.</Banner>
          : <Banner tone="blue" title="Not visible to vendors yet">Your company appears in the vendor Business network and the customer Companies list after verification.</Banner>}
      </div>
    </Screen>
  )
}

export function CompanyView({ vendorId }) {
  const nav = useNav()
  const { companies } = useApp()
  const own = useCompany()
  const company = vendorId ? companies[vendorId] : own.company
  if (!company || company.status === 'not_started') {
    return <Screen title="Company profile" back={false}><EmptyState icon={Building2} title="No company profile yet" body="Add the registered company: legal details, plants, capacity, certifications and compliance documents." action={<Button size="sm" onClick={() => nav.go(company?.eligibility ? 'b_register' : 'b_eligibility')}>Start the company form</Button>} /></Screen>
  }
  const ind = INDUSTRIES.find((i) => i.id === company.industry)
  const steps = [
    { label: 'Submitted', at: company.submittedAt, done: true },
    { label: 'Review of registration, tax ID and evidence', done: ['approved', 'rejected'].includes(company.status), current: ['submitted', 'more_info'].includes(company.status) },
    { label: company.status === 'rejected' ? 'Rejected' : 'Approved — company badge live', note: company.decision, done: company.status === 'approved', current: false },
  ]
  return (
    <Screen title="Company profile" subtitle={company.brand || company.legal} back={false} right={<Button size="sm" variant="ghost" icon={Pencil} className="mr-1" onClick={() => nav.go('b_register')}>Edit</Button>}>
      <Card className="flex items-center justify-between"><p className="text-sm font-extrabold">Verification</p><SBadge s={company.status} /></Card>
      <Card><Timeline steps={steps} /></Card>
      <Card className="space-y-2"><p className="text-sm font-extrabold">Identity</p><KV rows={[['Legal name', company.legal], ['Entity', `${company.entity} · est. ${company.year}`], ['Registration no.', company.regNo], ['Tax ID', company.gstin], ['PAN', company.pan || '—'], ['Website', company.website || '—'], ['Registered address', `${company.hq.addr}, ${company.hq.city} ${company.hq.pin}`]]} /></Card>
      <Card className="space-y-2"><p className="text-sm font-extrabold">Industry</p><KV rows={[['Industry', ind?.name], ['Kind', KIND_LABEL[company.kind]], ['Products', company.products], ['HS code', company.hs || '—']]} /></Card>
      <Card className="space-y-2"><p className="text-sm font-extrabold">Operations</p><KV rows={[['Employees', company.employees], ['Turnover', company.turnover], ['Capacity', `${company.capacity} ${company.capUnit}`], ['MOQ · lead time', `${company.moq || '—'} · ${company.lead || '—'}`], ['Markets', company.markets.map((m) => `${country(m).flag} ${country(m).name}`).join(', ')], ['Incoterms', company.incoterms.join(', ')]]} />
        <div className="space-y-1.5 pt-1">{company.facilities.map((x) => <p key={x.name} className="flex items-center gap-2 text-[13px]"><Factory size={14} className="shrink-0 text-ink-400" /><span className="min-w-0"><b>{x.name}</b> · {x.type} · {x.city}{x.area ? ` · ${x.area}` : ''}</span></p>)}</div></Card>
      <Card className="space-y-2"><p className="text-sm font-extrabold">Certifications</p><div className="flex flex-wrap gap-1.5">{company.certs.length ? company.certs.map((c) => <Pill key={c.name} icon={Award}>{c.name}{c.expires ? ` · ${c.expires}` : ''}</Pill>) : <span className="text-xs text-ink-500">None added</span>}</div></Card>
      <Card className="space-y-2"><p className="text-sm font-extrabold">People & finance</p><KV rows={[['Signatory', `${company.signatory.name} · ${company.signatory.desig}`], ['Bank', `${company.bank.holder} · ${company.bank.acc}`], ['Key clients', company.clients || '—']]} /></Card>
    </Screen>
  )
}

export function BizServices() {
  const nav = useNav()
  const { me, saveCompany, toast } = useApp()
  const { id, company } = useCompany()
  const [sel, setSel] = useState(company.serves || [])
  const [note, setNote] = useState(company.servesNote || '')
  const [err, setErr] = useState('')
  const save = () => {
    if (!sel.length) return setErr('Choose at least one service for vendors')
    saveCompany(id, { serves: sel, servesNote: note.trim() })
    toast(company.status === 'approved' ? 'Services updated for vendors' : 'Saved — vendors see this after verification')
    nav.back()
  }
  return (
    <Screen title="Services for vendors" subtitle={company.brand || company.legal || me.biz} footer={<Button full size="lg" onClick={save}>Save services</Button>}>
      <Banner tone="blue">Vendors provide services to customers. Use this list to tell them what your company can offer <i>them</i> — supplies, job work, logistics and more.</Banner>
      <div><p className="mb-2 text-[13px] font-semibold text-ink-700">What vendors can approach you for</p><Chips scroll={false} multi value={sel} onChange={(v) => { setSel(v); setErr('') }} options={BIZ_SERVICES} />{err && <p className="mt-1.5 text-xs font-medium text-red-600">{err}</p>}</div>
      <Input label="Details for vendors" textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} hint="Shown on your Business network profile" />
    </Screen>
  )
}

export function BizMore() {
  const nav = useNav()
  const { me, setMe } = useApp()
  return (
    <Screen title="More" back={false} right={<LangButton />}>
      <Card className="space-y-1">
        <ListRow icon={Building2} title="Company profile & verification" onClick={() => nav.go('b_company')} />
        <ListRow icon={Briefcase} tone="violet" title="Services for vendors" onClick={() => nav.go('b_services')} />
        <ListRow icon={UserCheck} tone="emerald" title="Eligibility" subtitle="Owner of a registered company, 3+ years" onClick={() => nav.go('b_eligibility')} />
        <ListRow icon={Users} tone="slate" title="Team & roles" onClick={() => nav.go('team')} last />
      </Card>
      <Banner tone="blue" title="One account type">This Business account is separate from vendor and customer accounts. To use another account type, log out and sign in with that account.</Banner>
      <p className="px-1 text-xs text-ink-500">Signed in as {me.name}, owner of {me.biz || 'the company'}.</p>
      <Button full variant="dangerSoft" icon={LogOut} onClick={() => { setMe({ role: null, loggedIn: false, guest: false, vendorId: null, hasVendor: false, bizId: null, name: '' }); nav.reset('welcome') }}>Log out</Button>
    </Screen>
  )
}

/* ---------- vendor portal: Business network (verified companies; vendors connect by message only) ---------- */
export function BizNetwork() {
  const nav = useNav()
  const { companies, me } = useApp()
  const [q, setQ] = useState('')
  const [svc, setSvc] = useState('all')
  if (me.role !== 'vendor') return <Screen title="Business network"><EmptyState icon={Lock} title="For vendors" body="The Business network is part of the vendor portal." /></Screen>
  const all = Object.values(companies).filter((c) => c.status === 'approved')
  const list = all.filter((c) => (svc === 'all' || (c.serves || []).includes(svc)) && (!q || `${c.brand || c.legal} ${c.products} ${(c.serves || []).join(' ')}`.toLowerCase().includes(q.toLowerCase())))
  return (
    <Screen title="Business network" subtitle={`${all.length} verified companies`} pad={false}>
      <div className="space-y-3 bg-white px-4 pb-3 pt-3">
        <Banner tone="blue" title="Companies offering services to vendors">Supply, job work, logistics and more. You connect with a Business by message only.</Banner>
        <SearchBar value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search companies or services" />
        <Chips value={svc} onChange={setSvc} options={[{ id: 'all', label: 'All' }, ...BIZ_SERVICES.map((x) => ({ id: x, label: x }))]} />
      </div>
      <div className="space-y-2.5 p-4">
        {list.length === 0 && <EmptyState icon={Building2} title="No companies match" body="Try another service or clear the search." />}
        {list.map((c) => {
          const ind = INDUSTRIES.find((i) => i.id === c.industry)
          return (
            <Card key={c.id} onClick={() => nav.go('v_biz_profile', { id: c.id })} className="space-y-2">
              <div className="flex items-start gap-3"><Avatar name={c.brand || c.legal} size={44} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{c.brand || c.legal}</p><p className="text-xs text-ink-500">{ind?.name} · {c.hq.city} · {c.employees} staff</p></div><Badge tone="green"><CheckCircle2 size={11} />Verified</Badge></div>
              <div className="flex flex-wrap gap-1.5">{(c.serves || []).map((x) => <Pill key={x}>{x}</Pill>)}</div>
            </Card>
          )
        })}
      </div>
    </Screen>
  )
}

export function BizPublic({ params = {} }) {
  const { companies, me } = useApp()
  const chat = useBizChat()
  const c = companies[params.id || 'biz1']
  if (me.role !== 'vendor') return <Screen title="Company"><EmptyState icon={Lock} title="For vendors" body="Business profiles are visible to vendors only." /></Screen>
  if (!c || c.status !== 'approved') return <Screen title="Company"><EmptyState icon={Building2} title="Profile not available" body="This company is not verified yet." /></Screen>
  const ind = INDUSTRIES.find((i) => i.id === c.industry)
  return (
    <Screen title={c.brand || c.legal} subtitle={`${ind?.name} · ${c.hq.city}`} footer={<Button full size="lg" icon={MessageCircle} onClick={() => chat(c)}>Message company</Button>}>
      <Banner tone="blue" title="Message only">Vendors connect with Business accounts by message. There is no RFQ, call or booking here — agree next steps in the conversation.</Banner>
      <Card className="space-y-2.5">
        <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-extrabold"><Building2 size={15} />Verified company</p><Badge tone="green"><CheckCircle2 size={11} />Verified</Badge></div>
        <KV rows={[['Legal entity', c.legal], ['Established', c.year], ['Employees', c.employees], ['Capacity', `${c.capacity} ${c.capUnit}`], ['Facilities', `${c.facilities.length} · ${[...new Set(c.facilities.map((x) => x.city))].join(', ')}`], ['Markets', c.markets.map((m) => country(m).flag).join(' ')]]} />
        <div className="flex flex-wrap gap-1.5">{c.certs.map((x) => <Pill key={x.name} icon={Award}>{x.name}</Pill>)}</div>
        <p className="text-[11px] text-ink-500">Registration and certificates reviewed by VendorVerse on {c.submittedAt}.</p>
      </Card>
      <Card className="space-y-2"><p className="text-sm font-extrabold">Services for vendors</p><div className="flex flex-wrap gap-1.5">{(c.serves || []).map((x) => <Pill key={x}>{x}</Pill>)}</div>{c.servesNote && <p className="text-[13px] text-ink-600">{c.servesNote}</p>}</Card>
      <Card className="space-y-2"><p className="text-sm font-extrabold">What the company makes</p><p className="text-[13px] text-ink-600">{c.products}</p></Card>
    </Screen>
  )
}

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
