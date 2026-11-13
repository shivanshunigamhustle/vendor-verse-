import { useState, useEffect, useRef } from 'react'
import { useNav } from '../../nav.jsx'
import { useApp } from '../../store.jsx'
import '../website-home.css'

export function Navbar({
  activeView = 'home',
  onNavigateView,
  onOpenAuth,
  onOpenVendorApply,
}) {
  const nav = useNav()
  const { locale, setLocale, lang, setLang } = useApp()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)

  const headerRef = useRef(null)
  const langRef = useRef(null)
  const cityRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scroller = document.querySelector('.vv-customer-route') || document.querySelector('.vv-screen-scroll') || document.documentElement
      const y = (scroller ? scroller.scrollTop : 0) || window.scrollY || 0
      setIsScrolled(y > 15)
    }
    handleScroll()
    document.addEventListener('scroll', handleScroll, true)
    return () => document.removeEventListener('scroll', handleScroll, true)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleCitySelect = (locationName) => {
    const mapRegion = {
      Global: { state: 'Global Network', countryName: 'Global' },
      India: { state: 'Rajasthan & Delhi NCR', countryName: 'India' },
      'United States': { state: 'North America', countryName: 'United States' },
      'United Arab Emirates': { state: 'Middle East', countryName: 'United Arab Emirates' },
      'United Kingdom': { state: 'Europe', countryName: 'United Kingdom' },
      Singapore: { state: 'Southeast Asia', countryName: 'Singapore' },
      Germany: { state: 'Europe', countryName: 'Germany' },
    }
    const meta = mapRegion[locationName] || { state: 'Global Network', countryName: locationName }
    setLocale((prev) => ({
      ...prev,
      city: locationName,
      state: meta.state,
      countryName: meta.countryName,
    }))
    setCityOpen(false)
  }

  const handleNavClick = (viewId) => {
    setMobileMenuOpen(false)
    if (onNavigateView) {
      onNavigateView(viewId)
    } else {
      nav.go('c_home', { view: viewId })
    }
    if (viewId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const NAV_ITEMS = [
    { id: 'home', label: 'HOME' },
    { id: 'explore', label: 'EXPLORE' },
    { id: 'about', label: 'ABOUT' },
    { id: 'rfq', label: 'RFQ' },
    { id: 'help', label: 'HELP' },
  ]

  return (
    <header
      ref={headerRef}
      className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}
      id="site-nav"
    >
      <div className="nav-inner-container">
        {/* Brand Logo: White shopping bag rotating continuously while blue box & wordmark remain stationary */}
        <a
          href="#top"
          className="nav-brand-link"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('home')
          }}
          aria-label="VendorVerse Home"
        >
          <div className="brand-bag-icon" aria-hidden="true">
            <div className="brand-bag-rotator">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="brand-v-glyph">V</span>
            </div>
          </div>
          <div className="brand-title-wrap">
            <span className="brand-name">VendorVerse</span>
            <span className="brand-tagline">Global Marketplace</span>
          </div>
        </a>

        {/* Desktop 5 Primary Navigation Items */}
        <nav className="desktop-nav-menu" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Right Actions: Lang, Country, Cart, Login, Join Now */}
        <div className="nav-right-actions">
          {/* Language Selector */}
          <div className="nav-dropdown-item" ref={langRef}>
            <button
              type="button"
              className="action-icon-pill"
              onClick={(e) => {
                e.stopPropagation()
                setLangOpen((v) => !v)
              }}
              title="Change Language"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{lang?.toUpperCase() || 'EN'}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {langOpen && (
              <div className="nav-dropdown-panel small-panel" role="menu">
                <button
                  type="button"
                  className={`dropdown-item ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => {
                    setLang('en')
                    setLangOpen(false)
                  }}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${lang === 'hi' ? 'active' : ''}`}
                  onClick={() => {
                    setLang('hi')
                    setLangOpen(false)
                  }}
                >
                  हिन्दी (HI)
                </button>
              </div>
            )}
          </div>

          {/* Location / Global Market Selector */}
          <div className="nav-dropdown-item" ref={cityRef}>
            <button
              type="button"
              className="action-icon-pill"
              onClick={(e) => {
                e.stopPropagation()
                setCityOpen((v) => !v)
              }}
              title="Select Country or Location"
            >
              <span className="flag-icon" aria-hidden="true">🌐</span>
              <span>{locale?.countryName || locale?.city || 'Global'}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {cityOpen && (
              <div className="nav-dropdown-panel small-panel" role="menu">
                <div className="panel-header-sub">Select Location</div>
                {['Global', 'India', 'United States', 'United Arab Emirates', 'United Kingdom', 'Singapore', 'Germany'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    className={`dropdown-item ${(locale?.countryName || locale?.city) === loc ? 'active' : ''}`}
                    onClick={() => handleCitySelect(loc)}
                  >
                    📍 {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Button */}
          <button
            type="button"
            className={`nav-login-btn ${(activeView === 'login' || nav.id === 'login' || (nav.id === 'auth' && nav.params?.mode === 'login')) ? 'active-btn' : ''}`}
            onClick={() => {
              if (onOpenAuth) {
                onOpenAuth('login')
              } else if (nav.id !== 'login') {
                nav.go('login')
              }
            }}
          >
            Login
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
          <div className="mobile-drawer-inner">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mobile-drawer-link ${activeView === item.id ? 'font-bold text-sky-600' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}

            <div className="mobile-drawer-divider" />

            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-bold text-slate-500">LOCATION</span>
              <span className="text-xs font-semibold text-slate-800">
                🌐 {locale?.countryName || locale?.city || 'Global'}
              </span>
            </div>

            <div className="mobile-drawer-actions">
              <button
                type="button"
                className="nav-login-btn full-width"
                onClick={() => {
                  setMobileMenuOpen(false)
                  if (onOpenAuth) onOpenAuth('login')
                  else if (nav.id !== 'login') nav.go('login')
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
