import React, { useEffect, useRef } from 'react'
import { Navbar } from './landing/Navbar.jsx'
import { Hero } from './landing/Hero.jsx'
import { IndustriesCarousel } from './landing/IndustriesCarousel.jsx'
import { IndiaMapSection } from './landing/IndiaMapSection.jsx'
import { HowItWorks } from './landing/HowItWorks.jsx'
import { RFQBanner } from './landing/RFQBanner.jsx'
import { Footer } from './landing/Footer.jsx'
import { useNav } from '../nav.jsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './website-home.css'

gsap.registerPlugin(ScrollTrigger)

export function WebsiteHome() {
  const nav = useNav()
  const shellRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

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
  }, [])

  const handleOpenAuth = (mode = 'login') => {
    nav.go('auth', { mode })
  }

  const handleOpenVendorApply = () => {
    nav.go('v_home')
  }

  return (
    <div ref={shellRef} className="website-home-shell">
      {/* 1. Transparent Sky-Glass Navbar */}
      <Navbar onOpenAuth={handleOpenAuth} onOpenVendorApply={handleOpenVendorApply} />

      {/* Main Page Sections */}
      <main id="main-content">
        {/* 2. Hero Section over Bright Full-Bleed MP4 Video */}
        <Hero onOpenVendorApply={handleOpenVendorApply} />

        {/* 3. Explore Industries Section (3D Tactile Photography Cards) */}
        <IndustriesCarousel />

        {/* 4. Interactive 3D India Map across Key Cities */}
        <IndiaMapSection />

        {/* 5. How VendorVerse Works (4 Dimensional Steps + Platform Highlights) */}
        <HowItWorks />

        {/* 6. Post a Requirement / RFQ Highlight Section */}
        <RFQBanner />
      </main>

      {/* 7. Comprehensive Midnight Navy Footer */}
      <Footer onOpenVendorApply={handleOpenVendorApply} />
    </div>
  )
}
