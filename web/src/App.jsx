import { useEffect, useMemo, useState } from 'react'
import { Search, X, CheckCircle2, AlertTriangle, Menu, Bell, Globe, LogOut, MapPin, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { AppProvider, useApp } from './store.jsx'
import { JOURNEYS } from './mvpdata.jsx'
import { NavProvider, useNav } from './nav.jsx'
import { HOME, TABS, VISIBLE_ROLES, ADMIN_SIDEBAR } from './roles.js'
import { SCREENS, GROUPS, phaseOf } from './registry.jsx'
import { ME } from './data.jsx'
import { Logo } from './screens/auth.jsx'
import { SECTIONS } from './specs.js'
import { cx, PhaseTag } from './ui.jsx'

/*  Web shell: a desktop header (tabs, language, location, bell) and, for the admin portal, a sidebar.
    Every screen inside is the same component the mobile app renders (docs/03-mockup-sync-matrix.md);
    only this shell differs. The admin portal exists on web only (D-015).  */

const INITIAL_SCREEN = window.location.hash.replace(/^#\/?/, '')

function useViewport() {
  const [v, setV] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const f = () => setV({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  return v
}

/* a vendor searching to buy stays inside the Buy tab */
const currentTab = (me, id) => (me.role === 'vendor' && ['c_explore', 'c_explore_suppliers'].includes(id) ? 'v_buy' : id)

function TabBar() {
  const nav = useNav()
  const { me, t, threads, leads, bookings } = useApp()
  const tabs = TABS[me.role] || []
  const cur = currentTab(me, nav.id)
  if (!tabs.some((x) => x.id === cur)) return null
  const badge = (id) => {
    if (id === 'messages') return (me.role === 'business' ? threads.business.filter((x) => x.bizId === me.bizId) : me.role === 'vendor' ? threads.vendor : threads.customer.filter((x) => x.owner === me.name)).reduce((s, x) => s + x.unread, 0)
    if (id === 'v_work') return bookings.filter((b) => b.vendorId === me.vendorId && b.state === 'requested').length
    if (id === 'c_activity') return bookings.filter((b) => b.customer === me.name && ['awaiting', 'requested'].includes(b.state)).length
    if (id === 'a_followups') return leads.filter((l) => l.next?.date && new Date(l.next.date) <= new Date('19 Oct 2026')).length
    return 0
  }
  return (
    <nav className="z-20 flex shrink-0 items-center justify-between gap-1 border-t border-ink-100 bg-white/95 px-3 pb-1.5 pt-2 shadow-[0_-8px_24px_-14px_rgba(20,40,75,0.25)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[560px] items-center justify-between gap-1">
        {tabs.map((x) => {
          const on = x.id === cur
          const n = badge(x.id)
          return (
            <button key={x.id} aria-label={t(x.k)} onClick={() => x.id !== nav.id && nav.reset(x.id)} className={cx('relative flex h-11 items-center justify-center gap-1.5 rounded-full transition-all duration-300 active:scale-90', on ? 'flex-[2.1] bg-brand-600 px-3 text-white shadow-md shadow-brand-700/30' : 'flex-1 text-ink-400 hover:bg-ink-50')}>
              <x.icon size={21} strokeWidth={on ? 2.4 : 2} className="shrink-0" />
              {on && <span className="truncate text-[12.5px] font-bold">{t(x.k)}</span>}
              {n > 0 && <span className={cx('absolute grid min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-4 text-white ring-2', on ? 'right-1.5 top-0.5 ring-brand-600' : 'right-2 top-0.5 ring-white')}>{n}</span>}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function Toast() {
  const { toastMsg } = useApp()
  if (!toastMsg) return null
  const warn = toastMsg.tone === 'warn'
  return (
    <div key={toastMsg.id} className={cx('pointer-events-none absolute inset-x-4 top-3 z-[60] flex animate-toast items-center gap-2.5 rounded-2xl px-4 py-3 text-[13px] font-semibold text-white shadow-xl', warn ? 'bg-amber-600' : 'bg-ink-900')}>
      {warn ? <AlertTriangle size={17} className="shrink-0" /> : <CheckCircle2 size={17} className="shrink-0 text-emerald-400" />}
      {toastMsg.msg}
    </div>
  )
}

function GuideBar() {
  const { journey, setJourney } = useApp()
  if (!journey) return null
  const j = JOURNEYS.find((x) => x.id === journey.id)
  if (!j) return null
  const last = journey.step >= j.steps.length - 1
  const go = (i) => { setJourney({ id: j.id, step: i }); window.dispatchEvent(new CustomEvent('vv-jump', { detail: j.steps[i][1] })) }
  return (
    <div className="z-30 flex shrink-0 items-center gap-2 bg-ink-900 px-3 py-1.5 text-white">
      <span className="shrink-0 rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold">{j.id}</span>
      <p className="min-w-0 flex-1 truncate text-[11.5px] font-medium">Step {journey.step + 1}/{j.steps.length} · {j.steps[journey.step][0]}</p>
      {journey.step > 0 && <button onClick={() => go(journey.step - 1)} className="text-[11px] font-bold text-white/70">Prev</button>}
      {!last ? <button onClick={() => go(journey.step + 1)} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-ink-900">Next</button> : <button onClick={() => setJourney(null)} className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold">Done</button>}
      <button aria-label="Exit guided mode" onClick={() => setJourney(null)} className="text-white/60"><X size={14} /></button>
    </div>
  )
}

function ScreenHost() {
  const nav = useNav()
  const reg = SCREENS[nav.id] || SCREENS.welcome
  const C = reg.C
  return (
    <div key={`${nav.epoch}-${nav.depth}-${nav.id}`} className={cx('h-full', nav.dir === 'push' ? 'animate-slide-in' : 'animate-fade-in')}>
      <C params={nav.params || {}} />
    </div>
  )
}

/* ---------- left drawer: screen directory ---------- */
function Directory({ onJump, onClose }) {
  const nav = useNav()
  const { me } = useApp()
  const [grp, setGrp] = useState(SCREENS[nav.id]?.role === 'shared' ? me.role || 'customer' : SCREENS[nav.id]?.role || 'auth')
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const all = Object.values(SCREENS)
    if (q) return all.filter((s) => (s.title + s.id + s.sec.join(' ') + s.sc.join(' ')).toLowerCase().includes(q.toLowerCase()))
    return all.filter((s) => s.role === grp || (s.role === 'shared' && (grp === 'customer' || grp === 'vendor')))
  }, [grp, q])
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
        <Logo size={38} />
        <div className="min-w-0 flex-1"><h1 className="text-[17px] font-extrabold leading-tight tracking-tight">VendorVerse</h1><p className="text-[11px] font-medium text-ink-500">Web · same screens as the mobile app, plus the admin portal</p></div>
        {onClose && <button onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-full hover:bg-ink-100"><X size={20} /></button>}
      </div>
      <div className="space-y-3 px-4 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Switch role</p>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${VISIBLE_ROLES.length}, minmax(0, 1fr))` }}>
          {VISIBLE_ROLES.map((r) => {
            const on = me.loggedIn && me.role === r.id
            return <button key={r.id} onClick={() => { onJump(HOME[r.id]); setGrp(r.id); setQ(''); onClose?.() }} className={cx('rounded-lg py-2 text-[11px] font-bold ring-1 ring-inset transition', on ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink-600 ring-ink-200 hover:bg-ink-50')}>{r.short}</button>
          })}
        </div>
        <div className="relative"><Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${Object.keys(SCREENS).length} screens, §8 or SC-012`} className="h-10 w-full rounded-lg bg-ink-50 pl-9 pr-3 text-[13px] outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-brand-500" /></div>
        {!q && (
          <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
            {GROUPS.map((g) => <button key={g.id} onClick={() => setGrp(g.id)} className={cx('shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition', grp === g.id ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200')}>{g.label} <span className="opacity-60">{Object.values(SCREENS).filter((s) => s.role === g.id).length}</span></button>)}
          </div>
        )}
      </div>
      <div className="thin-scroll mt-3 min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {list.map((s) => (
          <button key={s.id} onClick={() => { onJump(s.id); onClose?.() }} className={cx('flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition', nav.id === s.id ? 'bg-brand-50' : 'hover:bg-ink-50')}>
            <span className={cx('size-1.5 shrink-0 rounded-full', nav.id === s.id ? 'bg-brand-600' : 'bg-ink-200')} />
            <span className={cx('min-w-0 flex-1 truncate text-[13px] font-semibold', nav.id === s.id ? 'text-brand-800' : 'text-ink-800')}>{s.title}</span>
            <span className="flex shrink-0 gap-1">{s.sec.slice(0, 2).map((f) => <span key={f} className="rounded bg-ink-100 px-1.5 py-0.5 text-[9.5px] font-bold text-ink-500">{SECTIONS[f]?.n}</span>)}{s.sc.length > 0 && <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[9.5px] font-bold text-brand-700">{s.sc.length} SC</span>}{phaseOf(s.id) !== 'MVP' && <PhaseTag p={phaseOf(s.id)} />}</span>
          </button>
        ))}
        {list.length === 0 && <p className="p-6 text-center text-sm text-ink-500">No screens match.</p>}
      </div>
    </div>
  )
}

/* ---------- top header ---------- */
function WebHeader({ onMenu, onLogout }) {
  const nav = useNav()
  const { lang, setLang, loc, me, t, notifs } = useApp()
  const tabs = TABS[me.role || 'customer'] || TABS.customer
  const active = currentTab(me, nav.stack.slice().reverse().map((e) => tabs.find((tab) => tab.id === currentTab(me, e.id))).find(Boolean)?.id || nav.id)
  const unread = (notifs[me.role] || []).filter((x) => !x.read).length
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-ink-200 bg-white/95 shadow-[0_2px_10px_rgba(20,40,75,.04)] backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-3 px-4 sm:px-7 lg:px-10">
        <button onClick={() => nav.reset(HOME[me.role || 'customer'])} className="flex shrink-0 items-center gap-2.5 rounded-xl text-left" aria-label="VendorVerse home">
          <Logo size={40} />
          <span className="hidden sm:block"><span className="block text-[18px] font-black leading-tight tracking-tight text-ink-900">VendorVerse</span><span className="block text-[11px] font-medium text-ink-500">{me.role === 'admin' ? 'Admin portal' : 'Global marketplace'}</span></span>
        </button>
        {me.role !== 'admin' && (
          <nav className="no-scrollbar ml-3 hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto md:flex" aria-label="Main navigation">
            {tabs.map((tab) => { const on = active === tab.id; return <button key={tab.id} onClick={() => nav.reset(tab.id)} aria-current={on ? 'page' : undefined} className={cx('flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-[13px] font-bold transition', on ? 'bg-brand-50 text-brand-800' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900')}><tab.icon size={17} />{t(tab.k)}</button> })}
          </nav>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <button onClick={onMenu} aria-label="Screen directory" title="Screen directory" className="grid size-10 place-items-center rounded-xl text-ink-600 hover:bg-ink-50"><Menu size={20} /></button>
          {me.role !== 'admin' && <button onClick={() => nav.go('c_location')} className="hidden max-w-[210px] items-center gap-1 truncate rounded-xl bg-ink-50 px-3 py-2 text-left text-xs font-bold text-ink-700 hover:bg-brand-50 sm:flex" title="Change location"><MapPin size={14} className="shrink-0 text-brand-700" /><span className="truncate">{loc.city}, {loc.state}</span></button>}
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="hidden h-10 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50 sm:flex" aria-label="Switch language"><Globe size={17} /><span>{lang === 'en' ? 'EN' : 'हि'}</span></button>
          {me.loggedIn && <button onClick={() => nav.go('notifications')} className="relative grid size-10 place-items-center rounded-xl text-ink-600 hover:bg-ink-50" aria-label="Notifications"><Bell size={19} />{unread > 0 && <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-4 text-white">{unread}</span>}</button>}
          {!me.loggedIn ? <button onClick={() => nav.go('login')} className="h-10 rounded-xl bg-brand-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-brand-700">Sign in</button> : <button onClick={onLogout} className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-ink-600 hover:bg-ink-50 sm:flex" aria-label="Log out"><LogOut size={16} />{t('logout')}</button>}
        </div>
      </div>
    </header>
  )
}

/* ---------- admin portal sidebar (web only) ---------- */
function AdminSidebar({ collapsed, onToggle, onNavigate, onLogout, me, activeId }) {
  return (
    <aside className={cx('flex shrink-0 flex-col border-r border-ink-200 bg-white transition-[width]', collapsed ? 'w-[68px]' : 'w-[260px]')} aria-label="Admin portal navigation">
      <div className="flex items-center gap-2.5 border-b border-ink-100 px-3 py-3.5">
        <Logo size={36} />
        {!collapsed && <div className="min-w-0 flex-1"><p className="text-[15px] font-extrabold leading-tight">VendorVerse</p><p className="text-[11px] font-medium text-ink-500">Admin portal · web only</p></div>}
        <button type="button" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="grid size-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-50">{collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}</button>
      </div>
      <nav className="thin-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-2 py-3" aria-label="Admin pages">
        {ADMIN_SIDEBAR.map((group) => (
          <div key={group.label}>
            {!collapsed && <p className="px-3 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-ink-400">{group.label}</p>}
            {group.items.map((item) => {
              const on = activeId === item.id
              return (
                <button key={item.id} type="button" onClick={() => onNavigate(item.id)} aria-current={on ? 'page' : undefined} title={collapsed ? item.label : undefined} className={cx('flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition', on ? 'bg-brand-50 text-brand-800' : 'text-ink-600 hover:bg-ink-50')}>
                  <item.icon size={17} className="shrink-0" />{!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-ink-100 p-2">
        {!collapsed && <p className="truncate px-3 py-1 text-xs font-bold text-ink-700">{me.name || ME.admin}<span className="block text-[11px] font-medium text-ink-400">Super Admin</span></p>}
        <button type="button" onClick={onLogout} title={collapsed ? 'Log out' : undefined} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-ink-600 hover:bg-ink-50"><LogOut size={17} />{!collapsed && 'Log out'}</button>
      </div>
    </aside>
  )
}

function Shell() {
  const nav = useNav()
  const { me, setMe } = useApp()
  const { w } = useViewport()
  const [drawer, setDrawer] = useState(false)
  const [sideCollapsed, setSideCollapsed] = useState(false)
  const desktop = w >= 768
  const reg = SCREENS[nav.id] || SCREENS.welcome
  const bare = reg.role === 'auth'
  const showSidebar = desktop && me.role === 'admin' && reg.role === 'admin' && !bare

  const jump = (id) => {
    const r = SCREENS[id]
    if (!r) return
    if (r.role === 'auth') setMe({ ...me, role: null, loggedIn: false, guest: false })
    else if (r.role === 'shared') { if (!['customer', 'vendor', 'business'].includes(me.role)) setMe({ ...me, role: 'customer', loggedIn: true, guest: false, vendorId: null, hasVendor: false, name: ME.customer }) }
    else if (r.as === 'vbuyer') setMe({ ...me, role: 'vendor', loggedIn: true, guest: false, vendorId: 'v-me', hasVendor: true, name: ME.vendor })
    else if (me.role !== r.role || !me.loggedIn) setMe({ ...me, role: r.role, loggedIn: true, guest: false, vendorId: r.role === 'vendor' ? 'v-me' : null, hasVendor: r.role === 'vendor', bizId: r.role === 'business' ? 'biz-me' : null, name: ME[r.role] })
    nav.reset(id, r.demo || {})
  }
  const logout = () => { setMe({ role: null, loggedIn: false, guest: false, vendorId: 'v-me', name: '' }); nav.reset('c_home') }

  // deep links: /#/c_home opens that screen; the hash follows navigation
  useEffect(() => { if (SCREENS[INITIAL_SCREEN]) jump(INITIAL_SCREEN) }, [])
  useEffect(() => { window.history.replaceState(null, '', `#/${nav.id}`) }, [nav.id])
  useEffect(() => { const h = (e) => jump(e.detail); window.addEventListener('vv-jump', h); return () => window.removeEventListener('vv-jump', h) })

  return (
    <div className="flex h-full min-h-0 bg-ink-50">
      {showSidebar && <AdminSidebar collapsed={sideCollapsed} onToggle={() => setSideCollapsed((v) => !v)} onNavigate={jump} onLogout={logout} me={me} activeId={nav.id} />}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {!bare && <WebHeader onMenu={() => setDrawer(true)} onLogout={logout} />}
        <main className="relative flex min-h-0 flex-1 justify-center overflow-hidden">
          <div className={cx('relative flex h-full w-full min-w-0 flex-col bg-white', bare ? 'max-w-[520px] shadow-xl' : showSidebar ? 'max-w-[1040px]' : 'max-w-none')}>
            <GuideBar />
            <div className="relative min-h-0 flex-1"><ScreenHost /><Toast /></div>
            {!desktop && !bare && <TabBar />}
          </div>
        </main>
      </div>
      {drawer && (
        <div className="fixed inset-0 z-[80] flex justify-start">
          <div className="absolute inset-0 animate-fade-in bg-ink-900/45" onClick={() => setDrawer(false)} />
          <div className="relative h-full w-[min(360px,92vw)] animate-slide-in border-r border-ink-200 shadow-2xl"><Directory onJump={jump} onClose={() => setDrawer(false)} /></div>
        </div>
      )}
      {bare && <button onClick={() => setDrawer(true)} aria-label="Screen directory" className="fixed right-4 top-4 z-[70] grid size-10 place-items-center rounded-xl bg-white/90 text-ink-600 shadow ring-1 ring-ink-200 hover:bg-white"><Menu size={19} /></button>}
    </div>
  )
}

function Root() {
  const { me } = useApp()
  return (
    <NavProvider fallbackHome={() => HOME[me.role] || 'welcome'}>
      <Shell />
    </NavProvider>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  )
}
