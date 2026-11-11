import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useNav } from '../../nav.jsx'
import { TiltCard } from './TiltCard.jsx'

const LIVE_INDUSTRIES = [
  {
    id: 'home',
    title: 'Home & Household',
    subtitle: 'Interiors, maintenance, appliances & services',
    image: '/images/industry-home.jpg',
    badge: 'Live',
  },
  {
    id: 'construction',
    title: 'Construction',
    subtitle: 'Contractors, materials, heavy equipment & fixtures',
    image: '/images/industry-construction.jpg',
    badge: 'Live',
  },
  {
    id: 'events',
    title: 'Events & Celebrations',
    subtitle: 'Venues, catering, production & decor teams',
    image: '/images/industry-events.jpg',
    badge: 'Live',
  },
  {
    id: 'professional',
    title: 'Professional Services',
    subtitle: 'Legal, CA/tax, IT systems & business consulting',
    image: '/images/industry-professional.jpg',
    badge: 'Live',
  },
  {
    id: 'wholesale',
    title: 'Wholesale & Distribution',
    subtitle: 'Bulk FMCG, trade packaging & regional supply',
    image: '/images/industry-wholesale.jpg',
    badge: 'Live',
  },
]

export function IndustriesCarousel() {
  const nav = useNav()
  const trackRef = useRef(null)

  const scrollTrack = (direction) => {
    if (!trackRef.current) return
    const step = 300
    trackRef.current.scrollBy({
      left: direction === 'next' ? step : -step,
      behavior: 'smooth',
    })
  }

  const handleCardClick = (industry) => {
    nav.go('c_explore', {
      category: industry.title,
    })
  }

  return (
    <section
      id="industries"
      className="industries-section"
      aria-labelledby="industries-heading"
    >
      <div className="section-container">
        <div className="industries-split-layout">
          {/* LEFT EDITORIAL COLUMN */}
          <div className="industries-left-intro">
            <span className="eyebrow-tag">PHASE 1 LIVE CATEGORIES</span>
            <h2 id="industries-heading" className="section-heading dark">
              Industries on <span className="text-gradient">VendorVerse</span>
            </h2>
            <p className="section-subcopy">
              Browse five core categories active at launch—connecting buyers with service
              providers and bulk suppliers across Jaipur, Ajmer, Sikar, and Delhi NCR.
            </p>
            <div className="industries-cta-wrap">
              <button
                type="button"
                className="outline-sky-btn"
                onClick={() => nav.go('c_categories')}
              >
                Explore All Industries
                <ArrowRight size={17} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* RIGHT INTERACTIVE 3D CAROUSEL COLUMN */}
          <div className="industries-right-carousel">
            <div className="carousel-track-container" ref={trackRef}>
              {LIVE_INDUSTRIES.map((industry) => (
                <TiltCard
                  key={industry.id}
                  className="industry-card-tilt-wrap"
                  maxTilt={8}
                  scale={1.035}
                  elevation={20}
                >
                  <article
                    className="industry-card"
                    onClick={() => handleCardClick(industry)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Browse ${industry.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCardClick(industry)
                      }
                    }}
                  >
                    <div className="industry-card-media">
                      <img
                        src={industry.image}
                        alt={industry.title}
                        loading="eager"
                        className="industry-card-img"
                      />
                      <span className="industry-live-badge">
                        <span className="live-dot-tiny" aria-hidden="true" />
                        {industry.badge}
                      </span>
                    </div>

                    <div className="industry-card-caption">
                      <h3 className="industry-card-title">{industry.title}</h3>
                      <p className="industry-card-sub">{industry.subtitle}</p>
                      <span className="industry-card-link">
                        Browse category <ArrowRight size={14} strokeWidth={2.3} />
                      </span>
                    </div>
                  </article>
                </TiltCard>
              ))}
            </div>

            <button
              type="button"
              className="carousel-arrow-btn prev"
              onClick={() => scrollTrack('prev')}
              aria-label="Scroll left through industries"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="carousel-arrow-btn next"
              onClick={() => scrollTrack('next')}
              aria-label="Scroll right through industries"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
