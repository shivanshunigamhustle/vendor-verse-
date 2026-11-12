import React, { useState } from 'react'
import { useNav } from '../../nav.jsx'
import { useApp } from '../../store.jsx'

const INTENT_TABS = [
  {
    id: 'products',
    label: 'Products & Suppliers',
    placeholder: 'What are you looking for?',
  },
  {
    id: 'services',
    label: 'Services',
    placeholder: 'What are you looking for?',
  },
  {
    id: 'businesses',
    label: 'Businesses',
    placeholder: 'What are you looking for?',
  },
]

const POPULAR_SEARCHES = [
  'Industrial Machinery',
  'Construction Materials',
  'Commercial Interiors',
  'Packaging Supplies',
  'Corporate Events',
  'Business Consulting',
]

const TRUST_BADGES = [
  {
    id: 'network',
    label: 'Global Marketplace Network',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
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
    label: 'Manage Orders & RFQs',
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
    id: 'onboarding',
    label: 'Structured Onboarding',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
]

const LOCATION_OPTIONS = [
  'India',
  'United States',
  'United Arab Emirates',
  'United Kingdom',
  'Singapore',
  'Germany',
  'Jaipur',
  'Ajmer',
  'Sikar',
  'Delhi NCR',
]

export function Hero({ onOpenVendorApply }) {
  const nav = useNav()
  const { locale, setLocale } = useApp()
  const [activeIntent, setActiveIntent] = useState('products')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(locale?.countryName || '')

  const currentTab = INTENT_TABS.find((t) => t.id === activeIntent) || INTENT_TABS[0]

  const resolveLocationParam = () => {
    if (!selectedLocation) return undefined
    return selectedLocation
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    nav.go('c_explore', {
      q: searchTerm.trim() || undefined,
      location: resolveLocationParam(),
      type: activeIntent,
    })
  }

  const handleSuggestionClick = (query) => {
    setSearchTerm(query)
    nav.go('c_explore', {
      q: query,
      location: resolveLocationParam(),
      type: activeIntent,
    })
  }

  return (
    <section className="hero-section" aria-label="VendorVerse Global Marketplace Hero">
      {/* Exact Original Industrial MP4 played full-bleed cleanly */}
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

      {/* Foreground Content without opaque blocking box */}
      <div className="hero-inner-container">
        <div className="hero-content-stage">
          {/* Global Eyebrow Pill */}
          <div className="hero-badge-pill hero-entrance-item" role="status">
            <span className="hero-status-dot" aria-hidden="true" />
            <span className="badge-text">YOUR GLOBAL BUSINESS MARKETPLACE</span>
          </div>

          {/* Display Headline */}
          <h1 className="hero-main-title hero-entrance-item">
            One World. <span className="hero-title-accent">Infinite</span>
            <br />
            Business Opportunities.
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle hero-entrance-item">
            Connect with suppliers, manufacturers and service providers across the globe. Discover
            opportunities, source smarter and build meaningful business partnerships.
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

        {/* Light Sky-Blue Unified Search Bar */}
        <form
          className="hero-search-dock hero-entrance-item"
          onSubmit={handleSubmit}
          role="search"
        >
          {/* Search Input */}
          <div className="search-field search-what-col">
            <span className="search-field-label">Search Marketplace</span>
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
                aria-label="What are you looking for?"
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

          {/* Country / Location Selector */}
          <div className="search-field search-location-col">
            <span className="search-field-label">Location</span>
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
                value={selectedLocation}
                onChange={(e) => {
                  const val = e.target.value
                  setSelectedLocation(val)
                  if (val) {
                    setLocale((prev) => ({ ...prev, countryName: val, city: val }))
                  }
                }}
                aria-label="Select country or location"
              >
                <option value="">Select country or location</option>
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Search Button */}
          <button type="submit" className="search-submit-btn" aria-label="Search">
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

        {/* Capabilities Strip */}
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
