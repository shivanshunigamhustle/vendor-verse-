import React, { useEffect, useRef, useState } from 'react'
import {
  Search,
  FilePlus2,
  Layers,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Scale,
  ClipboardCheck,
  Receipt,
  Wrench,
  Package,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TiltCard } from './TiltCard.jsx'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'Search service providers, bulk suppliers, and businesses across active markets.',
    Icon: Search,
  },
  {
    num: '02',
    title: 'Request / Book',
    desc: 'Submit a structured requirement (RFQ) or request a service booking in minutes.',
    Icon: FilePlus2,
  },
  {
    num: '03',
    title: 'Compare',
    desc: 'Review vendor quotations, delivery schedules, and capabilities side by side.',
    Icon: Layers,
  },
  {
    num: '04',
    title: 'Proceed',
    desc: 'Confirm a purchase order or contract terms and work directly on agreed invoices.',
    Icon: Briefcase,
  },
]

const TRUST_POINTS = [
  {
    id: 'structured',
    title: 'Structured Onboarding',
    subtitle: 'Category, service area & requirement alignment',
    Icon: ShieldCheck,
  },
  {
    id: 'quotes',
    title: 'Quotations Side-by-Side',
    subtitle: 'Clear comparison across vendors and lead times',
    Icon: Scale,
  },
  {
    id: 'tracking',
    title: 'Unified Activity Flow',
    subtitle: 'Manage bookings, RFQs, POs & contracts together',
    Icon: ClipboardCheck,
  },
  {
    id: 'invoice',
    title: 'Direct Invoice Terms',
    subtitle: 'Settle directly via agreed offline & invoice workflows',
    Icon: Receipt,
  },
]

const SPECIFIC_JOURNEYS = [
  {
    id: 'service',
    label: 'Service Booking Flow',
    icon: Wrench,
    badge: 'FOR SERVICE BUYERS',
    title: 'Book Certified Professionals with Milestone Escrow',
    steps: [
      {
        num: '1',
        title: 'Search & Vet Specialists',
        desc: 'Filter by trade, check real customer ratings, verified licences, and previous project galleries.',
      },
      {
        num: '2',
        title: 'Select Slot & Share Details',
        desc: 'Choose your desired service date and time, and attach site photos or task instructions.',
      },
      {
        num: '3',
        title: 'Direct Provider Coordination',
        desc: 'Coordinate arrival, confirm scope adjustments, and monitor progress via real-time messaging.',
      },
      {
        num: '4',
        title: 'Satisfied Sign-Off & Escrow Pay',
        desc: 'Review completed work against agreed criteria before releasing secure escrow payment.',
      },
    ],
  },
  {
    id: 'rfq',
    label: 'RFQ / Bulk Procurement',
    icon: Package,
    badge: 'FOR COMMERCIAL SOURCING',
    title: 'One Requirement. Multiple Competitive Quotations.',
    steps: [
      {
        num: '1',
        title: 'Publish Structured Spec Sheet',
        desc: 'Specify bill of materials, quantities, technical standards, delivery port, and target deadlines.',
      },
      {
        num: '2',
        title: 'Verified Supplier Matchmaking',
        desc: 'Our engine routes your tender to pre-vetted factories and authorized distributors.',
      },
      {
        num: '3',
        title: 'Side-by-Side Bid Matrix',
        desc: 'Compare total pricing, MOQ breakdown, warranty durations, and lead times in one dashboard.',
      },
      {
        num: '4',
        title: 'Issue Milestone Purchase Order',
        desc: 'Award the order with binding contract terms, milestone schedules, and legal delivery guarantees.',
      },
    ],
  },
  {
    id: 'b2b',
    label: 'Vendor-to-Vendor Transactions',
    icon: Building2,
    badge: 'FOR SUPPLY CHAIN PARTNERSHIPS',
    title: 'Direct B2B Wholesale & Contract Manufacturing',
    steps: [
      {
        num: '1',
        title: 'Discover Tier-1 Manufacturers',
        desc: 'Access verified production facilities, OEM fabricators, and raw material processing mills.',
      },
      {
        num: '2',
        title: 'Request Samples & Quality Audits',
        desc: 'Order prototype units, evaluate compliance certificates (ISO/CE), and inspect test reports.',
      },
      {
        num: '3',
        title: 'Negotiate Commercial Terms',
        desc: 'Agree on volume discounts, scheduled deliveries, credit lines, and customs documentation.',
      },
      {
        num: '4',
        title: 'Automated Supply Cadence',
        desc: 'Track phased dispatches, warehouse deliveries, and unified tax invoices seamlessly.',
      },
    ],
  },
]

