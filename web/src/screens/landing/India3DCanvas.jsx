import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  buildStateSvgPaths,
  createStateShapes,
  geoToSvg,
  geoToVector,
  LAUNCH_CITIES,
} from './indiaMapData.js'

// Directional screen-space label offsets prevent North-West launch cities from colliding.
const CITY_LABEL_DIRECTION = {
  delhi: 'label-ne',
  sikar: 'label-nw',
  jaipur: 'label-e',
  ajmer: 'label-sw',
}

export function India3DCanvas({ selectedCityId, onSelectCity }) {
  const containerRef = useRef(null)
  const [hoveredCityId, setHoveredCityId] = useState(null)
  const [projectedPins, setProjectedPins] = useState([])
  const [hasWebGlError, setHasWebGlError] = useState(false)

  const selectedCityRef = useRef(selectedCityId)
  const hoveredCityRef = useRef(hoveredCityId)
  const onSelectCityRef = useRef(onSelectCity)

  selectedCityRef.current = selectedCityId
  hoveredCityRef.current = hoveredCityId
  onSelectCityRef.current = onSelectCity

  const activeCity = LAUNCH_CITIES.find((c) => c.id === selectedCityId) || LAUNCH_CITIES[0]
  const activeRegionKey = activeCity.regionKey

  const hoveredCityObj = hoveredCityId
    ? LAUNCH_CITIES.find((c) => c.id === hoveredCityId)
    : null

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      setHasWebGlError(true)
      return
    }

    const width = container.clientWidth || 620
    const height = container.clientHeight || 560
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)

    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100)
    camera.position.set(0.15, -1.9, 17.8)
    camera.lookAt(0.1, 0.15, 0)

    // Balanced lighting for Midnight Navy plateaus & Sky-Blue bevel highlights
    const ambientLight = new THREE.AmbientLight(0xe0f2fe, 1.45)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.85)
    keyLight.position.set(5.5, 8.5, 13.5)
    scene.add(keyLight)

    const skyRimLight = new THREE.PointLight(0x38bdf8, 4.6, 26)
    skyRimLight.position.set(-2.5, 3.0, 7.5)
    scene.add(skyRimLight)

    const deepRimLight = new THREE.DirectionalLight(0x0284c7, 0.9)
    deepRimLight.position.set(-8, -5, 4)
    scene.add(deepRimLight)

    const mapGroup = new THREE.Group()
    mapGroup.rotation.x = -0.34
    mapGroup.rotation.y = 0.04
    mapGroup.position.y = 0.15
    scene.add(mapGroup)

    // Subtle elevation shadow disc behind the landmass
    const haloGeo = new THREE.CircleGeometry(6.8, 48)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x06172a,
      transparent: true,
      opacity: 0.42,
    })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    haloMesh.position.set(0.1, -0.1, -0.18)
    mapGroup.add(haloMesh)

    // Extrude authentic 33-state GeoJSON shapes into raised 3D plateaus
    const stateData = createStateShapes()
    const stateMeshes = []
    const borderLines = []

    const inactiveTopColor = new THREE.Color(0x163454)
    const inactiveSideColor = new THREE.Color(0x0b1f36)
    const activeTopColor = new THREE.Color(0x38bdf8)
    const activeSideColor = new THREE.Color(0x0284c7)

    const inactiveBorderMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.36,
    })
    const activeBorderMat = new THREE.LineBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.96,
    })

    const disposables = [haloGeo, haloMat, inactiveBorderMat, activeBorderMat]

    const extrudeBaseSettings = {
      depth: 0.32,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.014,
      bevelThickness: 0.022,
    }

    stateData.forEach((state) => {
      const topMat = new THREE.MeshStandardMaterial({
        color: inactiveTopColor.clone(),
        roughness: 0.38,
        metalness: 0.18,
        emissive: new THREE.Color(0x0f2742),
        emissiveIntensity: 0.25,
      })
      const sideMat = new THREE.MeshStandardMaterial({
        color: inactiveSideColor.clone(),
        roughness: 0.65,
        metalness: 0.12,
      })
      disposables.push(topMat, sideMat)

      const stateGroup = new THREE.Group()
      state.shapes.forEach((shape) => {
        const geo = new THREE.ExtrudeGeometry(shape, extrudeBaseSettings)
        disposables.push(geo)
        const mesh = new THREE.Mesh(geo, [topMat, sideMat])
        stateGroup.add(mesh)
      })

      state.polys.forEach((poly) => {
        const pts = poly.map(([lon, lat]) => {
          const { x, y } = geoToVector(lon, lat)
          return new THREE.Vector3(x, y, 0.348)
        })
        if (pts.length > 0) pts.push(pts[0].clone())
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts)
        disposables.push(lineGeo)
        const line = new THREE.Line(
          lineGeo,
          state.regionKey ? activeBorderMat : inactiveBorderMat
        )
        stateGroup.add(line)
        borderLines.push({ line, regionKey: state.regionKey })
      })

      mapGroup.add(stateGroup)
      stateMeshes.push({
        group: stateGroup,
        topMat,
        sideMat,
        regionKey: state.regionKey,
        liftZ: 0,
      })
    })

    // Subtle NCR focus zone ring around Delhi when Delhi NCR is selected
    const delhiVec = geoToVector(77.209, 28.6139)
    const delhiHaloGeo = new THREE.RingGeometry(0.14, 0.26, 32)
    const delhiHaloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    })
    const delhiHalo = new THREE.Mesh(delhiHaloGeo, delhiHaloMat)
    delhiHalo.position.set(delhiVec.x, delhiVec.y, 0.47)
    mapGroup.add(delhiHalo)
    disposables.push(delhiHaloGeo, delhiHaloMat)

    // Launch City 3D Pins + Pulse Rings + Large Interactive Hit Spheres
    const markerGroup = new THREE.Group()
    mapGroup.add(markerGroup)

    const hitSpheres = []
    const pinObjects = LAUNCH_CITIES.map((city) => {
      const { x, y } = geoToVector(city.lon, city.lat)
      const pinRoot = new THREE.Group()
      pinRoot.position.set(x, y, 0.42)

      // Beacon core
      const coreGeo = new THREE.SphereGeometry(0.11, 20, 20)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.15,
      })
      const core = new THREE.Mesh(coreGeo, coreMat)
      pinRoot.add(core)

      // White inner dot for high contrast
      const capGeo = new THREE.SphereGeometry(0.055, 16, 16)
      const capMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const cap = new THREE.Mesh(capGeo, capMat)
      cap.position.z = 0.07
      pinRoot.add(cap)

      // Pulsing Sky-Blue radar halo
      const ringGeo = new THREE.RingGeometry(0.15, 0.24, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.z = -0.02
      pinRoot.add(ring)

      // Outer secondary ring
      const outerGeo = new THREE.RingGeometry(0.24, 0.28, 32)
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      })
      const outerRing = new THREE.Mesh(outerGeo, outerMat)
      outerRing.position.z = -0.025
      pinRoot.add(outerRing)

      // Hit target
      const hitGeo = new THREE.SphereGeometry(0.4, 12, 12)
      const hitMat = new THREE.MeshBasicMaterial({ visible: false })
      const hit = new THREE.Mesh(hitGeo, hitMat)
      hit.userData = { cityId: city.id }
      pinRoot.add(hit)
      hitSpheres.push(hit)

      disposables.push(
        coreGeo,
        coreMat,
        capGeo,
        capMat,
        ringGeo,
        ringMat,
        outerGeo,
        outerMat,
        hitGeo,
        hitMat
      )

      markerGroup.add(pinRoot)
      return { city, pinRoot, core, coreMat, ring, ringMat, outerRing, outerMat }
    })

    // Raycasting & Smooth Drag Interaction
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(-99, -99)
    let isDragging = false
    let pointerDownPos = { x: 0, y: 0 }
    let dragRotationOffset = { x: 0, y: 0 }
    let targetHoverOffset = { x: 0, y: 0 }

    const updatePointer = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
    }

    const handlePointerMove = (e) => {
      updatePointer(e.clientX, e.clientY)
      if (isDragging) {
        const dx = e.clientX - pointerDownPos.x
        const dy = e.clientY - pointerDownPos.y
        dragRotationOffset.y = Math.max(-0.28, Math.min(0.28, dx * 0.0022))
        dragRotationOffset.x = Math.max(-0.18, Math.min(0.18, dy * 0.0022))
      } else {
        targetHoverOffset.y = pointer.x * 0.1
        targetHoverOffset.x = -pointer.y * 0.07
      }

      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObjects(hitSpheres, false)
      if (intersects.length > 0) {
        const hitCity = intersects[0].object.userData.cityId
        if (hoveredCityRef.current !== hitCity) setHoveredCityId(hitCity)
        renderer.domElement.style.cursor = 'pointer'
      } else {
        if (hoveredCityRef.current !== null) setHoveredCityId(null)
        renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab'
      }
    }

    const handlePointerDown = (e) => {
      isDragging = true
      pointerDownPos = { x: e.clientX, y: e.clientY }
      updatePointer(e.clientX, e.clientY)
    }

    const handlePointerUp = (e) => {
      if (!isDragging) return
      const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y)
      isDragging = false
      if (moveDist < 8) {
        updatePointer(e.clientX, e.clientY)
        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects(hitSpheres, false)
        if (intersects.length > 0) {
          onSelectCityRef.current?.(intersects[0].object.userData.cityId)
        }
      }
    }

    const handlePointerLeave = () => {
      isDragging = false
      setHoveredCityId(null)
      targetHoverOffset = { x: 0, y: 0 }
    }

    const domElem = renderer.domElement
    domElem.addEventListener('pointermove', handlePointerMove)
    domElem.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    domElem.addEventListener('pointerleave', handlePointerLeave)

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || 620
      const h = container.clientHeight || 560
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)
    let resizeObs = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(handleResize)
      resizeObs.observe(container)
    }

    let rafId
    let elapsed = 0
    let lastTime = performance.now()
    let lastPinEmit = -1000

    const animate = (now) => {
      rafId = requestAnimationFrame(animate)
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      elapsed += dt

      const currentCity =
        LAUNCH_CITIES.find((c) => c.id === selectedCityRef.current) || LAUNCH_CITIES[0]
      const currentRegion = currentCity.regionKey

      // Subtle tilt target
      const idleSwayY = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.42) * 0.025
      const targetRotX = -0.34 + dragRotationOffset.x + targetHoverOffset.x
      const targetRotY = 0.04 + dragRotationOffset.y + targetHoverOffset.y + idleSwayY
      mapGroup.rotation.x += (targetRotX - mapGroup.rotation.x) * 0.09
      mapGroup.rotation.y += (targetRotY - mapGroup.rotation.y) * 0.09

      // Decay drag spring back smoothly
      if (!isDragging) {
        dragRotationOffset.x *= 0.94
        dragRotationOffset.y *= 0.94
      }

      // Highlight & slightly raise active launch state (Rajasthan or Delhi)
      stateMeshes.forEach((st) => {
        const isActiveRegion = st.regionKey && st.regionKey === currentRegion
        const targetLift = isActiveRegion ? 0.11 : 0
        st.liftZ += (targetLift - st.liftZ) * 0.14
        st.group.position.z = st.liftZ

        if (isActiveRegion) {
          st.topMat.color.lerp(activeTopColor, 0.14)
          st.sideMat.color.lerp(activeSideColor, 0.14)
          st.topMat.emissive.setHex(0x0284c7)
          st.topMat.emissiveIntensity = 0.55
        } else {
          st.topMat.color.lerp(inactiveTopColor, 0.14)
          st.sideMat.color.lerp(inactiveSideColor, 0.14)
          st.topMat.emissive.setHex(0x0f2742)
          st.topMat.emissiveIntensity = 0.22
        }
      })

      borderLines.forEach((bl) => {
        const isLit = bl.regionKey && bl.regionKey === currentRegion
        bl.line.material = isLit ? activeBorderMat : inactiveBorderMat
      })

      // Delhi focus halo
      const targetDelhiOpacity = currentRegion === 'delhi' ? 0.65 : 0.0
      delhiHaloMat.opacity += (targetDelhiOpacity - delhiHaloMat.opacity) * 0.15
      const delhiPulse = prefersReducedMotion ? 1 : 1 + Math.sin(elapsed * 2.5) * 0.12
      delhiHalo.scale.set(delhiPulse, delhiPulse, 1)

      // Elevate markers along with their host state + animate pulse
      pinObjects.forEach((p, idx) => {
        const isSelected = p.city.id === selectedCityRef.current
        const isHovered = p.city.id === hoveredCityRef.current
        const isCityStateActive = p.city.regionKey === currentRegion

        p.pinRoot.position.z = (isCityStateActive ? 0.53 : 0.42) + (isSelected ? 0.06 : 0)

        const baseScale = isSelected ? 1.55 : isHovered ? 1.28 : 0.92
        p.core.scale.setScalar(baseScale)

        if (isSelected) {
          p.coreMat.color.setHex(0xffffff)
          p.coreMat.emissive.setHex(0x38bdf8)
          p.coreMat.emissiveIntensity = 1.6
          const wave = prefersReducedMotion ? 1.35 : 1 + ((elapsed * 1.15) % 1) * 1.55
          p.ring.scale.setScalar(wave)
          p.ringMat.opacity = prefersReducedMotion ? 0.7 : (1 - (wave - 1) / 1.55) * 0.85
          p.outerRing.scale.setScalar(1.38)
          p.outerMat.opacity = 0.42
        } else {
          p.coreMat.color.setHex(isHovered ? 0xe0f2fe : 0x38bdf8)
          p.coreMat.emissive.setHex(0x0284c7)
          p.coreMat.emissiveIntensity = isHovered ? 1.3 : 0.75
          const idleWave = prefersReducedMotion
            ? 1.1
            : 1 + Math.sin(elapsed * 2.2 + idx * 1.3) * 0.14
          p.ring.scale.setScalar(idleWave)
          p.ringMat.opacity = isHovered ? 0.78 : 0.42
          p.outerRing.scale.setScalar(1)
          p.outerMat.opacity = 0.18
        }
      })

      renderer.render(scene, camera)

      // Throttle React DOM overlay projection to ~20fps when camera moves
      if (now - lastPinEmit > 45) {
        lastPinEmit = now
        const cw = container.clientWidth || 620
        const ch = container.clientHeight || 560
        const tempV = new THREE.Vector3()
        const projected = pinObjects.map((p) => {
          p.pinRoot.getWorldPosition(tempV)
          tempV.project(camera)
          return {
            id: p.city.id,
            name: p.city.name,
            state: p.city.state,
            x: (tempV.x * 0.5 + 0.5) * cw,
            y: (-tempV.y * 0.5 + 0.5) * ch,
          }
        })
        setProjectedPins(projected)
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      domElem.removeEventListener('pointermove', handlePointerMove)
      domElem.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      domElem.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
      if (resizeObs) resizeObs.disconnect()
      disposables.forEach((d) => d.dispose?.())
      renderer.dispose()
      if (container && domElem.parentNode === container) {
        container.removeChild(domElem)
      }
    }
  }, [])

  // Accessible crisp SVG Fallback (exact same 33-state GeoJSON projection)
  if (hasWebGlError) {
    const svgStates = buildStateSvgPaths()
    return (
      <div className="india-map-svg-fallback" role="region" aria-label="Interactive India Marketplace Map">
        <svg viewBox="0 0 600 620" className="india-svg-element">
          <defs>
            <linearGradient id="skyStateGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {svgStates.map((st) => {
            const isLit = st.regionKey && st.regionKey === activeRegionKey
            return (
              <path
                key={st.name}
                d={st.d}
                fill={isLit ? 'url(#skyStateGrad)' : '#132F4D'}
                stroke={isLit ? '#E0F2FE' : 'rgba(56, 189, 248, 0.42)'}
                strokeWidth={isLit ? '1.6' : '0.8'}
              />
            )
          })}
          {LAUNCH_CITIES.map((city) => {
            const { x, y } = geoToSvg(city.lon, city.lat)
            const isSelected = city.id === selectedCityId
            return (
              <g
                key={city.id}
                onClick={() => onSelectCity(city.id)}
                className="svg-city-marker"
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 15 : 10}
                  fill="#38BDF8"
                  fillOpacity={isSelected ? 0.35 : 0.2}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6.5 : 4.5}
                  fill={isSelected ? '#FFFFFF' : '#38BDF8'}
                  stroke="#0F2742"
                  strokeWidth="2"
                />
              </g>
            )
          })}
        </svg>
        <div className="svg-fallback-pills">
          {LAUNCH_CITIES.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city.id)}
              className={`map-pin-pill ${selectedCityId === city.id ? 'active' : ''}`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="india-3d-wrapper">
      <div
        ref={containerRef}
        className="india-3d-canvas-host"
        aria-label="Interactive 3D India Marketplace Map"
      />

      {/* Synchronized Interactive 2D Projected Labels with Anti-Overlap Offsets */}
      <div className="map-pins-overlay" aria-hidden="false">
        {projectedPins.map((pin) => {
          const isSelected = pin.id === selectedCityId
          const isHovered = pin.id === hoveredCityId
          const dirClass = CITY_LABEL_DIRECTION[pin.id] || 'label-e'
          return (
            <button
              key={pin.id}
              type="button"
              className={`map-pin-pill ${dirClass} ${isSelected ? 'active' : ''} ${
                isHovered ? 'hovered' : ''
              }`}
              style={{ left: `${pin.x}px`, top: `${pin.y}px` }}
              onClick={() => onSelectCity(pin.id)}
              onMouseEnter={() => setHoveredCityId(pin.id)}
              onMouseLeave={() => setHoveredCityId(null)}
            >
              <span className="pin-dot" />
              <span className="pin-label-text">{pin.name}</span>
            </button>
          )
        })}
      </div>

      {/* Hover City Tooltip */}
      {hoveredCityObj && (
        <div className="map-hover-tooltip">
          <strong>{hoveredCityObj.name}</strong>
          <span>{hoveredCityObj.state} • {hoveredCityObj.tagline}</span>
        </div>
      )}

      <div className="map-drag-hint">
        <span>Drag to rotate • Click any highlighted city marker</span>
      </div>
    </div>
  )
}
