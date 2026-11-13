import React, { useEffect, useRef, useState } from 'react'
import { Navbar } from './landing/Navbar.jsx'
import { Hero } from './landing/Hero.jsx'
import { ThreeBusinessJourneys } from './landing/ThreeBusinessJourneys.jsx'
import { IndustriesCarousel } from './landing/IndustriesCarousel.jsx'
import { GlobalGlobeSection } from './landing/GlobalGlobeSection.jsx'
import { HowItWorks } from './landing/HowItWorks.jsx'
import { RFQBanner } from './landing/RFQBanner.jsx'
import { Footer } from './landing/Footer.jsx'
import { PublicExploreView } from './landing/PublicExploreView.jsx'
import { PublicAboutView } from './landing/PublicAboutView.jsx'
import { PublicRfqView } from './landing/PublicRfqView.jsx'
import { PublicHelpView } from './landing/PublicHelpView.jsx'
import { LoginRequiredModal } from './landing/LoginRequiredModal.jsx'
import { useNav } from '../nav.jsx'
import { useApp } from '../store.jsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './website-home.css'

gsap.registerPlugin(ScrollTrigger)

export function WebsiteHome({ params = {} }) {
  const nav = useNav()
  const { me } = useApp()
  const shellRef = useRef(null)

  const [activeView, setActiveView] = useState(params.view || 'home')
  const [exploreParams, setExploreParams] = useState({
    type: 'all',
    category: '',
    location: '',
    q: '',
  })
  const [cartItems, setCartItems] = useState([
    { id: 'l1', title: 'Havells 1.5 sq mm Copper Wire', price: 1850, qty: 2 },
  ])
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  // Sync activeView with nav.params
  useEffect(() => {
    if (params.view && ['home', 'explore', 'about', 'rfq', 'help'].includes(params.view)) {
      setActiveView(params.view)
    }
  }, [params.view])

  // Sync activeView with URL hash or query params
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase()
      if (h.includes('#explore') || h.includes('view=explore')) setActiveView('explore')
      else if (h.includes('#about') || h.includes('view=about')) setActiveView('about')
      else if ((h.includes('#rfq') || h.includes('view=rfq')) && !h.includes('c_rfq_')) setActiveView('rfq')
      else if (h.includes('#help') || h.includes('view=help')) setActiveView('help')
      else if (h === '' || h === '#/' || h.includes('#home') || h === '#/c_home') setActiveView('home')
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Lenis smooth scrolling & GSAP entrance animations
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || activeView !== 'home') return

    let lenis = null
    let tickerFn = null
    const scrollerEl = shellRef.current?.closest('.vv-customer-route') || null

    if (scrollerEl) {
      ScrollTrigger.defaults({ scroller: scrollerEl })
    }

    const ctx = gsap.context(() => {
      gsap.from('.hero-entrance-item', {
        y: 16,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'transform',
      })
    }, shellRef)

    try {
      lenis = new Lenis({
        wrapper: scrollerEl || window,
        content: scrollerEl ? shellRef.current : document.documentElement,
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      lenis.on('scroll', ScrollTrigger.update)

      tickerFn = (time) => {
        lenis?.raf(time * 1000)
      }
      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)
    } catch {
      // Fallback cleanly to native browser scrolling
    }

    return () => {
      ctx.revert()
      if (tickerFn) gsap.ticker.remove(tickerFn)
      if (lenis) lenis.destroy()
    }
  }, [activeView])

  const handleNavigateView = (viewId) => {
    setActiveView(viewId)
    window.history.replaceState(null, '', `#/c_home?view=${viewId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleHeroSearch = ({ q, location, type }) => {
    setExploreParams({
      q: q || '',
      location: location || '',
      type: type || 'all',
      category: '',
    })
    handleNavigateView('explore')
  }

  const handleSelectJourney = (targetType) => {
    setExploreParams({
      type: targetType || 'all',
      category: '',
      location: '',
      q: '',
    })
    handleNavigateView('explore')
  }

  const handleNavigateCategory = (catTitle) => {
    setExploreParams({
      type: 'all',
      category: catTitle === 'all' ? '' : catTitle,
      location: '',
      q: '',
    })
    handleNavigateView('explore')
  }

  const handleNavigateCountry = (countryName) => {
    setExploreParams({
      type: 'all',
      category: '',
      location: countryName,
      q: '',
    })
    handleNavigateView('explore')
  }

  const handlePromptLogin = (actionPayload) => {
    setPendingAction(actionPayload)
    setLoginModalOpen(true)
  }

  const handleLoginSuccess = (fulfilledAction) => {
    if (fulfilledAction?.type === 'cart' && fulfilledAction.item) {
      setCartItems((prev) => [
        ...prev,
        {
          id: fulfilledAction.item.id,
          title: fulfilledAction.item.title,
          price: fulfilledAction.item.price,
          qty: 1,
        },
      ])
    }
  }

  const handleAddToCart = (item) => {
    setCartItems((prev) => [
      ...prev,
      { id: item.id, title: item.title, price: item.price, qty: 1 },
    ])
  }

  const handleOpenAuth = (mode = 'login') => {
    nav.go('auth', { mode })
  }

  const handleOpenVendorApply = () => {
    nav.go('v_home')
  }

  return (
    <div ref={shellRef} className="website-home-shell">
      {/* 1. Shared Light Sky-Glass Navbar across all 5 public pages */}
      <Navbar
        activeView={activeView}
        onNavigateView={handleNavigateView}
        onOpenAuth={handleOpenAuth}
        onOpenVendorApply={handleOpenVendorApply}
      />

      {/* Main Page Content based on Active Public View */}
      <main id="main-content">
        {activeView === 'home' && (
          <>
            {/* 2. Hero Section over Original Industrial MP4 Video */}
            <Hero
              onOpenVendorApply={handleOpenVendorApply}
              onSearch={handleHeroSearch}
              onExplore={() => handleNavigateView('explore')}
            />

            {/* 3. Three Distinct Business Journeys */}
            <ThreeBusinessJourneys onSelectJourney={handleSelectJourney} />

            {/* 4. Industries Section (True 3D Elliptical Orbit) */}
            <IndustriesCarousel onNavigateCategory={handleNavigateCategory} />

            {/* 5. Interactive 3D Earth Globe with Country-Specific Listing Connectivity */}
            <GlobalGlobeSection onNavigateCountry={handleNavigateCountry} />

            {/* 6. How VendorVerse Works (4 Steps + 3 Workflow Deep Dives) */}
            <HowItWorks />

            {/* 7. Light Sky-Blue Dimensional RFQ Banner */}
            <RFQBanner
              onPostRFQ={() => handleNavigateView('rfq')}
              onExplore={() => handleNavigateView('explore')}
            />
          </>
        )}

        {activeView === 'explore' && (
          <PublicExploreView
            initialType={exploreParams.type}
            initialCategory={exploreParams.category}
            initialLocation={exploreParams.location}
            initialQuery={exploreParams.q}
            onActionRequireLogin={handlePromptLogin}
            isLoggedIn={me.loggedIn}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeView === 'about' && (
          <PublicAboutView
            onExplore={() => handleNavigateView('explore')}
            onBecomeVendor={handleOpenVendorApply}
          />
        )}

        {activeView === 'rfq' && (
          <PublicRfqView
            onActionRequireLogin={handlePromptLogin}
            isLoggedIn={me.loggedIn}
          />
        )}

        {activeView === 'help' && <PublicHelpView />}
      </main>

      {/* 8. Clean Deep-Blue Contrast Footer */}
      <Footer
        onOpenVendorApply={handleOpenVendorApply}
        onNavigateView={handleNavigateView}
      />

      {/* 9. Login Required Modal for Guest Protected Actions */}
      <LoginRequiredModal
        isOpen={loginModalOpen}
        pendingAction={pendingAction}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
