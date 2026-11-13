import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { useNav } from '../../nav.jsx'
import { QuickRFQModal } from './QuickRFQModal.jsx'
import { TiltCard } from './TiltCard.jsx'

export function RFQBanner({ onPostRFQ, onExplore }) {
  const nav = useNav()
  const sectionRef = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.16 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="rfq-section"
      className={`rfq-banner-section ${isVisible ? 'is-revealed' : ''}`}
      aria-labelledby="rfq-banner-title"
    >
      <div className="section-container">
        <div className="rfq-banner-card">
          {/* Subtle Sky-Blue Ambient Glow */}
          <div className="rfq-banner-glow" aria-hidden="true" />

          {/* LEFT: True Multi-Layer 3D Perspective RFQ Illustration */}
          <div className="rfq-visual-col">
            <TiltCard
              className="rfq-visual-tilt-wrap"
              maxTilt={9}
              scale={1.02}
              elevation={22}
            >
              <div className="rfq-visual-frame">
                <div className="rfq-3d-scene" aria-hidden="true">
                  {/* Recessed Stage Plane & Depth Shadows */}
                  <div className="rfq-stage-floor" />

                  {/* Animated Dashed Connecting Arcs in Mid-Z Plane */}
                  <svg
                    className="rfq-connectors-svg"
                    viewBox="0 0 380 250"
                    fill="none"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <radialGradient id="rfqPulseGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="45%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="rgba(56,189,248,0)" />
                      </radialGradient>
                    </defs>
                    <path d="M 152 122 Q 204 72 246 48" className="rfq-arc-path" />
                    <path d="M 154 126 L 244 126" className="rfq-arc-path mid" />
                    <path d="M 152 130 Q 204 180 246 202" className="rfq-arc-path bottom" />

                    <circle cx="192" cy="84" r="10" fill="url(#rfqPulseGlow)" opacity="0.5" />
                    <circle cx="192" cy="84" r="4" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />

                    <circle cx="198" cy="126" r="14" fill="url(#rfqPulseGlow)" opacity="0.65" />
                    <circle cx="198" cy="126" r="5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />

                    <circle cx="192" cy="168" r="10" fill="url(#rfqPulseGlow)" opacity="0.5" />
                    <circle cx="192" cy="168" r="4" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                  </svg>

                  {/* Left Main Floating Physical 3D RFQ Document */}
                  <div className="rfq-doc-stack">
                    <div className="rfq-doc-shadow-plane" />
                    <div className="rfq-doc-layer-back" />
                    <div className="rfq-doc-card">
                      <div className="rfq-doc-header">
                        <span className="rfq-doc-pill">RFQ</span>
                        <span className="rfq-doc-status-dot" />
                      </div>
                      <div className="rfq-doc-bar strong" />
                      <div className="rfq-doc-bar muted" />

                      <div className="rfq-doc-checklist">
                        <div className="rfq-check-row">
                          <span className="rfq-box checked">
                            <Check size={9} strokeWidth={3.5} />
                          </span>
                          <span className="rfq-row-line long" />
                        </div>
                        <div className="rfq-check-row">
                          <span className="rfq-box" />
                          <span className="rfq-row-line mid" />
                        </div>
                        <div className="rfq-check-row">
                          <span className="rfq-box" />
                          <span className="rfq-row-line short" />
                        </div>
                      </div>

                      <div className="rfq-doc-footer-pill">
                        <span className="rfq-footer-dot" />
                        <span className="rfq-footer-line" />
                      </div>
                    </div>
                  </div>

                  {/* Right Staggered Depth Quotation Cards */}
                  <div className="rfq-quotes-stack">
                    {/* Tier 1: Back Top Card */}
                    <div className="rfq-quote-card subtle tier-top">
                      <div className="rfq-q-top">
                        <span className="rfq-q-avatar">
                          <span className="rfq-q-dot" />
                        </span>
                        <div className="rfq-q-lines">
                          <span className="rfq-q-bar w1" />
                          <span className="rfq-q-bar w2 muted" />
                        </div>
                      </div>
                      <div className="rfq-q-meter">
                        <span className="rfq-q-fill f60" />
                      </div>
                    </div>

                    {/* Tier 2: Foreground Highlighted Active Quote Card */}
                    <div className="rfq-quote-card highlighted">
                      <div className="rfq-q-top">
                        <span className="rfq-q-avatar active">
                          <Check size={11} strokeWidth={3.2} />
                        </span>
                        <div className="rfq-q-lines">
                          <span className="rfq-q-bar dark w1" />
                          <span className="rfq-q-bar w3 muted" />
                        </div>
                      </div>
                      <div className="rfq-q-meter active">
                        <span className="rfq-q-fill f78" />
                      </div>
                    </div>

                    {/* Tier 3: Recessed Bottom Card */}
                    <div className="rfq-quote-card subtle tier-bottom">
                      <div className="rfq-q-top">
                        <span className="rfq-q-avatar">
                          <span className="rfq-q-dot" />
                        </span>
                        <div className="rfq-q-lines">
                          <span className="rfq-q-bar w1" />
                          <span className="rfq-q-bar w2 muted" />
                        </div>
                      </div>
                      <div className="rfq-q-meter">
                        <span className="rfq-q-fill f52" />
                      </div>
                    </div>
                  </div>
                </div>
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
                onClick={() => {
                  if (onPostRFQ) onPostRFQ()
                  else setModalOpen(true)
                }}
              >
                Post Your Requirement
                <ArrowRight size={17} strokeWidth={2.4} />
              </button>
              <button
                type="button"
                className="rfq-cta-secondary"
                onClick={() => {
                  if (onExplore) onExplore()
                  else nav.go('c_explore')
                }}
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
