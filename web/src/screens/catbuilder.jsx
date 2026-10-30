import { useState } from 'react'
import { Layers, Plus, Trash2, GitMerge, Power, Filter, Pencil } from 'lucide-react'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { CATS, cat, ME } from '../data.jsx'
import { FIELD_TYPES } from '../mvpdata.jsx'
import { Screen, Card, Button, Banner, Input, Select, Toggle, Sheet, Pill, Segmented, Chips, cx } from '../ui.jsx'

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24)

/* ---------- admin: create a category as pure configuration ---------- */
export function CatNew() {
  const nav = useNav()
  const { touchCats, addAudit, toast, me } = useApp()
  const [f, setF] = useState({ name: '', mode: 'both', type: 'service', subs: '', docs: 'Government photo ID', aliases: '' })
  const [err, setErr] = useState('')
  const create = () => {
    const name = f.name.trim()
    if (name.length < 3) return setErr('Category name needs at least 3 characters')
    if (CATS.some((c) => c.name.toLowerCase() === name.toLowerCase())) return setErr('A category with this name already exists')
    const id = slug(name) + '-' + (CATS.length + 1)
    const csv = (s) => s.split(',').map((x) => x.trim()).filter(Boolean)
    CATS.push({ id, name, hi: name, icon: Layers, tone: 'teal', type: f.type, subs: csv(f.subs).length ? csv(f.subs) : [name], mode: f.mode, avail: 'none', respHrs: 24, cancel: 'standard', verifyReq: true, docs: csv(f.docs), fields: [], rfq: [], schema: [], rfqSchema: [], ent: 'Listing + lead limits per plan', restricted: '', ver: 'v1', aliases: csv(f.aliases), active: true })
    touchCats()
    addAudit('Created category', name, 'config', 'Category created', me.name || ME.admin)
    toast(`${name} created — add fields next`)
    nav.replace('ad_category', { id })
  }
  return (
    <Screen title="New category" subtitle="Configuration only — no code change" footer={<Button full size="lg" onClick={create}>Create category</Button>}>
      <Banner tone="blue" title="Fields come next">After creating, define custom fields, filters, required documents and RFQ questions. The category then appears in search, onboarding and RFQs automatically.</Banner>
      <Input label="Category name" required value={f.name} onChange={(e) => { setF({ ...f, name: e.target.value }); setErr('') }} error={err} />
      <div><p className="mb-2 text-[13px] font-semibold text-ink-700">What is offered</p><Segmented value={f.type} onChange={(v) => setF({ ...f, type: v })} options={[{ id: 'service', label: 'Services' }, { id: 'product', label: 'Products' }]} /></div>
      <div><p className="mb-2 text-[13px] font-semibold text-ink-700">How customers proceed</p><Segmented value={f.mode} onChange={(v) => setF({ ...f, mode: v })} options={[{ id: 'booking', label: 'Booking' }, { id: 'rfq', label: 'RFQ' }, { id: 'both', label: 'Both' }]} /></div>
      <Input label="Sub-categories" value={f.subs} onChange={(e) => setF({ ...f, subs: e.target.value })} hint="Comma separated" />
      <Input label="Required documents" value={f.docs} onChange={(e) => setF({ ...f, docs: e.target.value })} hint="Comma separated" />
      <Input label="Search aliases" value={f.aliases} onChange={(e) => setF({ ...f, aliases: e.target.value })} />
    </Screen>
  )
}

