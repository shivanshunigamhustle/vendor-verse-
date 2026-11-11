import React, { useEffect, useRef } from 'react'
import {
  Search,
  FilePlus2,
  Layers,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Scale,
  ClipboardCheck,
  Receipt,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TiltCard } from './TiltCard.jsx'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'Search vendors, bulk suppliers, and regional services across live launch cities.',
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
    title: 'Reviewed Onboarding',
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

export function HowItWorks() {
  const sectionRef = useRef(null)

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
        y: 22,
        rotateX: 5,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.hiw-steps-row',
          scroller: scrollerEl,
          start: 'top 90%',
          once: true,
        },
      })

      gsap.from('.hiw-arrow-connector', {
        x: -8,
        duration: 0.45,
        stagger: 0.1,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.hiw-steps-row',
          scroller: scrollerEl,
          start: 'top 90%',
          once: true,
        },
      })

      gsap.from('.hiw-trust-card', {
        y: 16,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.hiw-trust-strip',
          scroller: scrollerEl,
          start: 'top 92%',
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
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
            From discovering suppliers across Rajasthan &amp; Delhi NCR to comparing quotes and
            confirming terms, every step stays organized in one place.
          </p>
        </div>

        {/* 4 Dimensional Steps with Animated Sky-Blue Connectors */}
        <div className="hiw-steps-row">
          {STEPS.map((step, index) => {
            const StepIcon = step.Icon
            return (
              <React.Fragment key={step.num}>
                <div className="hiw-step-wrap">
                  <TiltCard
                    className="hiw-step-tilt-card"
                    maxTilt={7}
                    scale={1.03}
                    elevation={16}
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
                    <ArrowRight size={20} strokeWidth={2.2} />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Accurate Phase 1 Value Architecture Strip */}
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
      </div>
    </section>
  )
}
