import React, { useEffect, useState } from 'react'
import { MapPin, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react'
import { India3DCanvas } from './India3DCanvas.jsx'
import { MARKET_CITIES } from './indiaMapData.js'
import { useNav } from '../../nav.jsx'

// Regional editorial spotlight data synchronized with each active marketplace city.
const CITY_MARKET_HIGHLIGHTS = {
  jaipur: {
    heading: 'Jaipur, Rajasthan',
    focusArea: 'Home & Household, Construction & Events',
    industriesLine: 'Interiors • Civil Materials • Events • Professional Services',
    workflowLabel: 'Direct RFQ • Bookings • Purchase Orders',
    summary:
      'Browse core categories, submit structured requirements, and connect directly with service providers and suppliers operating in Jaipur.',
    image: '/images/city-jaipur.jpg',
    fallbackImg: '/images/industry-home.jpg',
    filterCategory: 'Home & Household',
  },
  ajmer: {
    heading: 'Ajmer, Rajasthan',
    focusArea: 'Construction Materials & Trade Supply',
    industriesLine: 'Stone & Marble • Civil Contractors • Wholesale • Household',
    workflowLabel: 'Bulk Inquiries • Quotes • Purchase Orders',
    summary:
      'Source construction materials, regional contractors, and wholesale supplies across Ajmer through structured RFQs and order tracking.',
    image: '/images/city-ajmer.jpg',
    fallbackImg: '/images/industry-construction.jpg',
    filterCategory: 'Construction',
  },
  sikar: {
    heading: 'Sikar, Rajasthan',
    focusArea: 'Construction, Fabrication & Wholesale',
    industriesLine: 'Structural Work • Warehousing • Bulk Packaging • Services',
    workflowLabel: 'Custom Quotes • Bookings • Direct Contracts',
    summary:
      'Coordinate regional sourcing, fabrication services, and bulk trade supply across Sikar with clear quotation comparisons.',
    image: '/images/city-sikar.jpg',
    fallbackImg: '/images/industry-wholesale.jpg',
    filterCategory: 'Construction',
  },
  delhi: {
    heading: 'Delhi NCR',
    focusArea: 'Enterprise Services, Events & Distribution',
    industriesLine: 'Professional Services • Fit-outs • Events • Wholesale',
    workflowLabel: 'Structured RFQs • Contracts • Purchase Orders',
    summary:
      'Discover business services, commercial contractors, and distribution partners serving teams across Delhi NCR.',
    image: '/images/city-delhi.jpg',
    fallbackImg: '/images/industry-professional.jpg',
    filterCategory: 'Professional Services',
  },
}

export function IndiaMapSection() {
  const nav = useNav()
  const [selectedCityId, setSelectedCityId] = useState('jaipur')

  useEffect(() => {
    Object.values(CITY_MARKET_HIGHLIGHTS).forEach((item) => {
      const img = new window.Image()
      img.src = item.image
    })
  }, [])

  const activeCity = MARKET_CITIES.find((c) => c.id === selectedCityId) || MARKET_CITIES[0]
  const spotlight = CITY_MARKET_HIGHLIGHTS[selectedCityId] || CITY_MARKET_HIGHLIGHTS.jaipur

  return (
    <section
      id="markets"
      className="india-map-section"
      aria-labelledby="map-section-title"
    >
      <div className="india-map-ambient-glow" aria-hidden="true" />

      <div className="section-container">
        <div className="map-ankorstore-grid">
          {/* LEFT: City Selection List */}
          <div className="map-left-col">
            <span className="eyebrow-tag dark">REGIONAL NETWORK</span>
            <h2 id="map-section-title" className="section-heading light">
              Explore Businesses Across Key Cities
            </h2>
            <p className="section-subcopy light">
              Discover service providers and business suppliers across Jaipur, Ajmer, Sikar,
              and Delhi NCR.
            </p>

            <div className="city-selector-list" role="tablist" aria-label="Select city">
              {MARKET_CITIES.map((city) => {
                const isActive = city.id === selectedCityId
                return (
                  <button
                    key={city.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`city-selector-row ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCityId(city.id)}
                  >
                    <div className="city-row-left">
                      <span className="city-pin-icon">
                        <MapPin size={18} strokeWidth={2.2} />
                      </span>
                      <div className="city-row-text">
                        <strong>{city.name}</strong>
                        <span className="city-row-sub">{city.tagline}</span>
                      </div>
                    </div>
                    <div className="city-row-right">
                      {isActive ? (
                        <span className="active-pill">Selected</span>
                      ) : (
                        <span className="state-mini">{city.state}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="map-expansion-note">
              <Globe2 size={14} strokeWidth={2.2} />
              <span>
                Dedicated regional operations across Jaipur, Ajmer, Sikar &amp; Delhi NCR.
              </span>
            </div>
          </div>

          {/* CENTER: Raised Interactive 3D India Map */}
          <div className="map-center-col">
            <div className="map-center-card">
              <India3DCanvas
                selectedCityId={selectedCityId}
                onSelectCity={setSelectedCityId}
              />
            </div>
          </div>

          {/* RIGHT: Floating Pure White City Spotlight Card */}
          <div className="map-right-col">
            <div className="featured-vendor-float-card">
              <div className="featured-card-header">
                <span className="featured-city-label">
                  <MapPin size={13} strokeWidth={2.3} />
                  Regional Spotlight
                </span>
                <span className="city-state-badge">{activeCity.state}</span>
              </div>

              <div className="featured-vendor-thumb-wrap">
                <img
                  src={spotlight.image}
                  alt={`${spotlight.heading} regional commerce overview`}
                  className="featured-vendor-thumb"
                  onError={(e) => {
                    e.currentTarget.src = spotlight.fallbackImg
                  }}
                />
              </div>

              <div className="featured-vendor-body">
                <div className="vendor-title-row">
                  <h3 className="vendor-name">{spotlight.heading}</h3>
                </div>
                <p className="vendor-subcat">{spotlight.focusArea}</p>

                <div className="vendor-meta-line">
                  <span className="vendor-mode-tag">
                    <CheckCircle2 size={14} strokeWidth={2.4} color="#0284C7" />
                    {spotlight.workflowLabel}
                  </span>
                </div>

                <div className="vendor-specs-list">
                  <div className="vendor-spec-item subtle">
                    <span>{spotlight.industriesLine}</span>
                  </div>
                </div>

                <p className="city-overview-note">{spotlight.summary}</p>

                <button
                  type="button"
                  className="view-business-btn"
                  onClick={() =>
                    nav.go('c_explore', {
                      city: activeCity.name,
                      category: spotlight.filterCategory,
                    })
                  }
                >
                  Explore {activeCity.name} <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
