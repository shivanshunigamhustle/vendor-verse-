import React, { useEffect, useState } from 'react'
import { MapPin, ArrowRight, Heart, CheckCircle2, Info, Sparkles } from 'lucide-react'
import { India3DCanvas } from './India3DCanvas.jsx'
import { LAUNCH_CITIES } from './indiaMapData.js'
import { useNav } from '../../nav.jsx'

// Illustrative Phase 1 preview listings synchronized with each launch market.
// Intentionally omits unverified ratings, review counts, and L0-L3 verification badges.
const DEMO_CITY_PREVIEWS = {
  jaipur: {
    title: 'Sample Listing in Jaipur',
    name: 'Jaipur Craft & Build Studio',
    category: 'Interior Design & Turnkey Execution',
    cityLabel: 'Jaipur, Rajasthan',
    tags: 'Residential • Commercial • Retail Fit-outs',
    modeLabel: 'Quotes & Site Visits',
    image: '/images/demo-vendor-jaipur.jpg',
    fallbackImg: '/images/industry-home.jpg',
    filterCategory: 'Home & Household',
  },
  ajmer: {
    title: 'Sample Listing in Ajmer',
    name: 'Aravalli Stone & Building Supply',
    category: 'Marble, Stone & Civil Materials',
    cityLabel: 'Ajmer, Rajasthan',
    tags: 'Flooring • Structural Supply • Trade Delivery',
    modeLabel: 'Bulk Inquiries & RFQ',
    image: '/images/demo-vendor-ajmer.jpg',
    fallbackImg: '/images/industry-construction.jpg',
    filterCategory: 'Construction',
  },
  sikar: {
    title: 'Sample Listing in Sikar',
    name: 'Shekhawati Steel & Fab Works',
    category: 'Industrial Sheds & Fabrication',
    cityLabel: 'Sikar, Rajasthan',
    tags: 'Warehousing • Metalwork • Contractor Support',
    modeLabel: 'Custom Quotations',
    image: '/images/demo-vendor-sikar.jpg',
    fallbackImg: '/images/industry-wholesale.jpg',
    filterCategory: 'Construction',
  },
  delhi: {
    title: 'Sample Listing in Delhi NCR',
    name: 'NorthGate Enterprise Solutions',
    category: 'Corporate Fit-outs & Business Supply',
    cityLabel: 'Delhi / NCR',
    tags: 'Offices • Facility Services • Bulk Procurement',
    modeLabel: 'Contracts & PO Ready',
    image: '/images/demo-vendor-delhi.jpg',
    fallbackImg: '/images/industry-professional.jpg',
    filterCategory: 'Professional Services',
  },
}

export function IndiaMapSection() {
  const nav = useNav()
  const [selectedCityId, setSelectedCityId] = useState('jaipur')
  const [favorites, setFavorites] = useState({})
  const [favToast, setFavToast] = useState('')

  useEffect(() => {
    Object.values(DEMO_CITY_PREVIEWS).forEach((item) => {
      const img = new window.Image()
      img.src = item.image
    })
  }, [])

  const activeCity = LAUNCH_CITIES.find((c) => c.id === selectedCityId) || LAUNCH_CITIES[0]
  const preview = DEMO_CITY_PREVIEWS[selectedCityId] || DEMO_CITY_PREVIEWS.jaipur
  const isFavorited = !!favorites[selectedCityId]

  const toggleFavorite = () => {
    const nextState = !favorites[selectedCityId]
    setFavorites((prev) => ({ ...prev, [selectedCityId]: nextState }))
    setFavToast(
      nextState ? 'Saved sample preview to shortlist' : 'Removed from shortlist'
    )
    setTimeout(() => setFavToast(''), 2400)
  }

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
            <span className="eyebrow-tag dark">PHASE 1 LAUNCH MARKETS</span>
            <h2 id="map-section-title" className="section-heading light">
              Explore Vendors Across Launch Cities
            </h2>
            <p className="section-subcopy light">
              Discover service providers and business suppliers across our Phase 1 launch
              markets in Rajasthan and Delhi NCR.
            </p>

            <div className="city-selector-list" role="tablist" aria-label="Phase 1 launch cities">
              {LAUNCH_CITIES.map((city) => {
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
                        <span className="active-pill">Live</span>
                      ) : (
                        <span className="state-mini">{city.state}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="map-expansion-note">
              <Info size={14} strokeWidth={2.2} />
              <span>
                Phase 1 rollout is active exclusively in Jaipur, Ajmer, Sikar &amp; Delhi NCR.
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

          {/* RIGHT: Floating Pure White Featured Demo Listing Card */}
          <div className="map-right-col">
            <div className="featured-vendor-float-card">
              <div className="featured-card-header">
                <span className="featured-city-label">
                  <Sparkles size={13} strokeWidth={2.3} />
                  {preview.title}
                </span>
                <span className="demo-listing-badge">Demo Listing</span>
              </div>

              <div className="featured-vendor-thumb-wrap">
                <img
                  src={preview.image}
                  alt={`${preview.name} preview in ${activeCity.name}`}
                  className="featured-vendor-thumb"
                  onError={(e) => {
                    e.currentTarget.src = preview.fallbackImg
                  }}
                />
                <button
                  type="button"
                  className={`fav-heart-btn ${isFavorited ? 'liked' : ''}`}
                  aria-label="Save demo vendor to shortlist"
                  onClick={toggleFavorite}
                >
                  <Heart size={18} fill={isFavorited ? '#0284C7' : 'none'} />
                </button>
                {favToast && <div className="fav-toast">{favToast}</div>}
              </div>

              <div className="featured-vendor-body">
                <div className="vendor-title-row">
                  <h3 className="vendor-name">{preview.name}</h3>
                </div>
                <p className="vendor-subcat">{preview.category}</p>

                <div className="vendor-meta-line">
                  <span className="vendor-mode-tag">
                    <CheckCircle2 size={14} strokeWidth={2.4} color="#0284C7" />
                    {preview.modeLabel}
                  </span>
                </div>

                <div className="vendor-specs-list">
                  <div className="vendor-spec-item">
                    <MapPin size={14} strokeWidth={2.2} color="#0284C7" />
                    <span>{preview.cityLabel}</span>
                  </div>
                  <div className="vendor-spec-item subtle">
                    <span>{preview.tags}</span>
                  </div>
                </div>

                <p className="demo-disclaimer-note">
                  Illustrative marketplace profile for {activeCity.name} launch discovery.
                </p>

                <button
                  type="button"
                  className="view-business-btn"
                  onClick={() =>
                    nav.go('c_explore', {
                      city: activeCity.name,
                      category: preview.filterCategory,
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