export function HowItWorks() {
  const sectionRef = useRef(null)
  const [activeJourneyTab, setActiveJourneyTab] = useState('service')

  const currentJourney = SPECIFIC_JOURNEYS.find((j) => j.id === activeJourneyTab) || SPECIFIC_JOURNEYS[0]

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    const scrollerEl = el.closest('.vv-customer-route') || window

    const ctx = gsap.context(() => {
      gsap.from('.hiw-step-wrap', {
        y: 24,
        z: -16,
        rotateX: 5.5,
        scale: 0.985,
        transformPerspective: 1150,
        duration: 0.68,
        stagger: 0.11,
        ease: 'power3.out',
        clearProps: 'transform',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.hiw-steps-row',
          scroller: scrollerEl,
          start: 'top 90%',
          once: true,
        },
      })
    }, el)

    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      cancelAnimationFrame(rafId)
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="how"
      ref={sectionRef}
      className="how-it-works-section"
      aria-labelledby="hiw-heading"
    >
      <div className="section-container">
        <div className="hiw-header-center">
          <span className="eyebrow-tag">HOW VENDORVERSE WORKS</span>
          <h2 id="hiw-heading" className="section-heading dark">
            Get Business Done in <span className="text-gradient">Four Clear Steps</span>
          </h2>
          <p className="section-subcopy center">
            From discovering global suppliers to comparing quotes and confirming terms, every step
            stays organized in one place.
          </p>
        </div>

        {/* 4 Dimensional Steps with Animated Connectors */}
        <div className="hiw-steps-row">
          {STEPS.map((step, index) => {
            const StepIcon = step.Icon
            return (
              <React.Fragment key={step.num}>
                <div className="hiw-step-wrap">
                  <TiltCard
                    className="hiw-step-tilt-card"
                    maxTilt={5.5}
                    scale={1.025}
                    elevation={14}
                  >
                    <div className="hiw-step-card">
                      <span className="step-num-badge">{step.num}</span>
                      <div className="hiw-icon-circle">
                        <StepIcon size={25} strokeWidth={2} />
                      </div>
                      <h3 className="hiw-step-title">{step.title}</h3>
                      <p className="hiw-step-desc">{step.desc}</p>
                    </div>
                  </TiltCard>
                </div>

                {index < STEPS.length - 1 && (
                  <div className="hiw-arrow-connector" aria-hidden="true">
                    <span className="hiw-connector-line" />
                    <ChevronRight size={16} strokeWidth={2.4} className="hiw-connector-head" />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Value Architecture Strip */}
        <div className="hiw-trust-strip">
          {TRUST_POINTS.map((tp) => {
            const Icon = tp.Icon
            return (
              <div key={tp.id} className="hiw-trust-card">
                <div className="hiw-trust-icon">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div className="hiw-trust-text">
                  <strong>{tp.title}</strong>
                  <span>{tp.subtitle}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dedicated 3-Journey Interactive Deep-Dive Breakdown */}
        <div className="hiw-journeys-breakdown">
          <div className="hiw-journeys-tab-header">
            <span className="eyebrow-tag">WORKFLOW ARCHITECTURE</span>
            <h3 className="hiw-journeys-title">
              Clear Journeys for <span className="text-gradient">Every Commercial Need</span>
            </h3>
            <p className="hiw-journeys-desc">
              Select a workflow below to inspect the exact end-to-end operational lifecycle.
            </p>

            <div className="hiw-tab-nav" role="tablist" aria-label="Workflow Types">
              {SPECIFIC_JOURNEYS.map((j) => {
                const TabIcon = j.icon
                const isActive = j.id === activeJourneyTab
                return (
                  <button
                    key={j.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`hiw-tab-pill ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveJourneyTab(j.id)}
                  >
                    <TabIcon size={16} strokeWidth={2.2} />
                    <span>{j.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="hiw-active-journey-card">
            <div className="journey-detail-header">
              <span className="journey-detail-badge">{currentJourney.badge}</span>
              <h4 className="journey-detail-title">{currentJourney.title}</h4>
            </div>

            <div className="journey-steps-grid">
              {currentJourney.steps.map((st) => (
                <div key={st.num} className="journey-substep-card">
                  <div className="journey-substep-num">{st.num}</div>
                  <h5 className="journey-substep-heading">{st.title}</h5>
                  <p className="journey-substep-copy">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
