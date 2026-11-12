import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useNav } from '../../nav.jsx'
import { TiltCard } from './TiltCard.jsx'

const CORE_INDUSTRIES = [
  {
    id: 'home',
    title: 'Home & Household',
    subtitle: 'Interiors, maintenance, appliances & services',
    image: '/images/industry-home.jpg',
  },
  {
    id: 'construction',
    title: 'Construction',
    subtitle: 'Contractors, materials, heavy equipment & fixtures',
    image: '/images/industry-construction.jpg',
  },
  {
    id: 'events',
    title: 'Events & Celebrations',
    subtitle: 'Venues, catering, production & decor teams',
    image: '/images/industry-events.jpg',
  },
  {
    id: 'professional',
    title: 'Professional Services',
    subtitle: 'Legal, CA/tax, IT systems & business consulting',
    image: '/images/industry-professional.jpg',
  },
  {
    id: 'wholesale',
    title: 'Wholesale & Distribution',
    subtitle: 'Bulk FMCG, trade packaging & regional supply',
    image: '/images/industry-wholesale.jpg',
  },
]

function getSlotClass(index, activeIndex) {
  const offset = index - activeIndex
  if (offset === 0) return 'slot-active'
  if (offset === -1) return 'slot-prev'
  if (offset === 1) return 'slot-next'
  return offset < 0 ? 'slot-far-prev' : 'slot-far-next'
}

export function IndustriesCarousel() {
  const nav = useNav()
  const trackRef = useRef(null)
  const slotRefs = useRef([])
  const rafScrollRef = useRef(null)
  const manualNavTimeoutRef = useRef(null)
  const isArrowScrollRef = useRef(false)

  const [activeIndex, setActiveIndex] = useState(0)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const syncIndexFromScroll = useCallback(() => {
    const track = trackRef.current
    const firstSlot = slotRefs.current[0]
    if (!track || !firstSlot || isArrowScrollRef.current) return

    const maxScroll = track.scrollWidth - track.clientWidth
    if (maxScroll <= 4) return

    const firstLeft = firstSlot.offsetLeft
    let closestIdx = 0
    let smallestDelta = Infinity

    slotRefs.current.forEach((slot, idx) => {
      if (!slot) return
      const slotOffset = slot.offsetLeft - firstLeft
      const delta = Math.abs(slotOffset - track.scrollLeft)
      if (delta < smallestDelta) {
        smallestDelta = delta
        closestIdx = idx
      }
    })

    setActiveIndex((prev) => (prev === closestIdx ? prev : closestIdx))
  }, [])

  const handleTrackScroll = useCallback(() => {
    if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current)
    rafScrollRef.current = requestAnimationFrame(syncIndexFromScroll)
  }, [syncIndexFromScroll])

  const releaseArrowLock = useCallback(() => {
    if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current)
    isArrowScrollRef.current = false
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const handleScrollEnd = () => {
      if (isArrowScrollRef.current) {
        if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current)
        manualNavTimeoutRef.current = setTimeout(() => {
          isArrowScrollRef.current = false
        }, 50)
      }
    }
    track.addEventListener('scrollend', handleScrollEnd)
    return () => {
      track.removeEventListener('scrollend', handleScrollEnd)
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current)
      if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current)
    }
  }, [])

  const scrollToIndex = (targetIdx) => {
    const clamped = Math.max(0, Math.min(CORE_INDUSTRIES.length - 1, targetIdx))
    setActiveIndex(clamped)

    const track = trackRef.current
    const firstSlot = slotRefs.current[0]
    const targetSlot = slotRefs.current[clamped]
    if (!track || !firstSlot || !targetSlot) return

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
    const exactCardOffset = targetSlot.offsetLeft - firstSlot.offsetLeft
    const desiredLeft = Math.min(maxScroll, Math.max(0, exactCardOffset))

    isArrowScrollRef.current = true
    if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current)
    manualNavTimeoutRef.current = setTimeout(() => {
      isArrowScrollRef.current = false
    }, 950)

    track.scrollTo({
      left: desiredLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  const scrollTrack = (direction) => {
    const delta = direction === 'next' ? 1 : -1
    scrollToIndex(activeIndex + delta)
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
            <span className="eyebrow-tag">CORE INDUSTRIES</span>
            <h2 id="industries-heading" className="section-heading dark">
              Industries on <span className="text-gradient">VendorVerse</span>
            </h2>
            <p className="section-subcopy">
              Browse five core industries connecting buyers with service providers and bulk
              suppliers across Jaipur, Ajmer, Sikar, and Delhi NCR.
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
            <div
              className="carousel-track-container"
              ref={trackRef}
              onScroll={handleTrackScroll}
              onWheel={releaseArrowLock}
              onTouchStart={releaseArrowLock}
              onPointerDown={releaseArrowLock}
            >
              {CORE_INDUSTRIES.map((industry, idx) => (
                <div
                  key={industry.id}
                  ref={(el) => {
                    slotRefs.current[idx] = el
                  }}
                  className={`industry-slide-slot ${getSlotClass(idx, activeIndex)}`}
                  onMouseEnter={() => {
                    if (!isArrowScrollRef.current) setActiveIndex(idx)
                  }}
                >
                  <TiltCard
                    className="industry-card-tilt-wrap"
                    maxTilt={6.5}
                    scale={1.03}
                    elevation={18}
                  >
                    <article
                      className="industry-card"
                      onClick={() => handleCardClick(industry)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Browse ${industry.title}`}
                      onFocus={() => scrollToIndex(idx)}
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
                </div>
              ))}
            </div>

            <button
              type="button"
              className="carousel-arrow-btn prev"
              onClick={() => scrollTrack('prev')}
              disabled={activeIndex === 0}
              aria-label="Scroll left through industries"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="carousel-arrow-btn next"
              onClick={() => scrollTrack('next')}
              disabled={activeIndex === CORE_INDUSTRIES.length - 1}
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
