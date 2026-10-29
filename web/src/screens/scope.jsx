import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, FileCheck2, Rocket, Target, Telescope } from 'lucide-react'
import { MVP, PHASE2, FUTURE, ACCEPTANCE, DECISIONS } from '../specs.js'
import { Screen, Card, Section, Button, Badge, Banner, cx } from '../ui.jsx'

const STORE_KEY = 'vendorverse_scope_review_v1'

const GROUPS = [
  { id: 'mvp', title: 'MVP', subtitle: 'Required before estimates are frozen', items: MVP, icon: Rocket, tone: 'brand', card: 'border-brand-200 bg-brand-50/50', iconClass: 'text-brand-700' },
  { id: 'phase2', title: 'Phase 2', subtitle: 'Planned after the core launch', items: PHASE2, icon: Target, tone: 'violet', card: 'border-violet-200 bg-violet-50/50', iconClass: 'text-violet-700' },
  { id: 'future', title: 'Future', subtitle: 'Roadmap ideas, not part of MVP estimates', items: FUTURE, icon: Telescope, tone: 'slate', card: 'border-ink-200 bg-ink-50', iconClass: 'text-ink-700' },
]

export function ScopeReview() {
  const [reviewed, setReviewed] = useState(() => window.localStorage.getItem(STORE_KEY) === 'reviewed')
  const [showDetails, setShowDetails] = useState(false)
  useEffect(() => { if (reviewed) window.localStorage.setItem(STORE_KEY, 'reviewed'); else window.localStorage.removeItem(STORE_KEY) }, [reviewed])
  return (
    <Screen title="MVP scope review" subtitle="Product scope before development estimates" back={false} pad={false}>
      <div className="space-y-4 p-4">
        <Banner tone={reviewed ? 'green' : 'amber'} title={reviewed ? 'Scope reviewed for this demo' : 'Scope decision pending'}>
          {reviewed ? 'The MVP, Phase 2 and Future boundaries have been marked as reviewed in this browser.' : 'Review the three scope bands below before finalising development estimates.'}
        </Banner>
        <Card className="!p-4">
          <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink-900 text-white"><FileCheck2 size={21} /></span><div className="min-w-0 flex-1"><p className="font-extrabold">Five journey gate</p><p className="mt-1 text-sm leading-relaxed text-ink-600">Customer service booking, bulk RFQ, vendor onboarding, admin approval and vendor-to-vendor procurement stay in the MVP gate.</p></div></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{['Local service booking', 'Bulk manufacturer RFQ', 'Vendor registration', 'Admin category + approval', 'Vendor-to-vendor procurement'].map((item) => <div key={item} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800"><CheckCircle2 size={15} />{item}</div>)}</div>
        </Card>
        <div className="grid gap-3 lg:grid-cols-3">{GROUPS.map(({ id, title, subtitle, items, icon: Icon, card, iconClass }) => <Card key={id} className={cx('!p-4 ring-1', card)}><div className="flex items-center gap-2.5"><Icon size={21} className={iconClass} /><div><p className="font-extrabold">{title}</p><p className="text-[11px] text-ink-500">{subtitle}</p></div></div><ul className="mt-4 space-y-2.5">{items.map((item) => <li key={item} className="flex gap-2 text-xs leading-snug text-ink-700"><Circle size={13} className="mt-0.5 shrink-0 text-ink-400" />{item}</li>)}</ul></Card>)}</div>
        <Card className="!p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-extrabold">Stakeholder acceptance</p><p className="mt-1 text-xs text-ink-500">Mark this scope as reviewed for the clickable prototype.</p></div><Badge tone={reviewed ? 'green' : 'amber'}>{reviewed ? 'Reviewed' : 'Pending'}</Badge></div><Button full className="mt-4" variant={reviewed ? 'secondary' : 'primary'} onClick={() => setReviewed((value) => !value)} icon={reviewed ? Circle : CheckCircle2}>{reviewed ? 'Reopen scope review' : 'Mark scope reviewed'}</Button></Card>
        <button onClick={() => setShowDetails((value) => !value)} className="w-full text-center text-xs font-bold text-brand-700">{showDetails ? 'Hide acceptance details' : 'Show acceptance checklist & decisions'}</button>
        {showDetails && <div className="space-y-3"><Section title="Acceptance checklist"><Card className="!p-4"><ul className="space-y-2.5">{ACCEPTANCE.map((item) => <li key={item} className="flex gap-2 text-xs leading-snug text-ink-700"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />{item}</li>)}</ul></Card></Section><Section title="Open decisions before estimates"><Card className="!p-4"><ul className="space-y-2.5">{DECISIONS.map((item) => <li key={item} className="flex gap-2 text-xs leading-snug text-ink-700"><Circle size={13} className="mt-0.5 shrink-0 text-amber-600" />{item}</li>)}</ul></Card></Section></div>}
        <p className="text-center text-[11px] text-ink-400">Demo-only scope agreement · stored in this browser · no project estimation or production approval is created.</p>
      </div>
    </Screen>
  )
}
