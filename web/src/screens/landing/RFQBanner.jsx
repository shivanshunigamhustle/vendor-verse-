import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNav } from '../../nav.jsx'
import { QuickRFQModal } from './QuickRFQModal.jsx'
import { TiltCard } from './TiltCard.jsx'

export function RFQBanner() {
  const nav = useNav()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section
      id="rfq-section"
      className="rfq-banner-section"
      aria-labelledby="rfq-banner-title"
    >
      <div className="section-container">
        <div className="rfq-banner-card">
          {/* Subtle Sky-Blue Ambient Glow */}
          <div className="rfq-banner-glow" aria-hidden="true" />

          {/* LEFT: Restrained 3D Requirement-to-Supplier Node Visual */}
          <div className="rfq-visual-col">
            <TiltCard
              className="rfq-visual-tilt-wrap"
              maxTilt={6}
              scale={1.02}
              elevation={14}
            >
              <div className="rfq-visual-frame">
                <img
                  src="/images/rfq-3d-clipboard.svg"
                  alt="One requirement connecting to multiple supplier nodes"
                  className="rfq-3d-img"
                />
              </div>
            </TiltCard>
          </div>

          {/* RIGHT: Editorial Copy & Dual Action Buttons */}
          <div className="rfq-copy-col">
            <span className="rfq-eyebrow-pill">REQUEST FOR QUOTATION (RFQ)</span>
            <h2 id="rfq-banner-title" className="rfq-banner-heading">
              One Requirement. Multiple Opportunities.
            </h2>
            <p className="rfq-banner-subcopy">
              Share your business needs and discover suitable suppliers and service providers.
            </p>
            <div className="rfq-cta-group">
              <button
                type="button"
                className="rfq-cta-primary"
                onClick={() => setModalOpen(true)}
              >
                Post Your Requirement
                <ArrowRight size={17} strokeWidth={2.4} />
              </button>
              <button
                type="button"
                className="rfq-cta-secondary"
                onClick={() => nav.go('c_explore')}
              >
                Explore Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sky-Blue RFQ Modal */}
      <QuickRFQModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
