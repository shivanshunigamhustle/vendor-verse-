import { useState, useEffect, useRef } from 'react'
import { useNav } from '../../nav.jsx'
import { useApp } from '../../store.jsx'

export function Navbar({ onOpenAuth, onOpenVendorApply }) {
  const nav = useNav()
  const { locale, setLocale, lang, setLang } = useApp()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [browseOpen, setBrowseOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)

  const headerRef = useRef(null)
  const browseRef = useRef(null)
  const solutionsRef = useRef(null)
  const langRef = useRef(null)
  const cityRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scroller = document.querySelector('.vv-customer-route')
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
      if (browseRef.current && !browseRef.current.contains(e.target)) setBrowseOpen(false)
      if (solutionsRef.current && !solutionsRef.current.contains(e.target)) setSolutionsOpen(false)
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleCitySelect = (cityName) => {
    setLocale((prev) => ({
      ...prev,
      city: cityName,
      state: cityName === 'Delhi NCR' ? 'Delhi' : 'Rajasthan',
      countryName: 'India',
    }))
    setCityOpen(false)
  }

  const navigateTo = (route, params = {}) => {
    setMobileMenuOpen(false)
    setBrowseOpen(false)
    setSolutionsOpen(false)
    nav.go(route, params)
  }

  return (
    <header
      ref={headerRef}
      className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}
      id="site-nav"
    >
      <div className="nav-inner-container">
        {/* Brand Logo */}
        <a
          href="#top"
          className="nav-brand-link"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          aria-label="VendorVerse Home"
        >
          <div className="brand-bag-icon" aria-hidden="true">
            <svg
              width="24"
              height="24"
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
          <div className="brand-title-wrap">
            <span className="brand-name">VendorVerse</span>
            <span className="brand-tagline">Global B2B Marketplace</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-menu" aria-label="Main Navigation">
          {/* Browse Dropdown */}
          <div className="nav-dropdown-item" ref={browseRef}>
            <button
              type="button"
              className={`nav-link-btn ${browseOpen ? 'open' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setBrowseOpen((v) => !v)
                setSolutionsOpen(false)
              }}
              aria-expanded={browseOpen}
            >
              Browse
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {browseOpen && (
              <div className="nav-dropdown-panel" role="menu">
                <a
                  href="#industries"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault()
                    setBrowseOpen(false)
                    document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span className="dropdown-icon">🏢</span>
                  <div>
                    <strong>Phase 1 Live Industries</strong>
                    <small>Home, Construction, Events, Professional, Wholesale</small>
                  </div>
                </a>
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => navigateTo('c_categories')}
                >
                  <span className="dropdown-icon">📂</span>
                  <div>
                    <strong>All Categories Directory</strong>
                    <small>Complete 30-industry B2B taxonomy</small>
                  </div>
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => navigateTo('c_explore')}
                >
                  <span className="dropdown-icon">🔍</span>
                  <div>
                    <strong>Explore Marketplace</strong>
                    <small>Search, filters & verified vendor listings</small>
                  </div>
                </button>
                <a
                  href="#markets"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault()
                    setBrowseOpen(false)
                    document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span className="dropdown-icon">📍</span>
                  <div>
                    <strong>Launch Cities</strong>
                    <small>Jaipur, Ajmer, Sikar, Delhi NCR</small>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div className="nav-dropdown-item" ref={solutionsRef}>
            <button
              type="button"
              className={`nav-link-btn ${solutionsOpen ? 'open' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setSolutionsOpen((v) => !v)
                setBrowseOpen(false)
              }}
              aria-expanded={solutionsOpen}
            >
              Solutions
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {solutionsOpen && (
              <div className="nav-dropdown-panel" role="menu">
                <a
                  href="#how"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault()
                    setSolutionsOpen(false)
                    document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span className="dropdown-icon">⚡</span>
                  <div>
                    <strong>For Buyers & Businesses</strong>
                    <small>Discover, compare &amp; request Phase 1 services</small>
                  </div>
                </a>
                <a
                  href="#rfq-section"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault()
                    setSolutionsOpen(false)
                    document.getElementById('rfq-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span className="dropdown-icon">📄</span>
                  <div>
                    <strong>Request for Quotation (RFQ)</strong>
                    <small>Post single requirement, get multiple bids</small>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* For Businesses */}
          <a
            href="#markets"
            className="nav-link-btn"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            For Businesses
          </a>

          {/* Become a Vendor */}
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => {
              if (onOpenVendorApply) onOpenVendorApply()
              else navigateTo('v_home')
            }}
          >
            Become a Vendor
          </button>

          {/* Help */}
          <a
            href="#how"
            className="nav-link-btn"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Help
          </a>
        </nav>

        {/* Right Actions: Lang, Country, Login, Join Now */}
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

          {/* Location / India Country Selector */}
          <div className="nav-dropdown-item" ref={cityRef}>
            <button
              type="button"
              className="action-icon-pill"
              onClick={(e) => {
                e.stopPropagation()
                setCityOpen((v) => !v)
              }}
              title="Launch Markets"
            >
              <span className="flag-icon">🇮🇳</span>
              <span>{locale?.city || 'Jaipur'}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {cityOpen && (
              <div className="nav-dropdown-panel small-panel" role="menu">
                <div className="panel-header-sub">Phase 1 Live Markets</div>
                {['Jaipur', 'Ajmer', 'Sikar', 'Delhi NCR'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`dropdown-item ${locale?.city === c ? 'active' : ''}`}
                    onClick={() => handleCitySelect(c)}
                  >
                    📍 {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Button */}
          <button
            type="button"
            className="nav-login-btn"
            onClick={() => {
              if (onOpenAuth) onOpenAuth('login')
              else navigateTo('auth', { mode: 'login' })
            }}
          >
            Login
          </button>

          {/* Join Now Button - Electric Violet */}
          <button
            type="button"
            className="nav-join-btn"
            onClick={() => {
              if (onOpenAuth) onOpenAuth('signup')
              else navigateTo('auth', { mode: 'signup' })
            }}
          >
            Join Now
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
            <a
              href="#industries"
              className="mobile-drawer-link"
              onClick={() => {
                setMobileMenuOpen(false)
                document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              🏢 Industries & Categories
            </a>
            <a
              href="#markets"
              className="mobile-drawer-link"
              onClick={() => {
                setMobileMenuOpen(false)
                document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              📍 Launch Markets (Jaipur, Ajmer, Sikar, Delhi NCR)
            </a>
            <a
              href="#how"
              className="mobile-drawer-link"
              onClick={() => {
                setMobileMenuOpen(false)
                document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              ⚡ How It Works
            </a>
            <a
              href="#rfq-section"
              className="mobile-drawer-link"
              onClick={() => {
                setMobileMenuOpen(false)
                document.getElementById('rfq-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              📄 Request for Quotation (RFQ)
            </a>
            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => {
                setMobileMenuOpen(false)
                if (onOpenVendorApply) onOpenVendorApply()
                else navigateTo('v_home')
              }}
            >
              💼 Become a Vendor
            </button>

            <div className="mobile-drawer-divider" />

            <div className="mobile-drawer-actions">
              <button
                type="button"
                className="nav-login-btn full-width"
                onClick={() => {
                  setMobileMenuOpen(false)
                  if (onOpenAuth) onOpenAuth('login')
                  else navigateTo('auth', { mode: 'login' })
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="nav-join-btn full-width"
                onClick={() => {
                  setMobileMenuOpen(false)
                  if (onOpenAuth) onOpenAuth('signup')
                  else navigateTo('auth', { mode: 'signup' })
                }}
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
