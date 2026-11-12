import React, { useState } from 'react'
import { useNav } from '../../nav.jsx'
import { useApp } from '../../store.jsx'

const INTENT_TABS = [
  {
    id: 'services',
    label: 'Services',
    placeholder: 'Search contractors, interior fitouts, event planners, IT services...',
  },
  {
    id: 'products',
    label: 'Products & Suppliers',
    placeholder: 'Search steel, cement, electrical wholesale, packaging supplies...',
  },
  {
    id: 'businesses',
    label: 'Businesses',
    placeholder: 'Search businesses and partners across Jaipur, Ajmer, Sikar, and Delhi NCR...',
  },
]

const POPULAR_SEARCHES = [
  'Interior Fitouts',
  'TMT Steel',
  'Industrial Fabrication',
  'Deep Cleaning',
  'Logistics Fleet',
  'Civil Contractors',
]

const TRUST_BADGES = [
  {
    id: 'onboarding',
    label: 'Structured Onboarding',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'compare',
    label: 'Compare Quotations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 2 7l10 5 10-5-10-5z" />
        <path d="m2 17 10 5 10-5" />
        <path d="m2 12 10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'book',
    label: 'Book Services',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    id: 'contracts',
    label: 'Manage Contracts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 15h6M9 11h6" />
      </svg>
    ),
  },
  {
    id: 'industries',
    label: '5 Core Industries',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'network',
    label: '4 Key Cities',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
      </svg>
    ),
  },
]

const MARKET_OPTIONS = ['Jaipur', 'Ajmer', 'Sikar', 'Delhi NCR', 'All Cities']

export function Hero({ onOpenVendorApply }) {
  const nav = useNav()
  const { locale, setLocale } = useApp()
  const [activeIntent, setActiveIntent] = useState('services')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(locale?.city || 'Jaipur')

  const currentTab = INTENT_TABS.find((t) => t.id === activeIntent) || INTENT_TABS[0]

  const resolveCityParam = () => {
    if (selectedCity === 'All Cities') return undefined
    return selectedCity
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    nav.go('c_explore', {
      q: searchTerm.trim() || undefined,
      location: resolveCityParam(),
      type: activeIntent,
    })
  }

  const handleSuggestionClick = (query) => {
    setSearchTerm(query)
    nav.go('c_explore', {
      q: query,
      location: resolveCityParam(),
      type: activeIntent,
    })
  }

  return (
    <section className="hero-section" aria-label="VendorVerse Marketplace Hero">
      {/* Original MP4 Video played full-frame at natural brightness */}
      <div className="hero-media-layer" aria-hidden="true">
        <video
          className="hero-bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/vendorverse-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-contrast-overlay" />
      </div>

      {/* Foreground Content rendered cleanly directly over open video */}
      <div className="hero-inner-container">
        <div className="hero-content-stage">
          {/* Regional Coverage Pill */}
          <div className="hero-badge-pill hero-entrance-item" role="status">
            <span className="hero-status-dot" aria-hidden="true" />
            <span className="badge-text">
              Jaipur &bull; Ajmer &bull; Sikar &bull; Delhi NCR
            </span>
          </div>

          {/* Display Headline */}
          <h1 className="hero-main-title hero-entrance-item">
            Find the Right <span className="hero-title-accent">Partner.</span>
            <br />
            Build. Source. Grow.
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle hero-entrance-item">
            Connect with regional service providers, bulk suppliers, and B2B businesses across
            Jaipur, Ajmer, Sikar, and Delhi NCR. Compare quotations, request services, and coordinate
            directly&mdash;all in one place.
          </p>

          {/* Dual CTAs */}
          <div className="hero-cta-row hero-entrance-item">
            <button
              type="button"
              className="hero-primary-btn"
              onClick={() => nav.go('c_explore')}
            >
              Explore Marketplace
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => {
                if (onOpenVendorApply) onOpenVendorApply()
                else nav.go('v_home')
              }}
            >
              Become a Vendor
            </button>
          </div>
        </div>

        {/* Search Intent Tabs */}
        <div className="search-intent-tabs hero-entrance-item" role="tablist" aria-label="Search intent">
          {INTENT_TABS.map((tab) => {
            const isActive = tab.id === activeIntent
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`intent-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIntent(tab.id)}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Unified Floating Sky-Blue Search Bar */}
        <form
          className="hero-search-dock hero-entrance-item"
          onSubmit={handleSubmit}
          role="search"
        >
          {/* Search Input */}
          <div className="search-field search-what-col">
            <span className="search-field-label">What are you looking for?</span>
            <div className="search-field-input-row">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                className="search-text-input"
                placeholder={currentTab.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search query"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-input-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search query"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          <div className="search-vertical-divider" aria-hidden="true" />

          {/* Location Selector */}
          <div className="search-field search-location-col">
            <span className="search-field-label">Where do you need it?</span>
            <div className="search-field-input-row">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <select
                className="search-location-select"
                value={selectedCity}
                onChange={(e) => {
                  const val = e.target.value
                  setSelectedCity(val)
                  if (MARKET_OPTIONS.includes(val) && val !== 'All Cities') {
                    setLocale((prev) => ({ ...prev, city: val }))
                  }
                }}
                aria-label="Location selector"
              >
                <option value="Jaipur">Jaipur, Rajasthan</option>
                <option value="Ajmer">Ajmer, Rajasthan</option>
                <option value="Sikar">Sikar, Rajasthan</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="All Cities">All Cities</option>
              </select>
            </div>
          </div>

          {/* Submit Search Button */}
          <button type="submit" className="search-submit-btn" aria-label="Submit search">
            Search
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        {/* Popular Search Suggestions */}
        <div className="hero-search-suggestions hero-entrance-item">
          <span className="suggestions-label">Popular:</span>
          <div className="suggestions-pills-row">
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                className="suggestion-pill"
                onClick={() => handleSuggestionClick(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Strip */}
        <div className="hero-trust-strip" role="list" aria-label="Key marketplace highlights">
          {TRUST_BADGES.map((b) => (
            <div key={b.id} className="trust-badge-item" role="listitem">
              <span className="trust-icon" aria-hidden="true">
                {b.icon}
              </span>
              <span className="trust-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
