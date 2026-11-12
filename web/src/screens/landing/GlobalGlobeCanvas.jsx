import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  COASTAL_LIGHT_CLUSTERS,
  GLOBAL_ARCS,
  GLOBAL_MARKETS,
  decodeWorldFeatures,
  formatCoordinates,
  latLonToVector3,
} from './worldGlobeData.js'

const GLOBE_RADIUS = 1.0
const GLOBAL_CAM_Z = 3.56
const DEFAULT_GLOBAL_LAT = 18.0
const DEFAULT_GLOBAL_LON = 14.0

const COUNTRY_LABEL_POS = {
  india: 'ne',
  usa: 'nw',
  brazil: 'se',
  uk: 'nw',
  germany: 'ne',
  uae: 'se',
  australia: 'se',
}

// Sweeping geodesic orbital arcs matching the fine silver-white network web around the reference globe
const ORBITAL_WEAVE_PATHS = [
  { from: [46, -125], to: [-28, 32], lift: 0.055 },
  { from: [58, -18], to: [-38, -72], lift: 0.048 },
  { from: [62, 74], to: [-30, 148], lift: 0.052 },
  { from: [24, -108], to: [42, 118], lift: 0.075 },
  { from: [-44, -66], to: [12, 108], lift: 0.068 },
  { from: [54, -84], to: [-32, 22], lift: 0.044 },
  { from: [36, 138], to: [-18, -46], lift: 0.07 },
]

function splitAntimeridianRing(ring) {
  if (!ring || ring.length < 2) return [ring || []]
  const unwrapped = []
  let offset = 0
  let prevLon = ring[0][0]
  unwrapped.push([prevLon, ring[0][1]])
  for (let i = 1; i < ring.length; i += 1) {
    const rawLon = ring[i][0]
    const rawLat = ring[i][1]
    const diff = rawLon + offset - prevLon
    if (diff > 180) offset -= 360
    else if (diff < -180) offset += 360
    const nextLon = rawLon + offset
    unwrapped.push([nextLon, rawLat])
    prevLon = nextLon
  }

  let minL = Infinity
  let maxL = -Infinity
  for (let i = 0; i < unwrapped.length; i += 1) {
    if (unwrapped[i][0] < minL) minL = unwrapped[i][0]
    if (unwrapped[i][0] > maxL) maxL = unwrapped[i][0]
  }
  const copies = [unwrapped]
  if (minL < -180) copies.push(unwrapped.map(([lo, la]) => [lo + 360, la]))
  if (maxL > 180) copies.push(unwrapped.map(([lo, la]) => [lo - 360, la]))
  return copies
}

