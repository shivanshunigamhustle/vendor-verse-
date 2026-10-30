import { useState } from 'react'
import { Globe, MapPin, ChevronDown, ChevronUp, Check, Plus, Layers, ThumbsUp, Rocket, TriangleAlert, Users, Store, BellRing } from 'lucide-react'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { CATS, cat, ME } from '../data.jsx'
import { INDUSTRIES, LAUNCH_CATS, LAUNCH_LABEL } from '../globaldata.jsx'
import {
  Screen, Card, Section, Button, Thumb, Chips, Segmented, Sheet, Input, Select, Toggle, Badge, Banner, EmptyState, KV, cx, Pill, StatusBadge, ReasonSheet, HBar, PhaseTag, Stat,
} from '../ui.jsx'

/* ================= GEO ROLLOUT MANAGER ================= */
const READY_MIN = 20                      // verified vendors needed before a city can go live
export function AdminGeo() {
  const { geo, setGeo, toast, addAudit, me, vendors } = useApp()
  const [open, setOpen] = useState('IN')
  const [sel, setSel] = useState({ cc: 'IN', city: 'Jaipur' })
  const [matrix, setMatrix] = useState({ 'IN-Jaipur': LAUNCH_CATS, 'IN-Ajmer': ['home', 'events'], 'IN-Sikar': ['home'], 'IN-Delhi NCR': ['home', 'constr', 'whole', 'prof'] })
  const [sheet, setSheet] = useState(null)
  const actor = me.name || ME.admin
  const setStatus = (cc, city, s, reason) => {
    setGeo(geo.map((c) => (c.code !== cc ? c : { ...c, launch: s === 'live' ? 'live' : c.launch, states: c.states.map((st) => ({ ...st, cities: st.cities.map((x) => (x.n === city ? { ...x, s, vendors: s === 'live' ? x.vendors || 12 : x.vendors } : x)) })) })))
    addAudit(`Set ${city} ${s}`, `${cc}-${city}`, 'config', reason, actor)
    toast(s === 'live' ? `${city} is live — waitlist of ${geo.find((c) => c.code === cc).states.flatMap((x) => x.cities).find((x) => x.n === city).wait || 0} notified` : `${city} set to ${s}`)
  }
  const cur = geo.find((c) => c.code === sel.cc)?.states.flatMap((s) => s.cities).find((c) => c.n === sel.city)
  const key = `${sel.cc}-${sel.city}`
  const on = matrix[key] || []
  const live = geo.flatMap((c) => c.states.flatMap((s) => s.cities)).filter((c) => c.s === 'live')
  const wait = geo.flatMap((c) => c.states.flatMap((s) => s.cities)).reduce((s, c) => s + (c.wait || 0), 0)
  return (
    <Screen
      title="Geo rollout" subtitle="Country · state · city launch control"
      overlay={sheet && <ReasonSheet open onClose={() => setSheet(null)} title={`Switch ${sheet.city} ${sheet.s === 'live' ? 'live' : sheet.s}`} intro={sheet.s === 'live' ? 'Customers will see vendors and can book. The waitlist is notified.' : undefined} reasons={sheet.s === 'live' ? ['Supply threshold met', 'Strategic launch', 'Pilot'] : ['Supply dropped', 'Compliance review', 'Rescheduled']} confirmLabel="Confirm" onConfirm={(r) => { setStatus(sheet.cc, sheet.city, sheet.s, r); setSheet(null) }} />}
    >
      <div className="grid grid-cols-3 gap-2"><Card className="!p-3 text-center"><p className="text-2xl font-extrabold">{live.length}</p><p className="text-[11px] text-ink-500">Live cities</p></Card><Card className="!p-3 text-center"><p className="text-2xl font-extrabold">{geo.length}</p><p className="text-[11px] text-ink-500">Countries</p></Card><Card className="!p-3 text-center"><p className="text-2xl font-extrabold">{wait.toLocaleString('en-IN')}</p><p className="text-[11px] text-ink-500">On waitlists</p></Card></div>
      <Banner tone="blue" title="Launch by readiness, not by calendar">A city can go live once it has {READY_MIN}+ verified vendors in the priority categories. Everything else stays on a waitlist so demand is captured from day one.</Banner>
      <div className="space-y-2.5">
        {geo.map((c) => (
          <Card key={c.code} pad={false} className="overflow-hidden">
            <button onClick={() => setOpen(open === c.code ? null : c.code)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left"><span className="text-2xl">{c.flag}</span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold">{c.name}</span><span className="block text-xs text-ink-500">{c.cur} · {c.states.flatMap((s) => s.cities).length} cities</span></span><StatusBadge s={c.launch === 'live' ? 'live' : c.launch} />{open === c.code ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />}</button>
            {open === c.code && (
              <div className="divide-y divide-ink-100 border-t border-ink-100">
                {c.states.flatMap((s) => s.cities.map((x) => ({ ...x, st: s.name }))).map((x) => (
                  <div key={x.n} onClick={() => setSel({ cc: c.code, city: x.n })} className={cx('px-4 py-3', sel.cc === c.code && sel.city === x.n && 'bg-brand-50/60')}>
                    <div className="flex items-center justify-between"><div><p className="text-sm font-bold">{x.n}</p><p className="text-xs text-ink-500">{x.st} · {x.s === 'live' ? `${x.vendors} verified vendors` : `${x.wait} waiting`}</p></div><StatusBadge s={x.s === 'live' ? 'live' : x.s} /></div>
                    <div className="mt-2 flex gap-2">{['live', 'soon', 'later'].filter((s) => s !== x.s).map((s) => <Button key={s} size="sm" variant={s === 'live' ? 'primary' : 'secondary'} icon={s === 'live' ? Rocket : undefined} onClick={(e) => { e.stopPropagation(); if (s === 'live' && (x.vendors || 0) < READY_MIN && !x.vendors) toast(`Only ${x.vendors || 0} verified vendors — below the ${READY_MIN} threshold. Confirm to override.`, 'warn'); setSheet({ cc: c.code, city: x.n, s }) }}>{s === 'live' ? 'Go live' : s === 'soon' ? 'Mark coming soon' : 'Mark planned'}</Button>)}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      {cur && (
        <Section title={`Category matrix · ${sel.city}`}>
          <Card className="space-y-1">
            {CATS.map((c) => <Toggle key={c.id} label={c.name} desc={LAUNCH_CATS.includes(c.id) ? 'Priority launch category' : 'Supply-building after launch'} on={on.includes(c.id)} onChange={(v) => { setMatrix({ ...matrix, [key]: v ? [...on, c.id] : on.filter((x) => x !== c.id) }); toast(`${c.name} ${v ? 'enabled' : 'disabled'} in ${sel.city}`) }} />)}
          </Card>
        </Section>
      )}
    </Screen>
  )
}

/* ================= TAXONOMY BUILDER ================= */
export function AdminTaxonomy({ params = {} }) {
  const { catRequests, patchCatRequest, customCats, setCustomCats, toast, addAudit, me } = useApp()
  const [tab, setTab] = useState(params.tab || 'tree')
  const [open, setOpen] = useState(null)
  const [add, setAdd] = useState('')
  const [newInd, setNewInd] = useState('')
  const [sheet, setSheet] = useState(null)
  const actor = me.name || ME.admin
  const all = [...customCats, ...INDUSTRIES]
  const pending = catRequests.filter((c) => c.status === 'pending')
  const decide = (c, kind, why) => {
    patchCatRequest(c.id, { status: kind === 'approve' ? 'approved' : 'rejected' })
    if (kind === 'approve') setCustomCats([{ id: 'cc' + c.id, name: c.name, icon: Layers, tone: 'teal', cats: 1, subs: [c.name, ...c.attrs.slice(0, 2)], phase: 'MVP', custom: true, parent: c.parent }, ...customCats])
    addAudit(kind === 'approve' ? 'Approved category' : 'Rejected category suggestion', c.name, 'config', why, actor)
    toast(kind === 'approve' ? `“${c.name}” is live in the taxonomy — no release needed` : 'Suggestion declined')
  }
  return (
    <Screen
      title="Taxonomy builder" subtitle="Industry → category → subcategory → attributes"
      overlay={sheet && <ReasonSheet open onClose={() => setSheet(null)} title={sheet.kind === 'approve' ? `Approve “${sheet.c.name}”` : 'Decline suggestion'} reasons={sheet.kind === 'approve' ? ['Clear demand', 'Distinct from existing categories', 'Strategic category'] : ['Duplicate of an existing category', 'Too narrow', 'Not a vendor category']} danger={sheet.kind !== 'approve'} confirmLabel={sheet.kind === 'approve' ? 'Approve & publish' : 'Decline'} onConfirm={(r) => { decide(sheet.c, sheet.kind, r); setSheet(null) }} extra={sheet.kind === 'approve' ? <Card className="!bg-ink-50 shadow-none"><KV rows={[['Industry', sheet.c.parent], ['Attributes', sheet.c.attrs.join(', ') || '—'], ['Requests', sheet.c.votes]]} /></Card> : null} />}
    >
      <div className="grid grid-cols-3 gap-2"><Card className="!p-3 text-center"><p className="text-2xl font-extrabold">{all.length}</p><p className="text-[11px] text-ink-500">Industries</p></Card><Card className="!p-3 text-center"><p className="text-2xl font-extrabold">{all.reduce((s, i) => s + i.cats, 0).toLocaleString('en-IN')}</p><p className="text-[11px] text-ink-500">Categories</p></Card><Card className="!p-3 text-center"><p className="text-2xl font-extrabold">{pending.length}</p><p className="text-[11px] text-ink-500">Suggestions</p></Card></div>
      <Segmented value={tab} onChange={setTab} options={[{ id: 'tree', label: 'Taxonomy' }, { id: 'requests', label: 'Suggestions', count: pending.length }]} />
      {tab === 'tree' && (
        <>
          <Card className="space-y-2"><p className="text-sm font-bold">Add an industry</p><div className="flex gap-2"><input value={newInd} onChange={(e) => setNewInd(e.target.value)} placeholder="e.g. Space & satellite services" className="h-11 flex-1 rounded-xl bg-white px-3.5 text-sm outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-brand-500" /><Button variant="soft" onClick={() => { if (newInd.trim()) { setCustomCats([{ id: 'cc' + Date.now(), name: newInd.trim(), icon: Layers, tone: 'indigo', cats: 0, subs: [], phase: 'P3', custom: true }, ...customCats]); addAudit('Added industry', newInd, 'config', 'Taxonomy builder', actor); setNewInd(''); toast('Industry added') } }}>Add</Button></div></Card>
          <div className="space-y-2.5">
            {all.map((i) => (
              <Card key={i.id} pad={false} className="overflow-hidden">
                <button onClick={() => setOpen(open === i.id ? null : i.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left"><Thumb tone={i.tone} icon={i.icon} size={38} round="rounded-lg" /><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{i.name}</span><span className="block text-xs text-ink-500">{i.cats} categories{i.custom ? ' · custom' : ''}</span></span><PhaseTag p={i.phase} />{open === i.id ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />}</button>
                {open === i.id && (
                  <div className="space-y-3 border-t border-ink-100 p-4">
                    <div className="flex flex-wrap gap-1.5">{i.subs.map((s) => <Pill key={s}>{s}</Pill>)}{!i.subs.length && <span className="text-xs italic text-ink-400">No subcategories yet</span>}</div>
                    {i.cat && <p className="text-xs text-ink-500">Configured workflow: {cat(i.cat).mode === 'both' ? 'Booking or RFQ' : cat(i.cat).mode === 'rfq' ? 'RFQ' : 'Booking'} · attributes: {cat(i.cat).fields.join(', ')}</p>}
                    <div className="flex gap-2"><input value={add} onChange={(e) => setAdd(e.target.value)} placeholder="Add subcategory" className="h-10 flex-1 rounded-xl bg-white px-3 text-sm outline-none ring-1 ring-inset ring-ink-200" /><Button size="sm" variant="soft" icon={Plus} onClick={() => { if (add.trim()) { i.subs.push(add.trim()); i.cats += 1; setAdd(''); toast('Subcategory added'); addAudit('Added subcategory', `${i.name} › ${add}`, 'config', 'Taxonomy builder', actor) } }}>Add</Button></div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
      {tab === 'requests' && (
        <div className="space-y-2.5">
          {catRequests.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between gap-2"><div><p className="text-sm font-bold">{c.name}</p><p className="text-xs text-ink-500">{c.parent} · {c.by}</p></div><StatusBadge s={c.status === 'pending' ? 'pending' : c.status === 'approved' ? 'approved' : 'rejected'} /></div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5"><Badge tone="blue"><ThumbsUp size={11} />{c.votes} requests</Badge>{c.attrs.map((a) => <Pill key={a}>{a}</Pill>)}</div>
              {c.status === 'pending' && <div className="mt-3 flex gap-2"><Button size="sm" variant="dangerSoft" className="flex-1" onClick={() => setSheet({ c, kind: 'reject' })}>Decline</Button><Button size="sm" className="flex-1" onClick={() => setSheet({ c, kind: 'approve' })}>Approve</Button></div>}
            </Card>
          ))}
        </div>
      )}
    </Screen>
  )
}
