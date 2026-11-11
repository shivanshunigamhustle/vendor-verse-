import { useRef, useState, useEffect } from 'react'

export function TiltCard({
  children,
  className = '',
  maxTilt = 7,
  scale = 1.025,
  elevation = 18,
  style = {},
  onClick,
  ...props
}) {
  const cardRef = useRef(null)
  const [transformStyle, setTransformStyle] = useState('')
  const [shadowStyle, setShadowStyle] = useState('')
  const [cssVars, setCssVars] = useState({
    '--glare-x': '50%',
    '--glare-y': '50%',
    '--glare-opacity': 0,
    '--tilt-px': '0px',
    '--tilt-py': '0px',
  })
  const [isHovered, setIsHovered] = useState(false)
  const isTouchOrReducedRef = useRef(false)

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    isTouchOrReducedRef.current = isTouch || prefersReduced
  }, [])

  const handleMouseMove = (e) => {
    if (isTouchOrReducedRef.current) return
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const normX = Math.max(-1, Math.min(1, (x - centerX) / centerX))
    const normY = Math.max(-1, Math.min(1, (y - centerY) / centerY))

    const rotateY = normX * maxTilt
    const rotateX = -normY * maxTilt

    const shadowX = -normX * 14
    const shadowY = -normY * 14 + 20

    setTransformStyle(
      `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${elevation}px) scale3d(${scale}, ${scale}, 1)`
    )
    setShadowStyle(
      `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 36px rgba(15, 39, 66, 0.14), 0 8px 20px rgba(2, 132, 199, 0.12)`
    )
    setCssVars({
      '--glare-x': `${((x / rect.width) * 100).toFixed(1)}%`,
      '--glare-y': `${((y / rect.height) * 100).toFixed(1)}%`,
      '--glare-opacity': 0.22,
      '--tilt-px': `${(-normX * 7).toFixed(1)}px`,
      '--tilt-py': `${(-normY * 7).toFixed(1)}px`,
    })
  }

  const handleMouseEnter = () => {
    if (isTouchOrReducedRef.current) return
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (isTouchOrReducedRef.current) return
    setIsHovered(false)
    setTransformStyle(
      'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)'
    )
    setShadowStyle('')
    setCssVars({
      '--glare-x': '50%',
      '--glare-y': '50%',
      '--glare-opacity': 0,
      '--tilt-px': '0px',
      '--tilt-py': '0px',
    })
  }

  return (
    <div
      ref={cardRef}
      className={`tilt-card-3d-root ${className} ${isHovered ? 'is-tilted' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: transformStyle,
        boxShadow: shadowStyle || undefined,
        transition: isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.08s ease-out'
          : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
        transformStyle: 'preserve-3d',
        ...cssVars,
        ...style,
      }}
      {...props}
    >
      {children}
      <span className="tilt-card-glare" aria-hidden="true" />
    </div>
  )
}
