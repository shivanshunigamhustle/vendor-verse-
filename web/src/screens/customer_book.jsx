import { useState } from 'react'
import { CalendarClock, CalendarCheck, Check, MessageCircle, Flag, Star, Info, RefreshCw, Hourglass, ShieldCheck, Repeat, TriangleAlert, ChevronRight, MapPin, FileText, Clock } from 'lucide-react'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { cat, listing as findListing, CANCEL_POLICY, serves, AVAIL_LABEL } from '../data.jsx'
import {
  Screen, Card, Section, Button, Thumb, Chips, Segmented, Sheet, Input, Banner, EmptyState, KV, cx, Pill, StatusBadge, ListRow, Group, Timeline, Countdown, Stepper, Checkbox, Missing, Price, ReasonSheet,
} from '../ui.jsx'
import { VerifiedBadge, BookingCard, bkTimeline, useStartChat } from './shared.jsx'

const TODAY = new Date('19 Oct 2026')
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const days = (n = 7, from = 1) => Array.from({ length: n }, (_, i) => { const d = new Date(2026, 9, 19 + from + i); return { id: `${String(d.getDate()).padStart(2, '0')} ${MON[d.getMonth()]} 2026`, dow: DOW[d.getDay()], day: d.getDate(), mon: MON[d.getMonth()] } })
export const SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
const busyFor = (listingId, date) => { const h = (listingId + date).split('').reduce((s, c) => s + c.charCodeAt(0), 0); return SLOTS.filter((_, i) => (h + i * 7) % 5 === 0) }
export const hist = (b, s, note, by, extra = {}) => ({ history: [...b.history, { s, at: 'Just now', note, by }], ...extra })

/* Cancellation outcome from the published baseline policy (spec §8.6) — the vendor's own terms are never invented */
export function cancelOutcome(b) {
  if (b.state === 'requested') return { free: true, text: 'Free — the vendor has not accepted yet.' }
  const diff = Math.round((new Date(b.date) - TODAY) / 864e5)
  const pol = cat(findListing(b.listingId)?.cat || 'home').cancel
  if (pol === 'event') return diff >= 7 ? { free: true, text: 'Free — more than 7 days before the event.' } : { free: false, text: 'Less than 7 days before the event — the vendor’s stated terms apply. Support can review if you disagree.' }
  return diff >= 2 ? { free: true, text: 'Free — more than 24 hours before the start.' } : { free: false, text: 'Within 24 hours of the start — the vendor’s stated terms apply. Support can review if you disagree.' }
}