/* ---------- admin: field builder, activation and merge (rendered inside AdminCategory) ---------- */
export function CategoryAdminPanel({ id }) {
  const nav = useNav()
  const { touchCats, listings, setListings, vendors, rfqs, addAudit, toast, me, catsVer } = useApp()
  const c = cat(id)
  const [sheet, setSheet] = useState(null)
  const [nm, setNm] = useState('')
  const [subSel, setSubSel] = useState('')
  const [moveTo, setMoveTo] = useState('')
  const [fd, setFd] = useState({ k: '', type: 'text', req: false, filter: false, options: '', unit: '' })
  const [target, setTarget] = useState('')
  const list = c.schema || []
  const used = listings.filter((l) => l.cat === id).length
  const bump = (msg) => { touchCats(); addAudit(msg, c.name, 'config', 'Category field change', me.name || ME.admin) }
  const addField = () => {
    if (!fd.k.trim()) return toast('Give the field a label', 'warn')
    if (list.some((x) => x.k.toLowerCase() === fd.k.trim().toLowerCase())) return toast('A field with this label exists', 'warn')
    const opts = fd.options.split(',').map((x) => x.trim()).filter(Boolean)
    if (['select', 'multi'].includes(fd.type) && opts.length < 2) return toast('Choice fields need at least two options', 'warn')
    c.schema = [...list, { k: fd.k.trim(), type: fd.type, req: fd.req, filter: fd.filter, ...(opts.length ? { options: opts } : {}), ...(fd.unit ? { unit: fd.unit } : {}) }]
    c.fields = c.schema.map((x) => x.k)
    bump(`Added field “${fd.k.trim()}”`)
    setFd({ k: '', type: 'text', req: false, filter: false, options: '', unit: '' }); setSheet(null); toast('Field added — vendors, search and RFQs use it from now')
  }
  const patchField = (k, ch) => { c.schema = list.map((x) => (x.k === k ? { ...x, ...ch } : x)); bump(`Edited field “${k}”`) }
  const del = (k) => { c.schema = list.filter((x) => x.k !== k); c.fields = c.schema.map((x) => x.k); bump(`Removed field “${k}”`) }
  const subs = c.subs || []
  const subUsed = (s) => listings.filter((l) => l.cat === id && l.sub === s).length
  const dupSub = (s) => subs.some((x) => x.toLowerCase() === s.toLowerCase())
  const addSub = () => {
    const s = nm.trim()
    if (s.length < 2) return toast('Sub-category name is too short', 'warn')
    if (dupSub(s)) return toast('This sub-category already exists', 'warn')
    c.subs = [...subs, s]
    bump(`Added sub-category “${s}”`); setSheet(null); toast('Sub-category added')
  }
  const renameSub = () => {
    const s = nm.trim()
    if (s.length < 2) return toast('Sub-category name is too short', 'warn')
    if (s.toLowerCase() !== subSel.toLowerCase() && dupSub(s)) return toast('This sub-category already exists', 'warn')
    c.subs = subs.map((x) => (x === subSel ? s : x))
    setListings((ls) => ls.map((l) => (l.cat === id && l.sub === subSel ? { ...l, sub: s } : l)))
    bump(`Renamed sub-category “${subSel}” to “${s}”`); setSheet(null); toast('Sub-category renamed')
  }
  const removeSub = () => {
    setListings((ls) => ls.map((l) => (l.cat === id && l.sub === subSel ? { ...l, sub: moveTo } : l)))
    c.subs = subs.filter((x) => x !== subSel)
    bump(`Removed sub-category “${subSel}”`); setSheet(null); toast(subUsed(subSel) ? `${subUsed(subSel)} listing(s) moved to ${moveTo}` : 'Sub-category removed')
  }
  const renameCat = () => {
    const s = nm.trim()
    if (s.length < 3) return toast('Category name needs at least 3 characters', 'warn')
    if (CATS.some((x) => x.id !== id && x.name.toLowerCase() === s.toLowerCase())) return toast('A category with this name already exists', 'warn')
    const old = c.name
    c.name = s; c.hi = s
    bump(`Renamed category “${old}” to “${s}”`); setSheet(null); toast('Category renamed')
  }
  const blockers = used + vendors.filter((v) => v.cat === id).length + rfqs.filter((r) => r.cat === id).length
  const removeCat = () => {
    CATS.splice(CATS.findIndex((x) => x.id === id), 1)
    touchCats(); addAudit('Deleted category', c.name, 'config', 'Category removed', me.name || ME.admin)
    setSheet(null); toast(`${c.name} deleted`); nav.back()
  }
  const setActive = (on) => { c.active = on; bump(on ? 'Reactivated category' : 'Deactivated category'); toast(on ? 'Category is live again' : `Deactivated — ${used} listing(s) are hidden from search until moved`, on ? undefined : 'warn') }
  const merge = () => {
    const t = cat(target)
    setListings((ls) => ls.map((l) => (l.cat === id ? { ...l, cat: target, sub: t.subs[0] } : l)))
    c.active = false
    bump(`Merged into ${t.name}`)
    setSheet(null); toast(`${used} listing(s) moved to ${t.name}`)
    nav.back()
  }
  return (
    <>
      <Card className="space-y-3" data-v={catsVer}>
        <div className="flex items-center justify-between"><p className="text-sm font-extrabold">Custom fields <span className="font-medium text-ink-400">· {list.length}</span></p><Button size="sm" icon={Plus} onClick={() => setSheet('field')}>Add field</Button></div>
        {list.length === 0 && <p className="text-xs text-ink-500">No custom fields yet. Add the attributes vendors fill in and customers filter by.</p>}
        {list.map((x) => (
          <div key={x.k} className="rounded-xl bg-ink-50 p-3">
            <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-[13px] font-bold">{x.k}</p><p className="text-[11px] text-ink-500">{FIELD_TYPES.find((t) => t[0] === x.type)?.[1]}{x.unit ? ` · ${x.unit}` : ''}{x.options ? ` · ${x.options.join(' / ')}` : ''}</p></div><button aria-label={`Remove ${x.k}`} onClick={() => del(x.k)} className="text-ink-400"><Trash2 size={16} /></button></div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button onClick={() => patchField(x.k, { req: !x.req })} className={cx('rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1', x.req ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink-600 ring-ink-200')}>Required</button>
              <button onClick={() => patchField(x.k, { filter: !x.filter })} className={cx('rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1', x.filter ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink-600 ring-ink-200')}><Filter size={10} className="mr-1 inline" />Filterable</button>
            </div>
          </div>
        ))}
      </Card>
      <Card className="space-y-3" data-v={catsVer}>
        <div className="flex items-center justify-between"><p className="text-sm font-extrabold">Sub-categories <span className="font-medium text-ink-400">· {subs.length}</span></p><Button size="sm" icon={Plus} onClick={() => { setNm(''); setSheet('subadd') }}>Add</Button></div>
        {subs.map((s) => (
          <div key={s} className="flex items-center gap-2 rounded-xl bg-ink-50 px-3 py-2.5">
            <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-bold">{s}</p><p className="text-[11px] text-ink-500">{subUsed(s)} listing(s)</p></div>
            <button aria-label={`Rename ${s}`} onClick={() => { setSubSel(s); setNm(s); setSheet('subedit') }} className="text-ink-400"><Pencil size={16} /></button>
            <button aria-label={`Remove ${s}`} disabled={subs.length < 2} onClick={() => { setSubSel(s); setMoveTo(subs.find((x) => x !== s) || ''); setSheet('subdel') }} className="text-ink-400 disabled:opacity-30"><Trash2 size={16} /></button>
          </div>
        ))}
        {subs.length < 2 && <p className="text-xs text-ink-500">A category keeps at least one sub-category. Add another before removing this one.</p>}
      </Card>
      <Card className="space-y-3">
        <p className="text-sm font-extrabold">Category details</p>
        <Button full variant="secondary" icon={Pencil} onClick={() => { setNm(c.name); setSheet('rename') }}>Rename category</Button>
        <Button full variant="dangerSoft" icon={Trash2} onClick={() => setSheet('delcat')}>Delete category</Button>
      </Card>
      <Card className="space-y-3">
        <p className="text-sm font-extrabold">Status</p>
        <Toggle label="Category is active" desc={c.active === false ? 'Hidden from search, onboarding and RFQs' : `${used} listing(s) use this category`} on={c.active !== false} onChange={setActive} />
        <Button full variant="secondary" icon={GitMerge} onClick={() => { setTarget(CATS.find((x) => x.id !== id && x.active !== false)?.id || ''); setSheet('merge') }}>Merge into another category</Button>
        <p className="text-xs text-ink-500">Merging moves {used} listing(s) and keeps vendors’ verification. Existing bookings keep their original category snapshot.</p>
      </Card>
      <Sheet open={sheet === 'field'} onClose={() => setSheet(null)} title="Add custom field" footer={<Button full onClick={addField}>Add field</Button>}>
        <Input label="Label" value={fd.k} onChange={(e) => setFd({ ...fd, k: e.target.value })} />
        <Select label="Type" value={fd.type} onChange={(e) => setFd({ ...fd, type: e.target.value })} options={FIELD_TYPES.map(([value, label]) => ({ value, label }))} />
        {['select', 'multi'].includes(fd.type) && <Input label="Options" value={fd.options} onChange={(e) => setFd({ ...fd, options: e.target.value })} hint="Comma separated, at least two" />}
        {fd.type === 'number' && <Input label="Unit" value={fd.unit} onChange={(e) => setFd({ ...fd, unit: e.target.value })} />}
        <Toggle label="Required for vendors" on={fd.req} onChange={(v) => setFd({ ...fd, req: v })} />
        <Toggle label="Use as a search filter" on={fd.filter} onChange={(v) => setFd({ ...fd, filter: v })} />
      </Sheet>
      <Sheet open={sheet === 'subadd'} onClose={() => setSheet(null)} title="Add sub-category" footer={<Button full onClick={addSub}>Add sub-category</Button>}>
        <Input label="Name" value={nm} onChange={(e) => setNm(e.target.value)} />
      </Sheet>
      <Sheet open={sheet === 'subedit'} onClose={() => setSheet(null)} title="Rename sub-category" footer={<Button full onClick={renameSub}>Save</Button>}>
        <Input label="Name" value={nm} onChange={(e) => setNm(e.target.value)} />
        {subUsed(subSel) > 0 && <p className="text-xs text-ink-500">{subUsed(subSel)} listing(s) will follow the new name.</p>}
      </Sheet>
      <Sheet open={sheet === 'subdel'} onClose={() => setSheet(null)} title={`Remove ${subSel}`} footer={<Button full variant="danger" onClick={removeSub}>Remove sub-category</Button>}>
        {subUsed(subSel) > 0
          ? <><Banner tone="amber" title={`${subUsed(subSel)} listing(s) use it`}>Choose where they move. They are not deleted.</Banner><Select label="Move listings to" value={moveTo} onChange={(e) => setMoveTo(e.target.value)} options={subs.filter((x) => x !== subSel).map((x) => ({ value: x, label: x }))} /></>
          : <p className="text-sm text-ink-600">No listings use this sub-category.</p>}
      </Sheet>
      <Sheet open={sheet === 'rename'} onClose={() => setSheet(null)} title="Rename category" footer={<Button full onClick={renameCat}>Save name</Button>}>
        <Input label="Category name" value={nm} onChange={(e) => setNm(e.target.value)} />
      </Sheet>
      <Sheet open={sheet === 'delcat'} onClose={() => setSheet(null)} title={`Delete ${c.name}`} footer={<Button full variant="danger" disabled={blockers > 0} onClick={removeCat}>Delete category</Button>}>
        {blockers > 0
          ? <Banner tone="amber" title="It is still in use">{used} listing(s), {vendors.filter((v) => v.cat === id).length} vendor(s) and {rfqs.filter((r) => r.cat === id).length} RFQ(s) reference this category. Merge it into another category or deactivate it instead of deleting.</Banner>
          : <Banner tone="red" title="This cannot be undone">Nothing references this category, so it will be removed from search, onboarding and RFQs.</Banner>}
      </Sheet>
      <Sheet open={sheet === 'merge'} onClose={() => setSheet(null)} title={`Merge ${c.name}`} footer={<Button full variant="danger" disabled={!target} onClick={merge}>Merge {used} listing(s)</Button>}>
        <Select label="Merge into" value={target} onChange={(e) => setTarget(e.target.value)} options={CATS.filter((x) => x.id !== id && x.active !== false).map((x) => ({ value: x.id, label: x.name }))} />
        <Banner tone="amber" title="This deactivates the source category">It cannot be undone from this screen. Listings re-check their publication gates under the new category.</Banner>
      </Sheet>
    </>
  )
}
