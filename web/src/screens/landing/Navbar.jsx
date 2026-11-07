import { useState, useEffect, useRef } from 'react'
import { useNav } from '../../nav.jsx'
import { useApp } from '../../store.jsx'

const LOCATIONS = [
  { city: 'Jaipur', state: 'Rajasthan', country: 'India', label: 'Jaipur, Rajasthan, India' },
  { city: 'Mumbai', state: 'Maharashtra', country: 'India', label: 'Mumbai, Maharashtra, India' },
  { city: 'Pune', state: 'Maharashtra', country: 'India', label: 'Pune, Maharashtra, India' },
  { city: 'Bengaluru', state: 'Karnataka', country: 'India', label: 'Bengaluru, Karnataka, India' },
]

export function Navbar({ activeTab = 'home', onSelectTab }) {
  const nav = useNav()
  const { me, setMe, locale, setLocale, lang, setLang } = useApp()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const headerRef = useRef(null)
  const locRef = useRef(null)
  const locBtnRef = useRef(null)

  // Scroll listener for sticky soft shadow
  useEffect(() => {
    const scrollContainer = headerRef.current?.closest('.vv-customer-route')
    const getScrollTop = () => {
      if (scrollContainer) {
        return scrollContainer.scrollTop
      }
      return window.scrollY || document.documentElement.scrollTop || 0
    }

    const handleScroll = () => {
      setIsScrolled(getScrollTop() > 8)
    }

    handleScroll()
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    }
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true })

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('scroll', handleScroll, { capture: true })
    }
  }, [])

  // Close location dropdown on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (locRef.current && !locRef.current.contains(e.target)) {
        setLocationOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && locationOpen) {
        setLocationOpen(false)
        locBtnRef.current?.focus()
      }
    }
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [locationOpen])

  const currentLocationLabel = locale?.city
    ? `${locale.city}, ${locale.state || ''}, ${locale.countryName || 'India'}`
    : 'Jaipur, Rajasthan, India'

  const handleSelectLocation = (loc) => {
    setLocale((prev) => ({
      ...prev,
      city: loc.city,
      state: loc.state,
      countryName: loc.country,
    }))
    setLocationOpen(false)
    locBtnRef.current?.focus()
  }

  const handleTabClick = (e, tabId, routeId) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onSelectTab) {
      onSelectTab(tabId)
    }
    if (routeId) {
      if (tabId === 'home') {
        nav.reset('c_home')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        nav.go(routeId)
      }
    }
  }

  return (
    <header ref={headerRef} className={`vvhead ${isScrolled ? 'scrolled' : ''}`} id="vvhead">
      <div className="vvin">
        {/* Brand Logo */}
        <a
          className="brand"
          href="#top"
          onClick={(e) => handleTabClick(e, 'home', 'c_home')}
          aria-label="VendorVerse home"
        >
          <span className="logo">V</span>
          <span className="bt">
            <b>VendorVerse</b>
            <small>Global B2B Marketplace</small>
          </span>
        </a>

        {/* Navigation Tray */}
        <nav
          className={`vvnav ${mobileMenuOpen ? 'open' : ''}`}
          id="vvnav"
          aria-label="Main navigation"
        >
          <a
            className={`vvl ${activeTab === 'home' ? 'on' : ''}`}
            href="#top"
            aria-current={activeTab === 'home' ? 'page' : undefined}
            onClick={(e) => handleTabClick(e, 'home', 'c_home')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 11 12 3l9 8" />
              <path d="M5 10v10h14V10" />
            </svg>
            Home
          </a>

          <a
            className={`vvl ${activeTab === 'explore' ? 'on' : ''}`}
            href="#categories"
            aria-current={activeTab === 'explore' ? 'page' : undefined}
            onClick={(e) => handleTabClick(e, 'explore', 'c_explore')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m15.5 8.5-2 5-5 2 2-5z" />
            </svg>
            Explore
          </a>

          <a
            className={`vvl ${activeTab === 'activity' ? 'on' : ''}`}
            href="#vendors"
            aria-current={activeTab === 'activity' ? 'page' : undefined}
            onClick={(e) => handleTabClick(e, 'activity', 'c_activity')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 3v18h18" />
              <path d="m7 15 4-4 3 3 5-6" />
            </svg>
            Activity
          </a>

          <a
            className={`vvl ${activeTab === 'messages' ? 'on' : ''}`}
            href="#how"
            aria-current={activeTab === 'messages' ? 'page' : undefined}
            onClick={(e) => handleTabClick(e, 'messages', 'messages')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a8 8 0 0 1-11.7 7L4 20l1.2-4.6A8 8 0 1 1 21 12z" />
            </svg>
            Messages
          </a>

          <a
            className={`vvl ${activeTab === 'profile' ? 'on' : ''}`}
            href="#top"
            aria-current={activeTab === 'profile' ? 'page' : undefined}
            onClick={(e) => handleTabClick(e, 'profile', 'c_profile')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
            Profile
          </a>
        </nav>

        {/* Right Section Controls */}
        <div className="vvright">
          {/* Location button & panel */}
          <div className="locwrap" ref={locRef}>
            <button
              className="vvloc"
              id="locbtn"
              ref={locBtnRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setLocationOpen((prev) => !prev)
              }}
              aria-haspopup="listbox"
              aria-expanded={locationOpen}
              aria-controls="locpanel"
              aria-label={`Location: ${currentLocationLabel}`}
              title={currentLocationLabel}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {locationOpen && (
              <div
                className="locpanel"
                id="locpanel"
                role="listbox"
                aria-label="Choose location"
              >
                <div className="lochead">Your location</div>
                {LOCATIONS.slice(0, 1).map((loc) => {
                  const isSelected = currentLocationLabel.includes(loc.city)
                  return (
                    <button
                      key={loc.city}
                      type="button"
                      className={`locopt ${isSelected ? 'sel' : ''}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectLocation(loc)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      <span>{loc.label}</span>
                      <svg
                        className="chk"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    </button>
                  )
                })}

                <div className="lochead">Other locations</div>
                {LOCATIONS.slice(1).map((loc) => {
                  const isSelected = currentLocationLabel.includes(loc.city)
                  return (
                    <button
                      key={loc.city}
                      type="button"
                      className={`locopt ${isSelected ? 'sel' : ''}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectLocation(loc)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      <span>{loc.label}</span>
                      <svg
                        className="chk"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            className="vvicon"
            type="button"
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            aria-label={`Language: ${lang === 'en' ? 'English' : 'Hindi'}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
            </svg>
            <span>{lang === 'en' ? 'EN' : 'हि'}</span>
          </button>

          {/* Notifications with Pulsing Red Dot */}
          <button
            className="vvicon bell"
            type="button"
            onClick={() => nav.go('notifications')}
            aria-label="Notifications, new"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z" />
              <path d="M10 21h4" />
            </svg>
            <i className="dot" aria-hidden="true" />
          </button>

          {/* Outlined "Post requirement" button */}
          <button
            className="vvghost"
            type="button"
            onClick={() => nav.go('c_rfq_new')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Post requirement
          </button>

          {/* Gradient "Sign in" button */}
          {me?.loggedIn ? (
            <button
              className="vvbtn"
              type="button"
              onClick={() => {
                setMe({ role: null, loggedIn: false, guest: false, vendorId: 'v-me', name: '' })
                nav.reset('c_home')
              }}
              title="Click to sign out"
            >
              Sign out
            </button>
          ) : (
            <button
              className="vvbtn"
              type="button"
              onClick={() => nav.go('login')}
            >
              Sign in
            </button>
          )}

          {/* Hamburger button for mobile */}
          <button
            className="burger"
            id="burger"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="vvnav"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