/* ================= BOOKING REQUEST ================= */
export function BookNew({ params }) {
  const nav = useNav()
  const { listings, vendor, bookings, setBookings, notify, toast, me, loc } = useApp()
  const l = findListing(params.id || 'l12', listings)
  const v = vendor(l.vendorId)
  const c = cat(l.cat)
  const mode = params.mode === 'instant' && l.instant ? 'instant' : 'scheduled'
  const [step, setStep] = useState(0)
  const ds = days(7)
  const draft = params.draft ? bookings.find((x) => x.id === params.draft) : null
  const [date, setDate] = useState(draft?.date || (mode === 'instant' ? '19 Oct 2026' : ds[2].id))
  const [slot, setSlot] = useState(draft && draft.slot !== 'Not chosen' ? draft.slot : '')
  const [addr, setAddr] = useState(draft?.addr || '24, Vaishali Nagar, Jaipur 302021')
  const [notes, setNotes] = useState(draft?.notes || '')
  const [agree, setAgree] = useState(false)
  const [done, setDone] = useState(null)
  const [err, setErr] = useState({})
  const busy = busyFor(l.id, date)
  const needsSlot = l.avail === 'slots'
  const validate = () => {
    const e = {}
    if (step === 0) { if (mode !== 'instant' && needsSlot && !slot) e.slot = 'Choose a time slot'; if (addr.trim().length < 8) e.addr = 'Enter the service address'; if (!serves(l, { city: loc.city, pin: loc.pin })) e.area = `This vendor does not list ${loc.pin} in its coverage` }
    if (step === 1 && !agree) e.agree = 'Please confirm you have read the terms'
    setErr(e); return Object.keys(e).length === 0
  }
  const saveDraft = () => {
    const id = draft?.id || 'BKG-' + (2103 + bookings.length)
    const rec = { id, listingId: l.id, vendorId: l.vendorId, customer: me.name, date, slot: slot || 'Not chosen', tz: 'IST', addr, notes, state: 'draft', price: l.priceMin != null ? l.basis : 'Price not provided', policy: c.cancel, req: draft?.req || 'REQ-' + (90 + bookings.length), history: [] }
    setBookings((b) => (draft ? b.map((x) => (x.id === id ? rec : x)) : [rec, ...b]))
    toast('Saved as a draft — nothing was sent to the vendor'); nav.back()
  }
  const submit = () => {
    if (done || !validate()) return
    // Idempotent create: a stable key prevents duplicates from double-taps or network retries (spec §8.6)
    const key = `${me.name}|${l.id}|${date}|${slot}`
    const dup = bookings.find((b) => b.key === key)
    if (dup) { toast('Request already sent — showing the existing one', 'warn'); nav.replace('c_booking', { id: dup.id }); return }
    const id = draft ? draft.id : 'BKG-' + (2103 + bookings.length)
    const due = '19 Oct, ' + (c.respHrs >= 24 ? '01:25 PM +1d' : `${(1 + c.respHrs) % 12 || 12}:25 ${1 + c.respHrs >= 12 ? 'PM' : 'AM'}`)
    setBookings((b) => [{ id, key, listingId: l.id, vendorId: l.vendorId, customer: me.name, date, slot: mode === 'instant' ? 'ASAP · arrives in ~60 min' : slot || 'Vendor to confirm', tz: 'IST', addr, notes, state: mode === 'instant' ? 'confirmed' : 'requested', leftMin: mode === 'instant' ? null : c.respHrs * 60, mode, due, price: l.priceMin != null ? `${l.basis}` : 'Price not provided', policy: c.cancel, req: 'REQ-' + (90 + b.length), history: mode === 'instant' ? [{ s: 'requested', at: 'Just now', note: 'Instant booking', by: me.name }, { s: 'confirmed', at: 'Just now', note: 'Confirmed automatically — slot reserved atomically against the vendor’s live schedule', by: v.name }] : [{ s: 'requested', at: 'Just now', note: `Request sent — vendor has ${c.respHrs} h to respond`, by: me.name }] }, ...b.filter((x) => x.id !== id)])
    notify('vendor', 'New booking request', `${me.name} · ${l.title} · ${date}`, 'booking', ['v_booking', { id }])
    setDone(id)
    toast(mode === 'instant' ? 'Booked — confirmed instantly' : 'Request sent to the vendor')
  }
  if (done) {
    return (
      <Screen title={mode === 'instant' ? 'Booked' : 'Request sent'} back={false} footer={<Button full size="lg" onClick={() => nav.replace('c_booking', { id: done })}>View booking</Button>}>
        <Card className="text-center !p-6"><div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check size={34} /></div><h2 className="mt-3 text-lg font-extrabold">{mode === 'instant' ? 'Booked & confirmed' : 'Request sent'} · {done}</h2><p className="mt-1 text-sm text-ink-600">{v.name} has <b>{c.respHrs} hours</b> to accept or decline. If there’s no answer the request expires automatically and you’ll be told.</p></Card>
        <Banner tone="blue" title="Want a backup?">You can request the same job from other vendors. Each request is independent and vendors are never told about the others.<div className="mt-2"><Button size="sm" variant="secondary" onClick={() => nav.go('c_explore', { cat: l.cat })}>Request another vendor</Button></div></Banner>
      </Screen>
    )
  }
  return (
    <Screen title={mode === 'instant' ? 'Book now ⚡' : 'Request a booking'} subtitle={l.title} footer={<div className="flex gap-2">{step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}{step === 0 && <Button variant="secondary" onClick={saveDraft}>Save draft</Button>}<Button className="flex-1" size="lg" onClick={() => { if (!validate()) return; step === 1 ? submit() : setStep(step + 1) }}>{step === 1 ? 'Send request' : 'Review'}</Button></div>}>
      <Stepper steps={['Details', 'Review & confirm']} current={step} />
      {step === 0 && (
        <div className="space-y-4">
          <Card className="!p-3.5"><div className="flex items-center gap-3"><Thumb tone={l.tone} icon={c.icon} size={48} round="rounded-xl" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{l.title}</p><p className="text-xs text-ink-500">{v.name}</p></div><VerifiedBadge id={v.id} compact /></div></Card>
          {err.area && <Banner tone="red" title="Outside the service area">{err.area}.</Banner>}
          {mode === 'instant' ? (
            <Card className="space-y-2 !bg-amber-50 !ring-amber-200"><p className="text-sm font-bold text-amber-900">⚡ Instant booking — today</p><p className="text-[13px] text-amber-900/80">{v.name} keeps a live schedule for this service, so it is confirmed immediately and a technician is assigned. Typical arrival ~60 minutes. The slot is reserved atomically so it can’t be double-booked.</p></Card>
          ) : (<>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-ink-700">Service date <span className="font-normal text-ink-400">(IST)</span></p>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">{ds.map((d) => <button key={d.id} onClick={() => { setDate(d.id); setSlot('') }} className={cx('flex w-14 shrink-0 flex-col items-center rounded-2xl py-2 ring-1 ring-inset', date === d.id ? 'bg-ink-900 text-white ring-ink-900' : 'bg-white ring-ink-200')}><span className="text-[11px] font-semibold opacity-70">{d.dow}</span><span className="text-lg font-extrabold">{d.day}</span><span className="text-[10px] opacity-70">{d.mon}</span></button>)}</div>
          </div>
          {needsSlot ? (
            <div>
              <p className="mb-2 text-[13px] font-semibold text-ink-700">Time slot</p>
              <div className="grid grid-cols-3 gap-2">{SLOTS.map((s) => { const b = busy.includes(s); return <button key={s} disabled={b} onClick={() => { setSlot(s); setErr({}) }} className={cx('rounded-xl py-2.5 text-[13px] font-semibold ring-1 ring-inset', b ? 'cursor-not-allowed bg-ink-100 text-ink-300 line-through ring-ink-100' : slot === s ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink-700 ring-ink-200')}>{s}</button> })}</div>
              <p className="mt-1.5 text-xs text-ink-500">Slots are re-checked on the server when you send. Struck-through slots are taken.</p>
              {err.slot && <p className="mt-1 text-xs font-medium text-red-600">{err.slot}</p>}
            </div>
          ) : (
            <Banner tone="blue" title={AVAIL_LABEL[l.avail]}>{l.avail === 'none' ? 'This vendor has not listed availability — they will propose a time when they respond. We don’t assume any free slot.' : 'The vendor confirms the exact time when they accept.'}</Banner>
          )}
          </>)}
          <Input label="Service address" required textarea rows={2} value={addr} onChange={(e) => setAddr(e.target.value)} error={err.addr} />
          <Input label="Notes for the vendor" textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the problem, access instructions, preferred language…" />
          <p className="text-xs text-ink-500">Your phone and email stay hidden. Share them in chat only if you choose to.</p>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-4">
          <Card><p className="mb-2 text-sm font-bold">Your request</p><KV rows={[['Service', l.title], ['Vendor', v.name], ['Date', `${date} (IST)`], ['Time', slot || 'Vendor to confirm'], ['Address', addr], ['Price basis', l.priceMin != null ? <Price l={l} /> : <Missing>Price not provided</Missing>]]} /></Card>
          <Card className="space-y-2.5">
            <p className="text-sm font-bold">Terms snapshot</p>
            <p className="text-xs leading-relaxed text-ink-600"><b>Response deadline:</b> {v.name} has {c.respHrs} hours to respond. Unanswered requests expire automatically.</p>
            <p className="text-xs leading-relaxed text-ink-600"><b>Cancellation:</b> {CANCEL_POLICY[c.cancel]}</p>
            <p className="text-xs leading-relaxed text-ink-600"><b>Payment:</b> you pay the vendor directly. VendorVerse does not collect service payments or hold funds.</p>
            <p className="text-[11px] text-ink-400">These terms are saved with the booking and stay fixed even if category defaults change later.</p>
          </Card>
          <div><Checkbox checked={agree} onChange={(v2) => { setAgree(v2); setErr({}) }}>I have read the cancellation policy and response deadline.</Checkbox>{err.agree && <p className="mt-1 text-xs font-medium text-red-600">{err.agree}</p>}</div>
        </div>
      )}
    </Screen>
  )
}

/* ================= BOOKING DETAIL ================= */
export function BookingDetail({ params }) {
  const nav = useNav()
  const { bookings, setBookings, patchBooking, listings, vendor, notify, toast, cases, reviews, reviewed, me, setThreads } = useApp()
  const start = useStartChat()
  const b = bookings.find((x) => x.id === (params.id || 'BKG-2101'))
  const [cancel, setCancel] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [rm, setRm] = useState(false)
  if (!b) return <Screen title="Booking"><EmptyState title="Booking not found" /></Screen>
  const l = findListing(b.listingId, listings)
  const v = vendor(b.vendorId)
  const c = cat(l.cat)
  const out = cancelOutcome(b)
  const sibling = bookings.find((o) => o.id !== b.id && o.req === b.req && o.state === 'confirmed' && o.customer === b.customer)
  const doCancel = (reason) => {
    patchBooking(b.id, (x) => ({ state: 'cancelled', cancel: { by: 'Customer', reason, policyResult: out.text }, ...hist(x, 'cancelled', `Cancelled by customer · ${out.free ? 'free cancellation' : 'vendor terms apply'}`, me.name) }))
    notify('vendor', 'Booking cancelled by customer', `${b.id} · ${reason}`, 'booking', ['v_booking', { id: b.id }])
    setCancel(false); toast('Booking cancelled — vendor notified')
  }
  const confirmDone = () => {
    patchBooking(b.id, (x) => ({ state: 'closed', closedHow: 'Customer confirmed', ...hist(x, 'closed', 'Customer confirmed completion', me.name) }))
    notify('vendor', 'Completion confirmed', `${b.id} closed — you can now be reviewed.`, 'booking', ['v_booking', { id: b.id }])
    setConfirm(false); toast('Thanks — booking closed')
  }
  const hasReview = reviewed.includes(b.id)
  const cs = b.caseId && cases.find((x) => x.id === b.caseId)
  return (
    <Screen
      title={b.id}
      subtitle={v.name}
      right={<StatusBadge s={b.state} className="mr-2" />}
      overlay={
        <>
          <ReasonSheet open={cancel} onClose={() => setCancel(false)} title="Cancel this booking" intro="Cancellation outcome" confirmLabel="Cancel booking" danger reasons={['Plans changed', 'Found another vendor', 'Booked by mistake', 'Vendor not reachable', 'Other']} onConfirm={doCancel} extra={<Banner tone={out.free ? 'green' : 'amber'} title={out.free ? 'No charge' : 'Vendor terms apply'}>{out.text}</Banner>} />
          <Sheet open={confirm} onClose={() => setConfirm(false)} title="Confirm completion" footer={<Button full onClick={confirmDone}>Yes, the work was completed</Button>}>
            <p className="text-sm text-ink-600">Confirming closes the booking. You can still open a support issue later if a problem appears.</p>
            <Banner tone="blue">Payment is settled directly with the vendor — VendorVerse is not involved.</Banner>
          </Sheet>
        </>
      }
    >
      <Card className="!p-3.5">
        <div className="flex items-center gap-3"><Thumb tone={l.tone} icon={c.icon} size={52} round="rounded-xl" /><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-bold">{l.title}</p><p className="text-xs text-ink-500">{v.name}</p><div className="mt-1"><VerifiedBadge id={v.id} compact /></div></div></div>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-ink-50 p-3 text-sm"><CalendarClock size={16} className="text-brand-600" /><b>{b.date}</b><span className="text-ink-500">·</span><b>{b.slot}</b><span className="text-xs text-ink-400">{b.tz}</span></div>
      </Card>

      {b.state === 'draft' && <Banner tone="gray" title="Draft — not sent yet" action={<div className="flex gap-2"><Button size="sm" onClick={() => nav.replace('c_book_new', { id: b.listingId, draft: b.id })}>Continue editing</Button><Button size="sm" variant="secondary" onClick={() => { setBookings((x) => x.filter((y) => y.id !== b.id)); toast('Draft discarded'); nav.back() }}>Discard</Button></div>}>Only you can see this. The vendor has not been told anything.</Banner>}
      {b.state === 'requested' && <Banner tone="blue" title={`Waiting for ${v.name}`} action={<Countdown mins={b.leftMin} label="to respond" />}>If there is no answer by {b.due}, this request expires automatically and nothing is charged.</Banner>}
      {b.state === 'confirmed' && sibling && <Banner tone="amber" title="Two vendors confirmed this job" action={<Button size="sm" onClick={() => nav.go('c_conflict', { req: b.req })}>Choose which to keep</Button>}>{sibling.id} is also confirmed for the same requirement. Nothing is cancelled automatically.</Banner>}
      {b.state === 'payment_failed' && <Banner tone="red" title="Payment failed" action={<div className="flex gap-2"><Button size="sm" onClick={() => { patchBooking(b.id, (x) => ({ state: 'confirmed', ...hist(x, 'confirmed', 'Payment retried successfully', me.name) })); toast('Payment received — booking confirmed') }}>Retry payment</Button><Button size="sm" variant="secondary" onClick={() => setCancel(true)}>Cancel</Button></div>}>{b.payFail?.reason || 'Your payment did not go through.'} The slot is held for a short time; no money was taken.</Banner>}
      {b.state === 'disputed' && <Banner tone="red" title="Dispute in review" action={b.caseId ? <Button size="sm" onClick={() => nav.go('c_case', { id: b.caseId })}>View case {b.caseId}</Button> : undefined}>Support is reviewing this booking. Both sides can add evidence.</Banner>}
      {b.state === 'declined' && <Banner tone="red" title="The vendor declined" action={<Button size="sm" onClick={() => nav.go('c_explore', { cat: l.cat })}>Find another vendor</Button>}>{b.history.find((h) => h.s === 'declined')?.note || 'You can contact another vendor for the same job.'}</Banner>}
      {b.state === 'expired' && <Banner tone="gray" title="Request expired" action={<Button size="sm" onClick={() => nav.go('c_explore', { cat: l.cat })}>Submit elsewhere</Button>}>The vendor didn’t respond in time. The request is closed.</Banner>}
      {b.state === 'awaiting' && (
        <Card className="space-y-3 !border-0 !bg-amber-50 ring-1 ring-amber-200">
          <div className="flex items-center justify-between"><p className="text-sm font-bold text-amber-900">Vendor marked this complete</p><Pill icon={Clock}>{b.leftDays} days left</Pill></div>
          <p className="text-[13px] text-amber-900/80">Confirm the work is done or report a problem. If you don’t respond within 7 days the booking closes — you can still raise a support issue afterwards.</p>
          <div className="flex gap-2"><Button className="flex-1" icon={Check} onClick={() => setConfirm(true)}>Confirm</Button><Button className="flex-1" variant="secondary" icon={Flag} onClick={() => nav.go('c_report', { type: 'booking', id: b.id, label: l.title, kind: 'issue' })}>Report issue</Button></div>
        </Card>
      )}
      {b.state === 'cancelled' && b.cancel && <Banner tone="gray" title={`Cancelled by ${b.cancel.by.toLowerCase()}`}><b>Reason:</b> {b.cancel.reason}<br /><b>Policy result:</b> {b.cancel.policyResult}</Banner>}
      {cs && <Card onClick={() => nav.go('c_case', { id: cs.id })} className="!p-3.5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><Flag size={18} /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold">Support case {cs.id}</p><p className="truncate text-xs text-ink-500">{cs.title}</p></div><StatusBadge s={cs.status} /></div><p className="mt-2 text-[11px] text-ink-400">The booking history above is never rewritten — the case outcome is a separate record.</p></Card>}

      {b.mod && (
        <Card className="space-y-2 !ring-violet-200">
          <div className="flex items-center justify-between"><p className="text-sm font-bold">Change request</p><StatusBadge s={b.mod.state === 'pending' ? 'requested' : b.mod.state === 'accepted' ? 'confirmed' : 'declined'} /></div>
          <KV rows={[['Proposed', `${b.mod.date}, ${b.mod.slot}`], ['Note', b.mod.note]]} />
          <p className="text-xs text-ink-500">{b.mod.state === 'pending' ? 'Your original date and time stay in force until the vendor accepts.' : b.mod.state === 'declined' ? 'The vendor declined — the original booking is still confirmed. Keep it, propose another change or cancel under the policy.' : 'Accepted — the active terms have been updated.'}</p>
        </Card>
      )}

      <Section title="Terms for this booking">
        <Card className="space-y-2">
          <KV rows={[['Price basis', b.price.includes('not provided') ? <Missing>Price not provided</Missing> : b.price], ['Address', b.addr], ['Notes', b.notes || '—'], ['Cancellation', b.policy === 'event' ? 'Event policy' : 'Standard policy']]} />
          <p className="flex items-start gap-1.5 text-[11px] text-ink-400"><ShieldCheck size={12} className="mt-0.5 shrink-0" />Policy and terms were captured when you sent the request and don’t change if category defaults change later. Payment is made directly to the vendor.</p>
        </Card>
      </Section>

      <Section title="Status timeline"><Card>{b.history.length === 0 ? <p className="text-sm text-ink-500">Nothing yet — this is still a draft.</p> : <Timeline steps={bkTimeline(b).map((s, i, a) => ({ ...s, current: i === a.length - 1 && !['closed', 'cancelled', 'declined', 'expired'].includes(b.state) }))} />}</Card></Section>

      <div className="space-y-2.5">
        <Button full variant="secondary" icon={MessageCircle} onClick={() => start(b.vendorId, b.listingId, { type: 'booking', id: b.id, label: `Booking ${b.id}` })}>Message vendor</Button>
        {b.state === 'requested' && <Button full variant="dangerSoft" onClick={() => setCancel(true)}>Cancel request</Button>}
        {b.state === 'confirmed' && <div className="grid grid-cols-2 gap-2.5"><Button variant="secondary" icon={RefreshCw} onClick={() => nav.go('c_book_modify', { id: b.id })}>Request change</Button><Button variant="dangerSoft" onClick={() => setCancel(true)}>Cancel booking</Button></div>}
        {b.state === 'closed' && !hasReview && <Button full icon={Star} onClick={() => nav.go('c_review', { vendorId: b.vendorId, via: b.id })}>Rate this vendor</Button>}
        {b.state === 'closed' && !cs && <Button full variant="secondary" icon={Flag} onClick={() => nav.go('c_report', { type: 'booking', id: b.id, label: l.title, kind: 'issue' })}>Report an issue</Button>}
      </div>

      <Card className="!bg-ink-100 shadow-none">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Mockup controls · vendor side</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {b.state === 'requested' && <><Button size="sm" variant="secondary" onClick={() => { patchBooking(b.id, (x) => ({ state: 'confirmed', leftMin: null, ...hist(x, 'confirmed', 'Vendor accepted', v.name) })); notify('customer', 'Booking confirmed', `${v.name} accepted ${b.id}.`, 'booking', ['c_booking', { id: b.id }]); toast('Vendor accepted') }}>Vendor accepts</Button><Button size="sm" variant="secondary" onClick={() => { patchBooking(b.id, (x) => ({ state: 'declined', leftMin: null, ...hist(x, 'declined', 'Vendor declined: schedule full', v.name) })); toast('Vendor declined', 'warn') }}>Vendor declines</Button><Button size="sm" variant="secondary" onClick={() => { patchBooking(b.id, (x) => ({ state: 'expired', leftMin: null, ...hist(x, 'expired', 'No response before the deadline — request closed', 'System') })); toast('Deadline passed — request expired (idempotent)', 'warn') }}>Deadline passes</Button></>}
          {b.state === 'confirmed' && <Button size="sm" variant="secondary" onClick={() => { patchBooking(b.id, (x) => ({ state: 'awaiting', leftDays: 7, ...hist(x, 'awaiting', 'Vendor marked complete — 7 days to confirm or report', v.name) })); toast('Vendor marked complete') }}>Vendor marks complete</Button>}
          {b.state === 'awaiting' && <Button size="sm" variant="secondary" onClick={() => { patchBooking(b.id, (x) => ({ state: 'closed', closedHow: 'Closed after 7 days', ...hist(x, 'closed', 'No response in 7 days — closed automatically', 'System') })); toast('7 days passed — booking closed; support stays available') }}>7 days pass</Button>}
          {!['requested', 'confirmed', 'awaiting'].includes(b.state) && <span className="text-xs text-ink-500">No further vendor actions in this state.</span>}
        </div>
      </Card>
    </Screen>
  )
}

/* ================= REQUEST MODIFICATION ================= */
export function BookModify({ params }) {
  const nav = useNav()
  const { bookings, patchBooking, notify, toast, vendor, me } = useApp()
  const b = bookings.find((x) => x.id === (params.id || 'BKG-2099'))
  const ds = days(7, 3)
  const [date, setDate] = useState(ds[0].id)
  const [slot, setSlot] = useState('')
  const [note, setNote] = useState('')
  const send = () => {
    patchBooking(b.id, (x) => ({ mod: { state: 'pending', date, slot: slot || 'Vendor to confirm', note: note || 'Customer asked for a new time', at: 'Just now' }, ...hist(x, 'mod', `Customer requested ${date}, ${slot || 'time TBC'} — original terms remain until accepted`, me.name) }))
    notify('vendor', 'Booking change requested', `${b.id} → ${date}`, 'booking', ['v_booking', { id: b.id }])
    toast('Change request sent'); nav.back()
  }
  return (
    <Screen title="Request a change" subtitle={b.id} footer={<Button full size="lg" disabled={!slot} onClick={send}>Send change request</Button>}>
      <Banner tone="blue" title="Original terms stay in force">Your current booking ({b.date}, {b.slot}) remains confirmed until {vendor(b.vendorId)?.name} accepts the change.</Banner>
      <div><p className="mb-2 text-[13px] font-semibold text-ink-700">New date</p><div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">{ds.map((d) => <button key={d.id} onClick={() => setDate(d.id)} className={cx('flex w-14 shrink-0 flex-col items-center rounded-2xl py-2 ring-1 ring-inset', date === d.id ? 'bg-ink-900 text-white ring-ink-900' : 'bg-white ring-ink-200')}><span className="text-[11px] font-semibold opacity-70">{d.dow}</span><span className="text-lg font-extrabold">{d.day}</span><span className="text-[10px] opacity-70">{d.mon}</span></button>)}</div></div>
      <div><p className="mb-2 text-[13px] font-semibold text-ink-700">New time</p><div className="grid grid-cols-3 gap-2">{SLOTS.map((s) => <button key={s} onClick={() => setSlot(s)} className={cx('rounded-xl py-2.5 text-[13px] font-semibold ring-1 ring-inset', slot === s ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink-700 ring-ink-200')}>{s}</button>)}</div></div>
      <Input label="Reason (optional)" textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
    </Screen>
  )
}

/* ================= CONFLICTING CONFIRMATIONS (spec §8.5, SC-014) ================= */
export function Conflict({ params }) {
  const nav = useNav()
  const { bookings, patchBooking, listings, vendor, notify, toast, me } = useApp()
  const list = bookings.filter((b) => b.req === (params.req || 'REQ-77') && b.state === 'confirmed' && b.customer === me.name)
  const [keep, setKeep] = useState(null)
  const apply = () => {
    list.filter((b) => b.id !== keep).forEach((b) => {
      const out = cancelOutcome(b)
      patchBooking(b.id, (x) => ({ state: 'cancelled', cancel: { by: 'Customer', reason: 'Kept another vendor for the same job', policyResult: out.text }, ...hist(x, 'cancelled', 'Cancelled by customer — chose another vendor', me.name) }))
      notify('vendor', 'Booking cancelled by customer', `${b.id} · customer kept another vendor`, 'booking', ['v_booking', { id: b.id }])
    })
    toast('Kept your choice — the other booking was cancelled under policy'); nav.back()
  }
  if (list.length < 2) return <Screen title="Conflicting bookings"><EmptyState icon={Check} title="No conflict" body="Only one booking is confirmed for this requirement." /></Screen>
  return (
    <Screen title="Which one do you keep?" footer={<Button full size="lg" disabled={!keep} onClick={apply}>Keep selected, cancel the other</Button>}>
      <Banner tone="amber" title="Two vendors confirmed the same job">Each vendor accepted independently and neither knows about the other. We never cancel a confirmed booking for you — you decide, and the cancellation policy applies to the one you release.</Banner>
      {list.map((b) => {
        const l = findListing(b.listingId, listings), v = vendor(b.vendorId), out = cancelOutcome(b)
        return (
          <button key={b.id} onClick={() => setKeep(b.id)} className={cx('w-full rounded-2xl bg-white p-4 text-left ring-1 ring-inset', keep === b.id ? 'ring-2 ring-brand-600' : 'ring-ink-200')}>
            <div className="flex items-start justify-between gap-2"><div><p className="text-sm font-bold">{v.name}</p><p className="text-xs text-ink-500">{l.title}</p></div><span className={cx('grid size-6 place-items-center rounded-full ring-1 ring-inset', keep === b.id ? 'bg-brand-600 text-white ring-brand-600' : 'ring-ink-300')}>{keep === b.id && <Check size={14} strokeWidth={3} />}</span></div>
            <KV className="mt-3" rows={[['When', `${b.date}, ${b.slot}`], ['Price', b.price.includes('not provided') ? <Missing>Not provided</Missing> : b.price], ['Rating', v.rating ? `${v.rating} ★ (${v.reviews})` : <Missing>Not yet rated</Missing>], ['If released', out.free ? 'Free to cancel' : 'Vendor terms apply']]} />
          </button>
        )
      })}
    </Screen>
  )
}
