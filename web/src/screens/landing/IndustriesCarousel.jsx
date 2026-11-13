import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
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

export function IndustriesCarousel({ onNavigateCategory }) {
  const nav = useNav()
  const stageRef = useRef(null)
  const regionRef = useRef(null)

  // Continuous angle state for true elliptical orbit
  const [orbitAngle, setOrbitAngle] = useState(0)
  const targetAngleRef = useRef(0)
  const currentAngleRef = useRef(0)
  const lastTimeRef = useRef(0)
  const rafRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(true)
  const [isCompact, setIsCompact] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startAngle: 0,
    hasMoved: false,
  })

  const total = CORE_INDUSTRIES.length
  const stepAngle = (2 * Math.PI) / total

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth <= 680)
      setReducedMotion(
        Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches),
      )
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Observer to pause auto-orbit when out of viewport
  useEffect(() => {
    const el = regionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setIsInView(entries[0].isIntersecting)
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Continuous animation loop: 8.5s full orbit, smooth damping when user drags or clicks arrows
  useEffect(() => {
    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const dt = Math.min(64, time - lastTimeRef.current)
      lastTimeRef.current = time

      if (!reducedMotion) {
        if (!isPaused && !isDragging && isInView) {
          // ~8.5 seconds per full orbit (2*PI / 8500 ms)
          const autoSpeed = (2 * Math.PI) / 8500
          targetAngleRef.current += autoSpeed * dt
        }

        // Smooth spring/lerp toward target angle
        const diff = targetAngleRef.current - currentAngleRef.current
        currentAngleRef.current += diff * 0.12
        setOrbitAngle(currentAngleRef.current)
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reducedMotion, isPaused, isDragging, isInView])

  const scrollTrack = useCallback(
    (direction) => {
      const delta = direction === 'next' ? -stepAngle : stepAngle
      targetAngleRef.current += delta
    },
    [stepAngle],
  )

  const goToCard = useCallback(
    (idx) => {
      // Rotate targetAngle so that this card's angle aligns closest to 0 (front center)
      const current = targetAngleRef.current
      const cardAngleAtOrigin = idx * stepAngle
      // Find k such that (current + cardAngleAtOrigin) ≈ 2*PI*k
      const diff = (-cardAngleAtOrigin - current) % (2 * Math.PI)
      let adjusted = diff
      if (adjusted > Math.PI) adjusted -= 2 * Math.PI
      if (adjusted < -Math.PI) adjusted += 2 * Math.PI
      targetAngleRef.current += adjusted
    },
    [stepAngle],
  )

  const handlePointerDown = (e) => {
    if (reducedMotion) return
    setIsDragging(true)
    dragStateRef.current = {
      active: true,
      startX: e.clientX || e.touches?.[0]?.clientX || 0,
      startAngle: targetAngleRef.current,
      hasMoved: false,
    }
    stageRef.current?.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!dragStateRef.current.active) return
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0
    const deltaX = currentX - dragStateRef.current.startX
    if (Math.abs(deltaX) > 4) {
      dragStateRef.current.hasMoved = true
    }
    // Sensitivity: 240px drag = 1 stepAngle
    const angleDelta = (deltaX / 240) * stepAngle
    targetAngleRef.current = dragStateRef.current.startAngle + angleDelta
  }

  const handlePointerEnd = (e) => {
    if (!dragStateRef.current.active) return
    setIsDragging(false)
    dragStateRef.current.active = false
    try {
      stageRef.current?.releasePointerCapture?.(e.pointerId)
    } catch {
      // Ignore
    }
  }

  const handleCardClick = (industry, idx, isFront) => {
    if (dragStateRef.current.hasMoved) return
    if (!isFront) {
      goToCard(idx)
      return
    }
    if (onNavigateCategory) {
      onNavigateCategory(industry.title)
    } else {
      nav.go('c_explore', { category: industry.title })
    }
  }

  // Find active card index (the one with cos closest to 1)
  let bestCos = -2
  let activeIndex = 0
  CORE_INDUSTRIES.forEach((_, idx) => {
    const cardAngle = orbitAngle + idx * stepAngle
    const c = Math.cos(cardAngle)
    if (c > bestCos) {
      bestCos = c
      activeIndex = idx
    }
  })

  // Dimensions of 3D Elliptical Orbit
  const rx = isCompact ? 180 : 260
  const rz = 135

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
            <span className="eyebrow-tag">
              <Sparkles size={13} strokeWidth={2.4} />
              CORE INDUSTRIES
            </span>
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
                onClick={() => {
                  if (onNavigateCategory) onNavigateCategory('all')
                  else nav.go('c_explore')
                }}
              >
                Explore All Industries
                <ArrowRight size={17} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* RIGHT 3D ELLIPTICAL ORBIT STAGE */}
          <div
            ref={regionRef}
            className="industries-right-carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            tabIndex={0}
            role="region"
            aria-roledescription="3D elliptical industry orbit"
            aria-label="Industries 3D Elliptical Orbit — drag or use arrow keys to spin"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault()
                scrollTrack('next')
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                scrollTrack('prev')
              }
            }}
          >
            <div
              ref={stageRef}
              className={`carousel-3d-stage ${isDragging ? 'is-dragging' : ''}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            >
              {CORE_INDUSTRIES.map((industry, idx) => {
                const cardAngle = orbitAngle + idx * stepAngle
                const sinVal = Math.sin(cardAngle)
                const cosVal = Math.cos(cardAngle)

                // 3D Elliptical coordinates
                const tx = sinVal * rx
                const tz = cosVal * rz
                const ty = Math.abs(sinVal) * 6

                // Dynamic scale, opacity and 3D perspective rotation
                const scale = 0.86 + 0.18 * cosVal
                const opacity = Math.max(0.42, 0.72 + 0.28 * cosVal)
                const rotY = -sinVal * 26
                const rotX = (1 - cosVal) * 2.2
                const zIndex = Math.round(50 + 40 * cosVal)
                const isFront = cosVal > 0.8

                const cardTransform = `translate(-50%, -50%) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1)`

                return (
                  <div
                    key={industry.id}
                    className={`industry-slide-slot ${isFront ? 'slot-active' : ''}`}
                    style={{
                      transform: cardTransform,
                      opacity: opacity.toFixed(2),
                      zIndex,
                    }}
                  >
                    <TiltCard
                      className="industry-card-tilt-wrap"
                      maxTilt={isFront ? 9 : 4}
                      scale={isFront ? 1.03 : 1.01}
                      elevation={isFront ? 22 : 10}
                    >
                      <article
                        className="industry-card"
                        onClick={() => handleCardClick(industry, idx, isFront)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${industry.title}: ${industry.subtitle}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleCardClick(industry, idx, isFront)
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
                          <button
                            type="button"
                            className="industry-card-link"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (onNavigateCategory) {
                                onNavigateCategory(industry.title)
                              } else {
                                nav.go('c_explore', { category: industry.title })
                              }
                            }}
                          >
                            <span>Browse category</span>
                            <ArrowRight size={14} strokeWidth={2.3} />
                          </button>
                        </div>
                      </article>
                    </TiltCard>
                  </div>
                )
              })}
            </div>

            {/* Orbit Navigation Controls */}
            <button
              type="button"
              className="carousel-arrow-btn prev"
              onClick={() => scrollTrack('prev')}
              aria-label="Previous industry"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className="carousel-arrow-btn next"
              onClick={() => scrollTrack('next')}
              aria-label="Next industry"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>

            {/* Orbit Dots Indicator */}
            <div className="carousel-dots-row">
              {CORE_INDUSTRIES.map((ind, idx) => (
                <button
                  key={ind.id}
                  type="button"
                  className={`carousel-dot-btn ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => goToCard(idx)}
                  aria-label={`View ${ind.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
