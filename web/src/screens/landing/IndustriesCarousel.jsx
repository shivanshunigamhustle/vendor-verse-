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

function getCircularOffset(idx, activeIdx, total) {
  let offset = idx - activeIdx
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total
  return offset
}

function getSlotClass(offset) {
  if (offset === 0) return 'slot-active'
  if (offset === -1) return 'slot-prev'
  if (offset === 1) return 'slot-next'
  return offset < 0 ? 'slot-far-prev' : 'slot-far-next'
}

export function IndustriesCarousel() {
  const nav = useNav()
  const stageRef = useRef(null)
  const regionRef = useRef(null)
  const dragStateRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    deltaX: 0,
    hasMoved: false,
  })

  // Start centered on Construction (index 1) so left/center/right 3D depth is visible immediately
  const [activeIndex, setActiveIndex] = useState(1)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(true)
  const [isCompactStage, setIsCompactStage] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const total = CORE_INDUSTRIES.length
  const prevOffsetsRef = useRef(CORE_INDUSTRIES.map((_, idx) => getCircularOffset(idx, 1, total)))

  useEffect(() => {
    const updateEnv = () => {
      if (typeof window !== 'undefined') {
        setIsCompactStage(window.innerWidth <= 640)
        setPrefersReducedMotion(
          Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches),
        )
      }
    }
    updateEnv()
    window.addEventListener('resize', updateEnv)
    return () => window.removeEventListener('resize', updateEnv)
  }, [])

  // Pause auto-loop when carousel is offscreen
  useEffect(() => {
    const el = regionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setIsInView(entries[0].isIntersecting)
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Keep previous circular offsets updated after each committed activeIndex change
  useEffect(() => {
    prevOffsetsRef.current = CORE_INDUSTRIES.map((_, idx) =>
      getCircularOffset(idx, activeIndex, total),
    )
  }, [activeIndex, total])

  const goToIndex = useCallback(
    (targetIdx) => {
      const wrapped = ((targetIdx % total) + total) % total
      setActiveIndex(wrapped)
    },
    [total],
  )

  const scrollTrack = useCallback(
    (direction) => {
      const delta = direction === 'next' ? 1 : -1
      setActiveIndex((prev) => (((prev + delta) % total) + total) % total)
    },
    [total],
  )

  // Continuous seamless 3D sliding loop while visible and idle
  useEffect(() => {
    if (prefersReducedMotion || isPaused || isDragging || !isInView) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [prefersReducedMotion, isPaused, isDragging, isInView, total])

  const handleCardActivate = (industry, idx) => {
    // Prevent accidental click right after dragging
    if (dragStateRef.current.hasMoved) return
    if (idx !== activeIndex) {
      goToIndex(idx)
      return
    }
    nav.go('c_explore', {
      category: industry.title,
    })
  }

  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return
    // Do not hijack direct button clicks on controls
    if (e.target.closest('.carousel-arrow-btn') || e.target.closest('.carousel-dot-btn')) return
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      deltaX: 0,
      hasMoved: false,
    }
    setIsDragging(true)
    setDragOffsetPx(0)
  }

  const handlePointerMove = (e) => {
    const d = dragStateRef.current
    if (!d.active) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 0.85) {
      d.hasMoved = true
      d.deltaX = dx
      setDragOffsetPx(Math.max(-180, Math.min(180, dx)))
    }
  }

  const handlePointerEnd = () => {
    const d = dragStateRef.current
    if (!d.active) return
    const finalDelta = d.deltaX
    d.active = false
    setIsDragging(false)
    setDragOffsetPx(0)

    if (Math.abs(finalDelta) >= 44) {
      if (finalDelta < 0) scrollTrack('next')
      else scrollTrack('prev')
    }

    // Clear drag flag right after browser synthetic click tick
    setTimeout(() => {
      dragStateRef.current.hasMoved = false
    }, 60)
  }

  const handleStageKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollTrack('next')
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollTrack('prev')
    }
  }

  const computeCard3DTransform = (offset, prevOffset) => {
    const dragNorm = Math.max(-0.85, Math.min(0.85, dragOffsetPx / 220))
    const eff = offset + dragNorm
    const absEff = Math.abs(eff)
    const isWrapping = Math.abs(offset - prevOffset) > 2

    const xSpread = isCompactStage ? 186 : 236
    const tx = Math.sign(eff) * (Math.min(absEff, 1) * xSpread + Math.max(0, absEff - 1) * (isCompactStage ? 132 : 178))
    const tz = Math.max(-210, 74 - absEff * 136)
    const ty = Math.min(20, absEff * 6.5)
    const rotY = Math.max(-40, Math.min(40, -eff * 23))
    const rotX = Math.min(5, absEff * 2.2)
    const scale = Math.max(0.7, 1.04 - absEff * 0.145)
    const opacity = Math.max(0.32, 1 - Math.max(0, absEff - 0.5) * 0.34)
    const zIndex = isWrapping ? 4 : Math.round(40 - absEff * 10)

    return {
      transform: `translate(-50%, -50%) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1)`,
      opacity: opacity.toFixed(2),
      zIndex,
      transition: isDragging
        ? 'none'
        : isWrapping
          ? 'opacity 0.28s ease'
          : 'transform 0.64s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease',
    }
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
              Browse five core industries connecting buyers, service providers, and bulk suppliers
              across global business markets.
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

          {/* RIGHT INTERACTIVE 3D PERSPECTIVE CAROUSEL STAGE */}
          <div
            ref={regionRef}
            className="industries-right-carousel"
            onKeyDown={handleStageKeyDown}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsPaused(false)
              }
            }}
            tabIndex={0}
            role="region"
            aria-roledescription="3D industry carousel"
            aria-label="Industries 3D Carousel — use arrow keys or drag to rotate"
          >
            <div
              ref={stageRef}
              className={`carousel-3d-stage ${isDragging ? 'is-dragging' : ''}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onPointerLeave={handlePointerEnd}
            >
              {CORE_INDUSTRIES.map((industry, idx) => {
                const offset = getCircularOffset(idx, activeIndex, total)
                const prevOffset = prevOffsetsRef.current[idx] ?? offset
                const isActive = offset === 0
                const slotStyle = computeCard3DTransform(offset, prevOffset)

                return (
                  <div
                    key={industry.id}
                    className={`industry-slide-slot ${getSlotClass(offset)}`}
                    style={slotStyle}
                  >
                    <TiltCard
                      className="industry-card-tilt-wrap"
                      maxTilt={isActive ? 9.5 : 5}
                      scale={isActive ? 1.03 : 1.01}
                      elevation={isActive ? 22 : 10}
                    >
                      <article
                        className="industry-card"
                        onClick={() => handleCardActivate(industry, idx)}
                        role="button"
                        tabIndex={0}
                        aria-label={
                          isActive
                            ? `Browse ${industry.title}`
                            : `Focus ${industry.title} in carousel`
                        }
                        onFocus={() => goToIndex(idx)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleCardActivate(industry, idx)
                          }
                        }}
                      >
                        <div className="industry-card-media">
                          <img
                            src={industry.image}
                            alt={industry.title}
                            loading="eager"
                            draggable={false}
                            className="industry-card-img"
                          />
                          <div className="industry-card-sheen" aria-hidden="true" />
                        </div>

                        <div className="industry-card-caption">
                          <div>
                            <h3 className="industry-card-title">{industry.title}</h3>
                            <p className="industry-card-sub">{industry.subtitle}</p>
                          </div>
                          <span className="industry-card-link">
                            Browse category <ArrowRight size={14} strokeWidth={2.3} />
                          </span>
                        </div>
                      </article>
                    </TiltCard>
                  </div>
                )
              })}

              {/* 3D Side Navigation Arrows (continuous circular loop) */}
              <button
                type="button"
                className="carousel-arrow-btn prev"
                onClick={() => scrollTrack('prev')}
                aria-label="Rotate previous industry card"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="carousel-arrow-btn next"
                onClick={() => scrollTrack('next')}
                aria-label="Rotate next industry card"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Carousel Depth Position Indicator Pills */}
            <div className="carousel-dots-row" role="tablist" aria-label="Select featured industry">
              {CORE_INDUSTRIES.map((ind, idx) => (
                <button
                  key={ind.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeIndex}
                  aria-label={ind.title}
                  className={`carousel-dot-btn ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => goToIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