// Midnight-navy teardrop marker with crisp white rim & white circular center (matches reference image)
function buildTeardropPinTexture(isActive) {
  const w = 128
  const h = 160
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  const cx = w / 2
  const cy = 58
  const r = 34

  // Soft icy-blue outer halo glow
  const aura = ctx.createRadialGradient(cx, cy + 6, 8, cx, cy + 6, 56)
  aura.addColorStop(0, isActive ? 'rgba(56, 189, 248, 0.72)' : 'rgba(14, 165, 233, 0.24)')
  aura.addColorStop(0.58, 'rgba(186, 230, 253, 0.14)')
  aura.addColorStop(1, 'rgba(186, 230, 253, 0)')
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(cx, cy + 6, 56, 0, Math.PI * 2)
  ctx.fill()

  // Deep midnight-navy teardrop body pointing cleanly down to (cx, 138)
  ctx.save()
  ctx.shadowColor = isActive ? 'rgba(2, 132, 199, 0.55)' : 'rgba(7, 25, 58, 0.42)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 3

  ctx.beginPath()
  ctx.moveTo(cx, 138)
  ctx.bezierCurveTo(cx - 25, 98, cx - r, cy + 16, cx - r, cy)
  ctx.arc(cx, cy, r, Math.PI, 0, false)
  ctx.bezierCurveTo(cx + r, cy + 16, cx + 25, 98, cx, 138)
  ctx.closePath()

  const pinGrad = ctx.createLinearGradient(0, cy - r, 0, 138)
  pinGrad.addColorStop(0, isActive ? '#0284C7' : '#1E4E8C')
  pinGrad.addColorStop(0.55, isActive ? '#0369A1' : '#0F2E5A')
  pinGrad.addColorStop(1, '#0A1E3D')
  ctx.fillStyle = pinGrad
  ctx.fill()

  ctx.lineWidth = isActive ? 4.2 : 3.2
  ctx.strokeStyle = isActive ? '#E0F2FE' : '#FFFFFF'
  ctx.stroke()
  ctx.restore()

  // Crisp bright white center circle inside the pin head
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(cx, cy, 13, 0, Math.PI * 2)
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 4-point optical starburst lens flare texture for gleaming network intersection nodes
function buildStarburstFlareTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const c = size / 2

  const radial = ctx.createRadialGradient(c, c, 2, c, c, c * 0.86)
  radial.addColorStop(0, 'rgba(255, 255, 255, 1)')
  radial.addColorStop(0.18, 'rgba(239, 246, 255, 0.92)')
  radial.addColorStop(0.42, 'rgba(147, 197, 253, 0.42)')
  radial.addColorStop(1, 'rgba(147, 197, 253, 0)')
  ctx.fillStyle = radial
  ctx.fillRect(0, 0, size, size)

  // Tapered horizontal & vertical optical rays
  const drawRay = (angle, len, thick) => {
    ctx.save()
    ctx.translate(c, c)
    ctx.rotate(angle)
    const g = ctx.createLinearGradient(-len, 0, len, 0)
    g.addColorStop(0, 'rgba(255, 255, 255, 0)')
    g.addColorStop(0.5, 'rgba(255, 255, 255, 0.96)')
    g.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(0, 0, len, thick, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  drawRay(0, 56, 2.2)
  drawRay(Math.PI / 2, 56, 2.2)
  drawRay(Math.PI / 4, 24, 1.1)
  drawRay(-Math.PI / 4, 24, 1.1)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function traceFeaturePolygons(ctx, features, projectX, projectY) {
  features.forEach((feat) => {
    feat.polys.forEach((poly) => {
      poly.forEach((ring) => {
        const ringCopies = splitAntimeridianRing(ring)
        ringCopies.forEach((cleanRing) => {
          cleanRing.forEach(([lon, lat], idx) => {
            const x = projectX(lon)
            const y = projectY(lat)
            if (idx === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          })
          ctx.closePath()
        })
      })
    })
  })
}

function buildEarthTextures(features) {
  const width = 2048
  const height = 1024

  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = width
  colorCanvas.height = height
  const cCtx = colorCanvas.getContext('2d')

  const emissiveCanvas = document.createElement('canvas')
  emissiveCanvas.width = width
  emissiveCanvas.height = height
  const eCtx = emissiveCanvas.getContext('2d')

  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bCtx = bumpCanvas.getContext('2d')

  const roughCanvas = document.createElement('canvas')
  roughCanvas.width = width
  roughCanvas.height = height
  const rCtx = roughCanvas.getContext('2d')

  const projectX = (lon) => ((lon + 180) / 360) * width
  const projectY = (lat) => ((90 - lat) / 180) * height

  // Build crisp land alpha mask from real Natural Earth polygons
  const landMaskCanvas = document.createElement('canvas')
  landMaskCanvas.width = width
  landMaskCanvas.height = height
  const mCtx = landMaskCanvas.getContext('2d')
  mCtx.fillStyle = '#FFFFFF'
  mCtx.beginPath()
  traceFeaturePolygons(mCtx, features, projectX, projectY)
  mCtx.fill()

  // 1. Deep Royal / Cobalt Sapphire Ocean Layer (matches reference globe ocean tone)
  const oceanGrad = cCtx.createLinearGradient(0, 0, 0, height)
  oceanGrad.addColorStop(0, '#0D3B75')
  oceanGrad.addColorStop(0.24, '#154F99')
  oceanGrad.addColorStop(0.5, '#1D64BA')
  oceanGrad.addColorStop(0.76, '#144D94')
  oceanGrad.addColorStop(1, '#0B3368')
  cCtx.fillStyle = oceanGrad
  cCtx.fillRect(0, 0, width, height)

  // Subtle oceanic luminous core highlight + faint geodesic grid sheen
  const oceanSheen = cCtx.createRadialGradient(
    width * 0.48,
    height * 0.45,
    40,
    width * 0.48,
    height * 0.45,
    width * 0.36,
  )
  oceanSheen.addColorStop(0, 'rgba(96, 165, 250, 0.24)')
  oceanSheen.addColorStop(0.55, 'rgba(59, 130, 246, 0.08)')
  oceanSheen.addColorStop(1, 'rgba(11, 51, 104, 0)')
  cCtx.fillStyle = oceanSheen
  cCtx.fillRect(0, 0, width, height)

  // Very subtle surface latitude/longitude arc lines across oceans
  cCtx.save()
  cCtx.strokeStyle = 'rgba(219, 234, 254, 0.08)'
  cCtx.lineWidth = 1.1
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = projectY(lat)
    cCtx.beginPath()
    cCtx.moveTo(0, y)
    cCtx.lineTo(width, y)
    cCtx.stroke()
  }
  for (let lon = -150; lon <= 150; lon += 30) {
    const x = projectX(lon)
    cCtx.beginPath()
    cCtx.moveTo(x, 0)
    cCtx.lineTo(x, height)
    cCtx.stroke()
  }
  cCtx.restore()

  // 2. Sculpted Icy-White / Pale Frost-Blue Continents Layer with 3D Embossed Coastline Drop Shadow
  const landCanvas = document.createElement('canvas')
  landCanvas.width = width
  landCanvas.height = height
  const lCtx = landCanvas.getContext('2d')

  const frostGrad = lCtx.createLinearGradient(0, 0, 0, height)
  frostGrad.addColorStop(0, '#FFFFFF')
  frostGrad.addColorStop(0.26, '#F4F9FF')
  frostGrad.addColorStop(0.5, '#E3EFFC')
  frostGrad.addColorStop(0.75, '#EDF5FE')
  frostGrad.addColorStop(1, '#FFFFFF')
  lCtx.fillStyle = frostGrad
  lCtx.fillRect(0, 0, width, height)

  // Soft diagonal lighting highlight across continents so white land feels volumetric & 3D
  const landVol = lCtx.createRadialGradient(
    width * 0.42,
    height * 0.36,
    60,
    width * 0.42,
    height * 0.48,
    width * 0.48,
  )
  landVol.addColorStop(0, 'rgba(255, 255, 255, 0.42)')
  landVol.addColorStop(0.65, 'rgba(191, 219, 254, 0.14)')
  landVol.addColorStop(1, 'rgba(147, 197, 253, 0.24)')
  lCtx.fillStyle = landVol
  lCtx.fillRect(0, 0, width, height)

  // Faint delicate country subdivisions inside icy-white continents
  lCtx.save()
  lCtx.lineJoin = 'round'
  lCtx.beginPath()
  traceFeaturePolygons(lCtx, features, projectX, projectY)
  lCtx.strokeStyle = 'rgba(125, 168, 224, 0.48)'
  lCtx.lineWidth = 1.25
  lCtx.stroke()
  lCtx.restore()

  // Mask continents cleanly to land shapes
  lCtx.save()
  lCtx.globalCompositeOperation = 'destination-in'
  lCtx.drawImage(landMaskCanvas, 0, 0)
  lCtx.restore()

  // Stamp continents onto sapphire ocean WITH soft embossed 3D shadow underneath coastlines
  cCtx.save()
  cCtx.shadowColor = 'rgba(5, 20, 52, 0.62)'
  cCtx.shadowBlur = 12
  cCtx.shadowOffsetX = 3
  cCtx.shadowOffsetY = 4
  cCtx.drawImage(landCanvas, 0, 0)
  cCtx.restore()

  // Crisp bright white coastal bevel highlight edge
  cCtx.save()
  cCtx.lineJoin = 'round'
  cCtx.beginPath()
  traceFeaturePolygons(cCtx, features, projectX, projectY)
  cCtx.strokeStyle = 'rgba(255, 255, 255, 0.72)'
  cCtx.lineWidth = 1.15
  cCtx.stroke()
  cCtx.restore()

  // 3. 3D Coastline Bump Map so directional light catches raised icy continents
  bCtx.fillStyle = '#080808'
  bCtx.fillRect(0, 0, width, height)
  bCtx.save()
  bCtx.filter = 'blur(2.5px)'
  bCtx.drawImage(landMaskCanvas, 0, 0)
  bCtx.filter = 'none'
  bCtx.restore()

  // 4. Roughness Map: glossy sapphire ocean reflections vs smooth frosted continents
  rCtx.fillStyle = '#383838'
  rCtx.fillRect(0, 0, width, height)
  rCtx.save()
  rCtx.fillStyle = '#9a9a9a'
  rCtx.drawImage(landMaskCanvas, 0, 0)
  rCtx.restore()

  // 5. Soft self-lit emissive glow on icy-white land edges & ocean hub points
  eCtx.fillStyle = '#000000'
  eCtx.fillRect(0, 0, width, height)
  eCtx.save()
  eCtx.globalAlpha = 0.24
  eCtx.drawImage(landMaskCanvas, 0, 0)
  eCtx.restore()

  COASTAL_LIGHT_CLUSTERS.forEach(([lat, lon]) => {
    const cx = projectX(lon)
    const cy = projectY(lat)
    const nodeGlow = eCtx.createRadialGradient(cx, cy, 0.4, cx, cy, 12)
    nodeGlow.addColorStop(0, 'rgba(255, 255, 255, 0.92)')
    nodeGlow.addColorStop(0.45, 'rgba(186, 230, 253, 0.35)')
    nodeGlow.addColorStop(1, 'rgba(186, 230, 253, 0)')
    eCtx.fillStyle = nodeGlow
    eCtx.beginPath()
    eCtx.arc(cx, cy, 12, 0, Math.PI * 2)
    eCtx.fill()
  })

  const colorMap = new THREE.CanvasTexture(colorCanvas)
  colorMap.colorSpace = THREE.SRGBColorSpace
  colorMap.anisotropy = 8

  const emissiveMap = new THREE.CanvasTexture(emissiveCanvas)
  emissiveMap.colorSpace = THREE.SRGBColorSpace
  emissiveMap.anisotropy = 4

  const bumpMap = new THREE.CanvasTexture(bumpCanvas)
  const roughMap = new THREE.CanvasTexture(roughCanvas)

  return { colorMap, emissiveMap, bumpMap, roughMap }
}

function latLonToVec3Obj(lat, lon, r = GLOBE_RADIUS) {
  const { x, y, z } = latLonToVector3(lat, lon, r)
  return new THREE.Vector3(x, y, z)
}

function targetQuaternionForLatLon(lat, lon, tiltBias = 0.04) {
  const localDir = latLonToVec3Obj(lat, lon, 1).normalize()
  const yaw = Math.atan2(-localDir.x, localDir.z)
  const horiz = Math.hypot(localDir.x, localDir.z)
  const pitch = Math.max(-1.05, Math.min(1.05, Math.atan2(localDir.y, horiz) - tiltBias))
  const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
  const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch)
  return qPitch.multiply(qYaw).normalize()
}

export function GlobalGlobeCanvas({
  selectedLocation,
  onSelectCountry,
  onSelectCity,
  onResetGlobe,
}) {
  const mountRef = useRef(null)
  const containerRef = useRef(null)
  const [webglReady, setWebglReady] = useState(true)
  const [hoveredMarker, setHoveredMarker] = useState(null)
  const [screenMarkers, setScreenMarkers] = useState([])
  const [zoomOffset, setZoomOffset] = useState(0)

  const selectedCountryId = selectedLocation?.countryId || 'india'
  const focusedCountryId = selectedLocation?.isZoomed ? selectedLocation.countryId : null
  const selectedCityId = selectedLocation?.cityId || null

  const stateRef = useRef({
    selectedCountryId,
    focusedCountryId,
    selectedCityId,
    hoveredKey: null,
    zoomOffset: 0,
  })
  stateRef.current.selectedCountryId = selectedCountryId
  stateRef.current.focusedCountryId = focusedCountryId
  stateRef.current.selectedCityId = selectedCityId
  stateRef.current.hoveredKey = hoveredMarker?.key || null
  stateRef.current.zoomOffset = zoomOffset

  const features = useMemo(() => decodeWorldFeatures(), [])

  const focusedCountry = useMemo(
    () => GLOBAL_MARKETS.find((c) => c.id === focusedCountryId) || null,
    [focusedCountryId],
  )

  const interactionRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    targetQuat: targetQuaternionForLatLon(DEFAULT_GLOBAL_LAT, DEFAULT_GLOBAL_LON, 0.04),
    autoSpinPausedUntil: 0,
    isInView: false,
    hasEnteredView: false,
    userDragged: false,
  })

  useEffect(() => {
    const activeCountry =
      GLOBAL_MARKETS.find((c) => c.id === selectedCountryId) || GLOBAL_MARKETS[0]
    if (!activeCountry) return

    if (!focusedCountryId) {
      interactionRef.current.targetQuat = targetQuaternionForLatLon(
        DEFAULT_GLOBAL_LAT,
        DEFAULT_GLOBAL_LON,
        0.04,
      )
      interactionRef.current.autoSpinPausedUntil = performance.now() + 2400
      return
    }

    let focusLat = activeCountry.lat
    let focusLon = activeCountry.lon
    if (selectedCityId) {
      const city = activeCountry.cities.find((ct) => ct.id === selectedCityId)
      if (city) {
        focusLat = activeCountry.lat * 0.62 + city.lat * 0.38
        focusLon = activeCountry.lon * 0.62 + city.lon * 0.38
      }
    }
    interactionRef.current.targetQuat = targetQuaternionForLatLon(focusLat, focusLon, 0)
    interactionRef.current.autoSpinPausedUntil = performance.now() + 2600
  }, [selectedCountryId, focusedCountryId, selectedCityId])

  useEffect(() => {
    setZoomOffset(0)
  }, [focusedCountryId])

  useEffect(() => {
    const host = mountRef.current
    if (!host) return

    let disposed = false
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
      setWebglReady(false)
      return
    }

    const width = Math.max(host.clientWidth || 520, 260)
    const height = Math.max(host.clientHeight || 520, 260)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    host.innerHTML = ''
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 0, GLOBAL_CAM_Z)
    camera.lookAt(0, 0, 0)

    // Crisp Studio Daylight Illumination for Cobalt Ocean & Icy-White Embossed Continents
    const hemi = new THREE.HemisphereLight('#FFFFFF', '#1D4ED8', 1.35)
    scene.add(hemi)

    const ambient = new THREE.AmbientLight('#EFF6FF', 0.92)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight('#FFFFFF', 1.42)
    keyLight.position.set(-2.4, 2.8, 3.6)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight('#BAE6FD', 1.05)
    rimLight.position.set(3.4, -1.2, -2.0)
    scene.add(rimLight)

    const globeGroup = new THREE.Group()
    globeGroup.quaternion.copy(interactionRef.current.targetQuat)
    scene.add(globeGroup)

    // 1. Cobalt Sapphire & Raised Icy-White Continents Sphere
    const earthTextures = buildEarthTextures(features)
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 72)
    const sphereMat = new THREE.MeshStandardMaterial({
      map: earthTextures.colorMap,
      emissiveMap: earthTextures.emissiveMap,
      emissive: new THREE.Color('#DCEEFF'),
      emissiveIntensity: 0.72,
      bumpMap: earthTextures.bumpMap,
      bumpScale: 0.022,
      roughnessMap: earthTextures.roughMap,
      roughness: 0.46,
      metalness: 0.08,
    })
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat)
    globeGroup.add(earthMesh)

    // 2. Soft Icy-White Atmospheric Rim Glow around the Sphere
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.075, 64, 64)
    const atmosMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.BackSide,
      uniforms: {
        uColor: { value: new THREE.Color('#93C5FD') },
        uGlowColor: { value: new THREE.Color('#EFF6FF') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewPos = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uGlowColor;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec3 viewDir = normalize(vViewPos);
          float fresnel = pow(clamp(0.76 + dot(vNormal, viewDir), 0.0, 1.0), 2.8);
          vec3 col = mix(uColor, uGlowColor, fresnel * 0.65);
          gl_FragColor = vec4(col, fresnel * 0.56);
        }
      `,
    })
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat)
    scene.add(atmosMesh)

    const innerRimGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.006, 64, 64)
    const innerRimMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uColor: { value: new THREE.Color('#DBEAFE') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewPos = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec3 viewDir = normalize(vViewPos);
          float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
          float intensity = pow(rim, 3.0) * 0.44;
          gl_FragColor = vec4(uColor, intensity);
        }
      `,
    })
    const innerRimMesh = new THREE.Mesh(innerRimGeo, innerRimMat)
    scene.add(innerRimMesh)

    // 3. Highlighted Country 3D Outline Meshes on Hover / Drill-Down
    const countryHighlightGroups = {}
    const disposableGeos = [sphereGeo, atmosGeo, innerRimGeo]
    const disposableMats = [sphereMat, atmosMat, innerRimMat]

    GLOBAL_MARKETS.forEach((market) => {
      if (!market.topoName) return
      const feat = features.find((f) => f.name === market.topoName)
      if (!feat) return

      const linePositions = []
      feat.polys.forEach((poly) => {
        poly.forEach((ring) => {
          for (let i = 0; i < ring.length - 1; i += 1) {
            const p1 = latLonToVec3Obj(ring[i][1], ring[i][0], GLOBE_RADIUS * 1.006)
            const p2 = latLonToVec3Obj(ring[i + 1][1], ring[i + 1][0], GLOBE_RADIUS * 1.006)
            linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
          }
        })
      })

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
      const mat = new THREE.LineBasicMaterial({
        color: '#38BDF8',
        transparent: true,
        opacity: 0.92,
      })
      const lines = new THREE.LineSegments(geo, mat)
      lines.visible = false
      globeGroup.add(lines)
      disposableGeos.push(geo)
      disposableMats.push(mat)
      countryHighlightGroups[market.id] = { lines, mat }
    })

    // 4. White & Pale Ice-Blue Geodesic Network Arcs + Optical Starburst Nodes
    const starburstTex = buildStarburstFlareTexture()
    const starburstSprites = []
    const arcPulses = []

    const addStarburstNode = (pos, scale, phase) => {
      const mat = new THREE.SpriteMaterial({
        map: starburstTex,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.position.copy(pos)
      sprite.scale.set(scale, scale, 1)
      globeGroup.add(sprite)
      disposableMats.push(mat)
      starburstSprites.push({ sprite, baseScale: scale, phase })
    }

    // Add outer orbital geodesic arcs + starburst intersections matching reference image
    ORBITAL_WEAVE_PATHS.forEach((orb, idx) => {
      const start = latLonToVec3Obj(orb.from[0], orb.from[1], GLOBE_RADIUS * 1.012)
      const end = latLonToVec3Obj(orb.to[0], orb.to[1], GLOBE_RADIUS * 1.012)
      const midHeight = GLOBE_RADIUS + orb.lift
      const q1 = start.clone().lerp(end, 0.25).normalize().multiplyScalar(midHeight * 0.99)
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(midHeight)
      const q2 = start.clone().lerp(end, 0.75).normalize().multiplyScalar(midHeight * 0.99)

      const curve = new THREE.CatmullRomCurve3([start, q1, mid, q2, end])
      const pts = curve.getPoints(64)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts)
      const lineMat = new THREE.LineBasicMaterial({
        color: '#DBEAFE',
        transparent: true,
        opacity: 0.34,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      globeGroup.add(line)
      disposableGeos.push(lineGeo)
      disposableMats.push(lineMat)

      addStarburstNode(q1, 0.14, idx * 0.9)
      addStarburstNode(q2, 0.12, idx * 1.3 + 0.5)
    })

    // Major interactive international connection arcs with optical starburst travel pulses
    GLOBAL_ARCS.forEach((arc, idx) => {
      const start = latLonToVec3Obj(arc.from[0], arc.from[1], GLOBE_RADIUS * 1.006)
      const end = latLonToVec3Obj(arc.to[0], arc.to[1], GLOBE_RADIUS * 1.006)
      const dist = start.distanceTo(end)
      const midHeight = GLOBE_RADIUS + Math.min(0.26, 0.08 + dist * 0.12)

      const q1 = start.clone().lerp(end, 0.28).normalize().multiplyScalar(midHeight * 0.97)
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(midHeight)
      const q2 = start.clone().lerp(end, 0.72).normalize().multiplyScalar(midHeight * 0.97)

      const curve = new THREE.CatmullRomCurve3([start, q1, mid, q2, end])
      const pts = curve.getPoints(60)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts)
      const lineMat =
        arc.style === 'dashed'
          ? new THREE.LineDashedMaterial({
              color: '#EFF6FF',
              dashSize: 0.032,
              gapSize: 0.022,
              transparent: true,
              opacity: 0.62,
            })
          : new THREE.LineBasicMaterial({
              color: '#FFFFFF',
              transparent: true,
              opacity: 0.56,
            })
      const line = new THREE.Line(lineGeo, lineMat)
      if (arc.style === 'dashed') line.computeLineDistances()
      globeGroup.add(line)
      disposableGeos.push(lineGeo)
      disposableMats.push(lineMat)

      addStarburstNode(mid, 0.16, idx * 0.7)

      const pulseMat = new THREE.SpriteMaterial({
        map: starburstTex,
        transparent: true,
        opacity: 0.96,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const pulseSprite = new THREE.Sprite(pulseMat)
      pulseSprite.scale.set(0.11, 0.11, 1)
      globeGroup.add(pulseSprite)
      disposableMats.push(pulseMat)
      arcPulses.push({
        curve,
        sprite: pulseSprite,
        speed: 0.13 + (idx % 3) * 0.03,
        offset: idx * 0.19,
      })
    })

    // 5. Midnight-Navy Teardrop Location Markers + Subtle Surface Rings
    const pinTexNormal = buildTeardropPinTexture(false)
    const pinTexActive = buildTeardropPinTexture(true)
    const markerMeshes = {}

    const createTeardropMarker = (key, lat, lon, pinScale, ringScale, hitRadius, meta) => {
      const surfacePos = latLonToVec3Obj(lat, lon, GLOBE_RADIUS * 1.007)
      const g = new THREE.Group()
      g.position.copy(surfacePos)
      g.lookAt(surfacePos.clone().multiplyScalar(2))

      // Subtle icy-white surface pulse rings beneath each teardrop pin
      const innerRippleGeo = new THREE.RingGeometry(0.015 * ringScale, 0.024 * ringScale, 28)
      const innerRippleMat = new THREE.MeshBasicMaterial({
        color: '#1E4E8C',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      })
      const innerRipple = new THREE.Mesh(innerRippleGeo, innerRippleMat)
      g.add(innerRipple)

      const outerRippleGeo = new THREE.RingGeometry(0.03 * ringScale, 0.042 * ringScale, 32)
      const outerRippleMat = new THREE.MeshBasicMaterial({
        color: '#93C5FD',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      })
      const outerRipple = new THREE.Mesh(outerRippleGeo, outerRippleMat)
      g.add(outerRipple)

      // Dark midnight-navy / white teardrop sprite pointing at surface coordinate
      const spriteMat = new THREE.SpriteMaterial({
        map: pinTexNormal,
        transparent: true,
        depthTest: true,
      })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.center.set(0.5, 0.1)
      sprite.scale.set(pinScale * 0.82, pinScale * 1.02, 1)
      sprite.position.set(0, 0, 0.014)
      g.add(sprite)

      const hitGeo = new THREE.SphereGeometry(hitRadius, 12, 12)
      const hitMat = new THREE.MeshBasicMaterial({ visible: false })
      const hitMesh = new THREE.Mesh(hitGeo, hitMat)
      hitMesh.userData = { markerKey: key, meta }
      g.add(hitMesh)

      globeGroup.add(g)
      disposableGeos.push(innerRippleGeo, outerRippleGeo, hitGeo)
      disposableMats.push(innerRippleMat, outerRippleMat, spriteMat, hitMat)

      markerMeshes[key] = {
        group: g,
        sprite,
        spriteMat,
        innerRippleMat,
        outerRipple,
        outerRippleMat,
        hitMesh,
        basePinScale: pinScale,
        meta,
      }
    }

    GLOBAL_MARKETS.forEach((country) => {
      createTeardropMarker(`country:${country.id}`, country.lat, country.lon, 0.115, 1.0, 0.085, {
        kind: 'country',
        id: country.id,
        name: country.name,
        coords: formatCoordinates(country.lat, country.lon),
      })
      country.cities.forEach((city) => {
        createTeardropMarker(
          `city:${country.id}:${city.id}`,
          city.lat,
          city.lon,
          0.088,
          0.78,
          0.06,
          {
            kind: 'city',
            id: city.id,
            countryId: country.id,
            name: city.name,
            coords: formatCoordinates(city.lat, city.lon),
          },
        )
      })
    })

    // Raycaster & pointer drag + touch drag
    const raycaster = new THREE.Raycaster()
    const pointerNdc = new THREE.Vector2()
    let downPos = { x: 0, y: 0 }

    const hitObjects = Object.values(markerMeshes).map((m) => m.hitMesh)

    const onPointerDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      interactionRef.current.isDragging = true
      interactionRef.current.lastX = e.clientX
      interactionRef.current.lastY = e.clientY
      downPos = { x: e.clientX, y: e.clientY }
      interactionRef.current.autoSpinPausedUntil = performance.now() + 5000

      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      if (interactionRef.current.isDragging) {
        const dx = e.clientX - interactionRef.current.lastX
        const dy = e.clientY - interactionRef.current.lastY
        interactionRef.current.lastX = e.clientX
        interactionRef.current.lastY = e.clientY
        interactionRef.current.userDragged = true
        interactionRef.current.autoSpinPausedUntil = performance.now() + 5000

        const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * 0.0055)
        const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy * 0.0055)
        interactionRef.current.targetQuat.premultiply(qYaw).premultiply(qPitch).normalize()
        return
      }

      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointerNdc, camera)

      const visibleHits = hitObjects.filter((h) => h.parent?.visible)
      const hits = raycaster.intersectObjects(visibleHits, false)

      if (hits.length > 0) {
        const { markerKey, meta } = hits[0].object.userData
        renderer.domElement.style.cursor = 'pointer'
        setHoveredMarker({ key: markerKey, ...meta })
      } else {
        renderer.domElement.style.cursor = interactionRef.current.isDragging ? 'grabbing' : 'grab'
        setHoveredMarker(null)
      }
    }

    const onPointerUp = (e) => {
      const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y)
      interactionRef.current.isDragging = false
      if (moved < 6) {
        const rect = renderer.domElement.getBoundingClientRect()
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointerNdc, camera)
        const visibleHits = hitObjects.filter((h) => h.parent?.visible)
        const hits = raycaster.intersectObjects(visibleHits, false)
        if (hits.length > 0) {
          const { markerKey } = hits[0].object.userData
          if (markerKey.startsWith('country:')) {
            onSelectCountry?.(markerKey.replace('country:', ''))
          } else if (markerKey.startsWith('city:')) {
            const [, cId, cityId] = markerKey.split(':')
            onSelectCity?.(cId, cityId)
          }
        }
      }
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    const onResize = () => {
      if (!host) return
      const w = Math.max(host.clientWidth || 480, 240)
      const h = Math.max(host.clientHeight || 480, 240)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let viewObserver = null
    if (typeof IntersectionObserver !== 'undefined') {
      viewObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return
          const visibleNow = entry.isIntersecting && entry.intersectionRatio >= 0.2
          interactionRef.current.isInView = visibleNow
          if (visibleNow && !interactionRef.current.hasEnteredView) {
            interactionRef.current.hasEnteredView = true
            if (!stateRef.current.focusedCountryId && !interactionRef.current.userDragged) {
              interactionRef.current.targetQuat = targetQuaternionForLatLon(
                DEFAULT_GLOBAL_LAT,
                DEFAULT_GLOBAL_LON,
                0.04,
              )
            }
            interactionRef.current.autoSpinPausedUntil = performance.now() + 2600
          }
        },
        { threshold: [0, 0.2, 0.5] },
      )
      viewObserver.observe(host)
    } else {
      interactionRef.current.isInView = true
    }

    let rafId = 0
    let lastFrameTime = performance.now()
    let prevMarkerSig = ''
    const tempWorld = new THREE.Vector3()
    const spinQuat = new THREE.Quaternion()

    const animate = (now) => {
      rafId = requestAnimationFrame(animate)
      const dt = Math.min((now - lastFrameTime) / 1000, 0.12)
      lastFrameTime = now

      const {
        focusedCountryId: focusId,
        selectedCountryId: selCountryId,
        selectedCityId: selCityId,
        hoveredKey: hovKey,
        zoomOffset: zOff,
      } = stateRef.current

      // Gentle idle 3D auto-rotation while section is visible in viewport
      if (
        !prefersReducedMotion &&
        interactionRef.current.isInView &&
        !focusId &&
        !interactionRef.current.isDragging &&
        now > interactionRef.current.autoSpinPausedUntil
      ) {
        spinQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), dt * 0.03)
        interactionRef.current.targetQuat.premultiply(spinQuat).normalize()
      }

      const slerpAlpha = prefersReducedMotion ? 1 : 1 - Math.exp(-7.5 * dt)
      globeGroup.quaternion.slerp(interactionRef.current.targetQuat, slerpAlpha)

      const activeFocusMarket = focusId ? GLOBAL_MARKETS.find((m) => m.id === focusId) : null
      const baseDist = activeFocusMarket
        ? Math.max(3.16, activeFocusMarket.camDistance * 1.2)
        : GLOBAL_CAM_Z
      const desiredCamZ = Math.max(2.74, Math.min(4.25, baseDist + zOff))
      camera.position.z += (desiredCamZ - camera.position.z) * (prefersReducedMotion ? 1 : slerpAlpha)

      // Twinkle optical starburst intersection nodes subtly
      starburstSprites.forEach((sb) => {
        const s = prefersReducedMotion
          ? sb.baseScale
          : sb.baseScale * (0.86 + Math.sin(now * 0.0025 + sb.phase) * 0.22)
        sb.sprite.scale.set(s, s, 1)
      })

      // Animate traveling starburst optical pulses along international arcs
      arcPulses.forEach((p) => {
        if (prefersReducedMotion) {
          p.sprite.visible = false
          return
        }
        p.sprite.visible = true
        const t = ((now * 0.001 * p.speed) + p.offset) % 1
        p.curve.getPointAt(t, p.sprite.position)
      })

      // Highlight selected / hovered country outlines subtly in crisp sky/cobalt
      Object.entries(countryHighlightGroups).forEach(([cId, obj]) => {
        const isLit = cId === focusId || cId === selCountryId || hovKey === `country:${cId}`
        obj.lines.visible = isLit
        if (isLit) {
          obj.mat.color.set(cId === focusId ? '#0284C7' : '#38BDF8')
          obj.mat.opacity = cId === focusId ? 0.94 : 0.72
        }
      })

      // Update Teardrop Markers & Projected Synchronized Labels
      const cw = renderer.domElement.clientWidth
      const ch = renderer.domElement.clientHeight
      const placeMarker = (rawX, rawY, prefPos) => {
        const x = Math.round(Math.max(52, Math.min(cw - 52, rawX)))
        const y = Math.round(Math.max(58, Math.min(ch - 52, rawY)))
        let pos = prefPos || 'ne'
        if (x < cw * 0.34 && pos.endsWith('w')) pos = pos.replace('w', 'e')
        else if (x > cw * 0.66 && pos.endsWith('e')) pos = pos.replace('e', 'w')
        return { x, y, pos }
      }
      const nextLabels = []

      GLOBAL_MARKETS.forEach((country) => {
        const cKey = `country:${country.id}`
        const countryBeacon = markerMeshes[cKey]
        const showCountryPin = !focusId
        if (countryBeacon) {
          countryBeacon.group.visible = showCountryPin
          const isSel = country.id === selCountryId
          const isHov = hovKey === cKey
          countryBeacon.spriteMat.map = isSel || isHov ? pinTexActive : pinTexNormal
          const s = countryBeacon.basePinScale * (isSel || isHov ? 1.24 : 1.0)
          countryBeacon.sprite.scale.set(s * 0.82, s * 1.02, 1)

          countryBeacon.innerRippleMat.color.set(isSel ? '#0284C7' : '#1E4E8C')
          countryBeacon.outerRippleMat.color.set(isSel ? '#38BDF8' : '#93C5FD')
          const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(now * 0.004 + country.lat) * 0.18
          countryBeacon.outerRipple.scale.setScalar(isSel ? pulse * 1.32 : pulse)

          if (showCountryPin) {
            countryBeacon.group.getWorldPosition(tempWorld)
            const facingCam = tempWorld.clone().normalize().dot(camera.position.clone().normalize())
            if (facingCam > 0.22) {
              const projected = tempWorld.clone().project(camera)
              const placed = placeMarker(
                (projected.x * 0.5 + 0.5) * cw,
                (-projected.y * 0.5 + 0.5) * ch,
                COUNTRY_LABEL_POS[country.id] || 'ne',
              )
              nextLabels.push({
                key: cKey,
                kind: 'country',
                id: country.id,
                name: country.name,
                coords: countryBeacon.meta.coords,
                x: placed.x,
                y: placed.y,
                active: isSel,
                labelPos: placed.pos,
                opacity: Math.min(1, Math.max(0.36, (facingCam - 0.15) * 2.1)),
              })
            }
          }
        }

        country.cities.forEach((city, idx) => {
          const cityKey = `city:${country.id}:${city.id}`
          const cityBeacon = markerMeshes[cityKey]
          const showCity = focusId === country.id
          if (cityBeacon) {
            cityBeacon.group.visible = showCity
            if (showCity) {
              const isSelCity = city.id === selCityId
              const isHovCity = hovKey === cityKey
              cityBeacon.spriteMat.map = isSelCity || isHovCity ? pinTexActive : pinTexNormal
              const s = cityBeacon.basePinScale * (isSelCity || isHovCity ? 1.26 : 1.0)
              cityBeacon.sprite.scale.set(s * 0.82, s * 1.02, 1)

              cityBeacon.innerRippleMat.color.set(isSelCity ? '#0284C7' : '#1E4E8C')
              cityBeacon.outerRippleMat.color.set(isSelCity ? '#38BDF8' : '#93C5FD')
              const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(now * 0.005 + idx) * 0.22
              cityBeacon.outerRipple.scale.setScalar(isSelCity ? pulse * 1.35 : pulse)

              cityBeacon.group.getWorldPosition(tempWorld)
              const facingCam = tempWorld.clone().normalize().dot(camera.position.clone().normalize())
              if (facingCam > 0.05) {
                const projected = tempWorld.clone().project(camera)
                const placed = placeMarker(
                  (projected.x * 0.5 + 0.5) * cw,
                  (-projected.y * 0.5 + 0.5) * ch,
                  city.labelPos || 'ne',
                )
                nextLabels.push({
                  key: cityKey,
                  kind: 'city',
                  id: city.id,
                  countryId: country.id,
                  name: city.name,
                  coords: cityBeacon.meta.coords,
                  x: placed.x,
                  y: placed.y,
                  active: isSelCity,
                  labelPos: placed.pos,
                  opacity: 1,
                })
              }
            }
          }
        })
      })

      // Separate overlapping pill labels cleanly across all viewports
      nextLabels.sort((a, b) => a.y - b.y)
      for (let i = 0; i < nextLabels.length; i += 1) {
        const cur = nextLabels[i]
        const curCenterX = cur.x + (cur.labelPos.endsWith('w') ? -54 : 54)
        const curCenterY = cur.y + (cur.labelPos.startsWith('n') ? -14 : 18)
        for (let j = 0; j < i; j += 1) {
          const prev = nextLabels[j]
          const prevCenterX = prev.x + (prev.labelPos.endsWith('w') ? -54 : 54)
          const prevCenterY = prev.y + (prev.labelPos.startsWith('n') ? -14 : 18)
          if (Math.abs(curCenterX - prevCenterX) < 104 && Math.abs(curCenterY - prevCenterY) < 26) {
            cur.y = Math.min(ch - 52, prev.y + 26)
          }
        }
      }

      const markerSig = nextLabels
        .map((m) => `${m.key}:${Math.round(m.x)}:${Math.round(m.y)}:${m.active ? 1 : 0}`)
        .join('|')
      if (markerSig !== prevMarkerSig) {
        prevMarkerSig = markerSig
        setScreenMarkers(nextLabels)
      }
      renderer.render(scene, camera)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      if (viewObserver) viewObserver.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('resize', onResize)
      disposableGeos.forEach((g) => g.dispose())
      disposableMats.forEach((m) => m.dispose())
      earthTextures.colorMap.dispose()
      earthTextures.emissiveMap.dispose()
      earthTextures.bumpMap.dispose()
      earthTextures.roughMap.dispose()
      starburstTex.dispose()
      pinTexNormal.dispose()
      pinTexActive.dispose()
      renderer.dispose()
    }
  }, [features, onSelectCountry, onSelectCity])

  return (
    <div ref={containerRef} className="globe-3d-wrapper">
      {/* Top interactive mode & zoom controls */}
      <div className="globe-controls-bar">
        {focusedCountry ? (
          <button
            type="button"
            className="globe-back-btn"
            onClick={() => onResetGlobe?.()}
          >
            &larr; Global View ({focusedCountry.name})
          </button>
        ) : (
          <span className="globe-mode-chip">Global 3D Earth &bull; Select a location</span>
        )}

        <div className="globe-zoom-group" role="group" aria-label="Globe zoom controls">
          <button
            type="button"
            className="globe-zoom-btn"
            aria-label="Zoom in globe"
            onClick={() => setZoomOffset((z) => Math.max(-0.65, z - 0.25))}
          >
            +
          </button>
          <button
            type="button"
            className="globe-zoom-btn"
            aria-label="Zoom out globe"
            onClick={() => setZoomOffset((z) => Math.min(0.65, z + 0.25))}
          >
            &minus;
          </button>
        </div>
      </div>

      {/* Main 3D Interactive Earth WebGL Stage */}
      {webglReady ? (
        <div
          ref={mountRef}
          className="globe-3d-canvas-host"
          aria-label="Interactive 3D Global Earth Globe"
        />
      ) : (
        <div className="globe-svg-fallback" aria-label="Global Earth Overview">
          <svg viewBox="0 0 360 360" className="globe-fallback-svg" role="img">
            <defs>
              <radialGradient id="vvEarthGrad" cx="42%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#1D64BA" />
                <stop offset="65%" stopColor="#154F99" />
                <stop offset="100%" stopColor="#0D3B75" />
              </radialGradient>
            </defs>
            <circle cx="180" cy="180" r="144" fill="url(#vvEarthGrad)" stroke="#BAE6FD" strokeWidth="2.5" />
            <ellipse cx="180" cy="180" rx="144" ry="54" fill="none" stroke="rgba(219,234,254,0.38)" strokeWidth="1" />
            <ellipse cx="180" cy="180" rx="68" ry="144" fill="none" stroke="rgba(219,234,254,0.38)" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* Soft studio contact shadow underneath the floating reference globe */}
      <div className="globe-contact-shadow" aria-hidden="true" />

      {/* Projected Clickable & Hoverable Location Pills synchronized with 3D Markers */}
      {webglReady && (
        <div className="globe-pins-overlay" aria-hidden="false">
          {screenMarkers.map((pin) => {
            const isHovered = hoveredMarker?.key === pin.key
            return (
              <button
                key={pin.key}
                type="button"
                className={`globe-pin-pill label-${pin.labelPos} ${pin.kind === 'city' ? 'is-city' : 'is-country'} ${
                  pin.active ? 'active' : ''
                } ${isHovered ? 'hovered' : ''}`}
                style={{
                  left: `${pin.x}px`,
                  top: `${pin.y}px`,
                  opacity: pin.opacity,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (pin.kind === 'country') {
                    onSelectCountry?.(pin.id)
                  } else {
                    onSelectCity?.(pin.countryId, pin.id)
                  }
                }}
                onMouseEnter={() => setHoveredMarker(pin)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                <span className="pin-dot" />
                <span>{pin.name}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Hovered marker coordinate readout + bottom drag hint */}
      {hoveredMarker && (
        <div className="globe-hover-tooltip" role="status">
          <strong>{hoveredMarker.name}</strong>
          <span>{hoveredMarker.coords}</span>
        </div>
      )}

      <div className="globe-drag-hint">
        {focusedCountry
          ? `Viewing ${focusedCountry.name} • Drag Earth to rotate • Click Global View to reset`
          : 'Drag Earth to rotate • Hover or click any marker pin to explore'}
      </div>
    </div>
  )
}
