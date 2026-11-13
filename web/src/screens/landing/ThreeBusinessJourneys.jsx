import React from 'react'
import { ArrowRight, Wrench, Package, Building2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { TiltCard } from './TiltCard.jsx'

export function ThreeBusinessJourneys({ onSelectJourney }) {
  const JOURNEYS = [
    {
      id: 'services',
      num: '01',
      badge: 'SERVICE PROVIDERS & CONTRACTORS',
      title: 'Hire Services',
      tagline: 'Book verified technical & trade professionals directly',
      desc: 'Discover verified professionals, specialized agencies, and trade contractors. Milestone-based bookings, transparent service rates, and verified client ratings with escrow safety.',
      bullets: [
        'Verified Trade Credentials & Licences',
        'Direct Slot Booking & Milestone Tracking',
        'Escrow Payment Safety & Quality Guarantee',
        'Instant Chat with Service Specialists',
      ],
      cta: 'Find Services',
      icon: Wrench,
      highlightTone: 'sky',
      targetType: 'services',
    },
    {
      id: 'products',
      num: '02',
      badge: 'MANUFACTURERS & BULK SUPPLIERS',
      title: 'Source Products & Suppliers',
      tagline: 'Connect directly with verified manufacturing plants',
      desc: 'Direct access to certified manufacturing facilities, authorized regional distributors, and wholesale exporters. Compare minimum order quantities (MOQ), factory audits, and tiered volume pricing.',
      bullets: [
        'Audited Factory Profiles & ISO Certifications',
        'Tiered Wholesale & Volume Pricing Breaks',
        'Fast Sample Orders & Technical Specification Sheets',
        'Direct Export & Port Dispatch Logistics',
      ],
      cta: 'Find Products & Suppliers',
      icon: Package,
      highlightTone: 'blue',
      targetType: 'products',
    },
    {
      id: 'procurement',
      num: '03',
      badge: 'ENTERPRISE & B2B TRANSACTIONS',
      title: 'Business Procurement',
      tagline: 'Manage corporate RFQs, tenders and supply contracts',
      desc: 'Custom manufacturing contracts, raw materials supply, and enterprise tender management. Post single RFQs, receive competitive vendor bids, and establish long-term supply agreements.',
      bullets: [
        'Single RFQ Submission to Multiple Global Suppliers',
        'Side-by-Side Quotation & Lead-Time Matrix',
        'Custom Service Level Agreements & Milestone Invoicing',
        'Dedicated Enterprise Account & Compliance Support',
      ],
      cta: 'Explore Business Procurement',
      icon: Building2,
      highlightTone: 'deep',
      targetType: 'businesses',
    },
  ]

  const handleAction = (journey) => {
    if (onSelectJourney) {
      onSelectJourney(journey.targetType)
    }
  }

  return (
    <section className="business-journeys-section" aria-labelledby="journeys-heading">
      <div className="section-container">
        <div className="journeys-header-center">
          <span className="eyebrow-tag">
            <Sparkles size={13} strokeWidth={2.4} />
            THREE TAILORED PATHWAYS
          </span>
          <h2 id="journeys-heading" className="section-heading dark">
            How Do You Want to <span className="text-gradient">Do Business Today?</span>
          </h2>
          <p className="section-subcopy center">
            Whether you need certified on-site service experts, direct factory product sourcing, or
            enterprise multi-vendor RFQ procurement, VendorVerse provides dedicated workflows.
          </p>
        </div>

        <div className="journeys-cards-grid">
          {JOURNEYS.map((journey) => {
            const Icon = journey.icon
            return (
              <TiltCard
                key={journey.id}
                className="journey-tilt-wrap"
                maxTilt={6}
                scale={1.02}
                elevation={16}
              >
                <div className={`journey-card tone-${journey.highlightTone}`}>
                  <div className="journey-card-top">
                    <span className="journey-num-pill">{journey.num}</span>
                    <span className="journey-badge">{journey.badge}</span>
                  </div>

                  <div className="journey-icon-circle">
                    <Icon size={26} strokeWidth={2.2} />
                  </div>

                  <h3 className="journey-card-title">{journey.title}</h3>
                  <p className="journey-card-tagline">{journey.tagline}</p>
                  <p className="journey-card-desc">{journey.desc}</p>

                  <div className="journey-bullets-list">
                    {journey.bullets.map((bullet, idx) => (
                      <div key={idx} className="journey-bullet-item">
                        <CheckCircle2 size={15} strokeWidth={2.4} className="bullet-check-icon" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="journey-card-footer">
                    <button
                      type="button"
                      className="journey-action-btn"
                      onClick={() => handleAction(journey)}
                      aria-label={`${journey.cta} on VendorVerse`}
                    >
                      <span>{journey.cta}</span>
                      <ArrowRight size={16} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              </TiltCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
