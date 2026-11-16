import { useEffect, useState, useRef } from 'react'
import { Phone, Mail, ShieldCheck, Store, User, Building2, ArrowRight, Lock, Sparkles, Truck, FileText, Globe, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { HOME, ROLES } from '../roles.js'
import { ME } from '../data.jsx'
import { Button, Input, Segmented, Screen, Checkbox, Banner, useForm, cx } from '../ui.jsx'
import './auth-visuals.css'

export function Logo({ size = 64, light }) {
  const iconSz = Math.max(16, Math.round(size * 0.58))
  const fontSize = Math.max(9, Math.round(size * 0.34))
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: light ? '#ffffff' : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
        boxShadow: light ? 'none' : '0 6px 18px rgba(56, 189, 248, 0.36)',
      }}
      className="inline-flex shrink-0 items-center justify-center relative overflow-hidden"
    >
      <div className="brand-bag-rotator flex items-center justify-center relative" style={{ width: iconSz, height: iconSz }}>
        <svg
          width={iconSz}
          height={iconSz}
          viewBox="0 0 24 24"
          fill="none"
          stroke={light ? '#0284c7' : '#ffffff'}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <span
          className="brand-v-glyph absolute font-black"
          style={{
            fontSize,
            color: light ? '#0284c7' : '#ffffff',
            transform: 'translate(-50%, -46%)',
            left: '50%',
            top: '50%',
          }}
        >
          V
        </span>
      </div>
    </div>
  )
}

export function useSignIn() {
  const { setMe } = useApp()
  const nav = useNav()
  return (role, extra = {}, destination = HOME[role], destinationParams = {}) => {
    setMe({ role, loggedIn: true, guest: false, vendorId: 'v-me', name: ME[role], ...extra })
    nav.reset(destination || HOME[role], destinationParams)
  }
}

export function Splash() {
  const nav = useNav()
  useEffect(() => {
    const t = setTimeout(() => nav.reset('c_home'), 1600)
    return () => clearTimeout(t)
  }, [])
  return (
    <div onClick={() => nav.reset('c_home')} className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c2a44] via-[#164e75] to-[#0284c7] text-white">
      <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 -right-16 size-80 rounded-full bg-white/5" />
      <div className="vv-splash-loader"><div className="vv-splash-orbit vv-splash-orbit-a" /><div className="vv-splash-orbit vv-splash-orbit-b" /><div className="vv-splash-core"><Logo size={78} light /></div></div>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight">VendorVerse</h1>
      <p className="mt-1.5 text-sm text-white/80">Global Marketplace · Products · Services · Quotes</p>
      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/70"><span className="size-2 animate-pulse rounded-full bg-sky-300" />Preparing your marketplace</div>
      <p className="absolute bottom-10 text-[11px] tracking-widest text-white/50">ADRSTECHNO PRIVATE LIMITED</p>
    </div>
  )
}

const normalizePhone = (value = '') => String(value).replace(/\D/g, '').slice(-10)
const isPhone = (value) => normalizePhone(value).length === 10
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s).trim())
const DEMO_OTP = '123456'
const ADMIN_MFA = '654321'

const FLOWER_SEEDS = [
  { x: 54, y: 345, s: 0.82, rot: 3.5, delay: -1.2 },
  { x: 142, y: 380, s: 0.95, rot: 4.2, delay: -2.8 },
  { x: 230, y: 320, s: 0.75, rot: 3.0, delay: -0.5 },
  { x: 310, y: 360, s: 1.05, rot: 5.1, delay: -3.4 },
  { x: 420, y: 335, s: 0.88, rot: 3.8, delay: -1.9 },
  { x: 530, y: 375, s: 0.70, rot: 4.5, delay: -2.1 },
  { x: 640, y: 340, s: 0.92, rot: 3.2, delay: -0.8 },
  { x: 750, y: 385, s: 1.10, rot: 5.0, delay: -3.9 },
  { x: 860, y: 325, s: 0.85, rot: 3.6, delay: -1.5 },
  { x: 970, y: 365, s: 0.78, rot: 4.0, delay: -2.4 },
  { x: 1080, y: 330, s: 1.00, rot: 4.8, delay: -3.1 },
  { x: 1190, y: 370, s: 0.82, rot: 3.4, delay: -1.0 },
  { x: 1280, y: 345, s: 0.90, rot: 4.2, delay: -2.6 },
  { x: 1370, y: 380, s: 1.08, rot: 5.2, delay: -3.7 },
  { x: 95, y: 330, s: 0.72, rot: 3.9, delay: -1.7 },
  { x: 185, y: 370, s: 1.02, rot: 4.6, delay: -3.3 },
  { x: 475, y: 350, s: 0.84, rot: 3.3, delay: -0.9 },
  { x: 585, y: 330, s: 0.96, rot: 4.7, delay: -2.9 },
  { x: 810, y: 360, s: 0.76, rot: 3.7, delay: -1.4 },
  { x: 920, y: 340, s: 1.04, rot: 5.1, delay: -3.6 },
  { x: 1140, y: 355, s: 0.86, rot: 3.5, delay: -1.3 },
  { x: 1240, y: 335, s: 0.94, rot: 4.4, delay: -2.5 },
  { x: 1340, y: 365, s: 0.80, rot: 3.8, delay: -1.8 },
  { x: 1410, y: 340, s: 1.00, rot: 4.9, delay: -3.2 },
]

const GRASS_SEEDS = [
  { x: 30, y: 310, s: 0.85, rot: 3.2, delay: -0.6 },
  { x: 80, y: 340, s: 1.10, rot: 4.5, delay: -2.3 },
  { x: 160, y: 325, s: 0.90, rot: 3.8, delay: -1.5 },
  { x: 260, y: 350, s: 1.05, rot: 4.8, delay: -3.2 },
  { x: 360, y: 330, s: 0.75, rot: 3.4, delay: -0.9 },
  { x: 450, y: 365, s: 1.15, rot: 5.2, delay: -3.8 },
  { x: 550, y: 335, s: 0.95, rot: 4.1, delay: -1.8 },
  { x: 670, y: 355, s: 0.80, rot: 3.5, delay: -1.2 },
  { x: 780, y: 320, s: 1.00, rot: 4.6, delay: -2.7 },
  { x: 890, y: 360, s: 1.20, rot: 5.0, delay: -3.5 },
  { x: 1000, y: 330, s: 0.88, rot: 3.6, delay: -1.4 },
  { x: 1110, y: 370, s: 1.05, rot: 4.9, delay: -3.0 },
  { x: 1210, y: 340, s: 0.78, rot: 3.3, delay: -0.8 },
  { x: 1310, y: 365, s: 1.12, rot: 5.1, delay: -3.6 },
  { x: 1420, y: 335, s: 0.92, rot: 4.2, delay: -2.0 },
  { x: 120, y: 355, s: 0.85, rot: 3.7, delay: -1.6 },
  { x: 210, y: 330, s: 1.02, rot: 4.4, delay: -2.5 },
  { x: 490, y: 345, s: 0.90, rot: 3.9, delay: -1.7 },
  { x: 610, y: 365, s: 1.08, rot: 4.7, delay: -3.1 },
  { x: 720, y: 335, s: 0.82, rot: 3.4, delay: -1.0 },
  { x: 840, y: 370, s: 1.14, rot: 5.3, delay: -3.9 },
  { x: 950, y: 340, s: 0.96, rot: 4.0, delay: -2.1 },
  { x: 1050, y: 360, s: 0.86, rot: 3.7, delay: -1.5 },
  { x: 1160, y: 330, s: 1.04, rot: 4.8, delay: -3.3 },
  { x: 1260, y: 355, s: 0.94, rot: 4.3, delay: -2.4 },
  { x: 1360, y: 330, s: 0.80, rot: 3.5, delay: -1.1 },
]

function burstConfetti(anchorEl) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = anchorEl?.getBoundingClientRect() || {
    left: window.innerWidth / 2,
    top: window.innerHeight / 2,
    width: 0,
  }
  const cols = ['#0284c7', '#38bdf8', '#7dd3fc', '#0ea5e9', '#facc15', '#10b981']
  for (let i = 0; i < 34; i++) {
    const c = document.createElement('i')
    c.className = 'vv-auth-confetti'
    const a = Math.random() * Math.PI * 2
    const d = 120 + Math.random() * 220
    const tx = Math.cos(a) * d
    const ty = Math.sin(a) * d - 100 + 240
    const rot = Math.random() * 720 - 360
    c.style.cssText = `left:${rect.left + rect.width / 2}px;top:${rect.top}px;background:${cols[i % cols.length]};--x:${tx}px;--y:${ty}px;--r:${rot}deg;`
    document.body.appendChild(c)
    setTimeout(() => c.remove(), 1500)
  }
}

/**
 * Unified Interactive Auth Experience with Animated Sky, Landscape Scenery,
 * Interactive Mascot Puppy, and Glassmorphism Card (matching the HTML reference).
 */
export function InteractiveAuthCard({ params = {} }) {
  const nav = useNav()
  const { setMe, toast } = useApp()
  const signIn = useSignIn()

  const [method, setMethod] = useState('phone')
  const [role, setRole] = useState(params.role || 'customer')
  const [phoneVal, setPhoneVal] = useState('9829000001')
  const [countryCode, setCountryCode] = useState('+91')
  const [emailVal, setEmailVal] = useState('')
  const [passwordVal, setPasswordVal] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // In-Card OTP flow
  const [phoneStep, setPhoneStep] = useState('input')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [otpTimer, setOtpTimer] = useState(30)

  // Feedback & mascot state
  const [errMsg, setErrMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cardShake, setCardShake] = useState(false)

  // Mascot dynamic positions
  const [headPos, setHeadPos] = useState({ x: 0, y: 0, rot: 0 })
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 })
  const [isCovering, setIsCovering] = useState(false)
  const [isPeeking, setIsPeeking] = useState(false)
  const [isSad, setIsSad] = useState(false)
  const [isHappy, setIsHappy] = useState(false)

  const modeRef = useRef('idle')
  const mascotRef = useRef(null)
  const phoneInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const sendOtpBtnRef = useRef(null)
  const verifyBtnRef = useRef(null)
  const emailBtnRef = useRef(null)
  const otpInputRefs = useRef([])

  useEffect(() => {
    if (params.role) setRole(params.role)
  }, [params.role])

  // Look function updates mascot pupils and head tilt
  const look = (x, y) => {
    setPupilPos({ x: x * 4.2, y: y * 3.6 })
    setHeadPos({ x: x * 3.0, y: y * 1.6, rot: x * 3.5 })
  }

  // Pointer move tracking for idle mascot gaze
  useEffect(() => {
    const onPointerMove = (e) => {
      if (modeRef.current !== 'idle') return
      if (!mascotRef.current) return
      const rect = mascotRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height * 0.5
      const clamp = (v) => Math.max(-1, Math.min(1, v))
      const nx = clamp((e.clientX - cx) / (window.innerWidth * 0.35))
      const ny = clamp((e.clientY - cy) / (window.innerHeight * 0.45))
      look(nx, ny)
    }
    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  // Input caret tracking: puppy watches where the user is typing
  const handleInputFocus = (maxChars = 20) => (e) => {
    modeRef.current = 'type'
    const pos = e.target.selectionStart ?? e.target.value?.length ?? 0
    const ratio = Math.min(1, pos / maxChars)
    look(-0.85 + 1.7 * ratio, 0.75)
  }

  const handleInputBlur = () => {
    modeRef.current = 'idle'
    look(0, 0)
  }

  // Password focus triggers paws covering eyes
  const handlePasswordFocus = () => {
    modeRef.current = 'pw'
    look(0, 0.2)
    setIsCovering(true)
    setIsPeeking(showPassword)
  }

  const handlePasswordBlur = () => {
    modeRef.current = 'idle'
    setIsCovering(false)
    setIsPeeking(false)
    look(0, 0)
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => {
      const next = !prev
      if (modeRef.current === 'pw') {
        setIsPeeking(next)
      }
      return next
    })
  }

  // OTP Countdown timer
  useEffect(() => {
    if (phoneStep !== 'otp') return
    if (otpTimer <= 0) return
    const t = setTimeout(() => setOtpTimer((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phoneStep, otpTimer])

  // Trigger error shake & sad mascot
  const triggerError = (msg) => {
    setErrMsg(msg)
    setInfoMsg('')
    setSuccessMsg('')
    setIsSad(true)
    setCardShake(true)
    setTimeout(() => setCardShake(false), 550)
    setTimeout(() => setIsSad(false), 2400)
  }

  // Trigger happy hop & confetti
  const triggerSuccess = (anchorEl, successText, callback) => {
    setSuccessMsg(successText)
    setErrMsg('')
    setInfoMsg('')
    setIsHappy(true)
    burstConfetti(anchorEl)
    setTimeout(() => {
      setIsHappy(false)
      callback?.()
    }, 1100)
  }

  // Phone submission -> Send OTP
  const submitPhone = (e) => {
    e?.preventDefault()
    const cleanPhone = normalizePhone(phoneVal)
    if (!isPhone(cleanPhone)) {
      triggerError('Enter a valid 10-digit mobile number')
      phoneInputRef.current?.focus()
      return
    }
    setIsLoading(true)
    setErrMsg('')
    setTimeout(() => {
      setIsLoading(false)
      setPhoneStep('otp')
      setOtpTimer(30)
      setInfoMsg(`OTP sent to ${countryCode} ${cleanPhone}. Enter code to sign in.`)
      setTimeout(() => {
        otpInputRefs.current[0]?.focus()
        modeRef.current = 'type'
        look(-0.7, 0.75)
      }, 100)
    }, 500)
  }

  // In-Card OTP digit change
  const handleOtpInput = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const nextDigits = [...otpDigits]
    nextDigits[index] = digit
    setOtpDigits(nextDigits)
    setErrMsg('')
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
    const fullCode = nextDigits.join('')
    if (fullCode.length === 6) {
      verifyOtp(fullCode)
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      verifyOtp()
    }
  }

  const handleOtpPaste = (e) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const nextDigits = [...otpDigits]
    for (let i = 0; i < text.length; i++) {
      nextDigits[i] = text[i]
    }
    setOtpDigits(nextDigits)
    setErrMsg('')
    const focusIndex = Math.min(text.length, 5)
    otpInputRefs.current[focusIndex]?.focus()
    if (text.length === 6) {
      verifyOtp(text)
    }
  }

  // Verify OTP handler
  const verifyOtp = (codeToVerify) => {
    const code = (typeof codeToVerify === 'string' ? codeToVerify : otpDigits.join('')).trim()
    if (code.length < 6) {
      triggerError('Enter all 6 digits of the OTP')
      return
    }
    const target = (role === 'admin' ? ADMIN_MFA : DEMO_OTP)
    if (code !== target) {
      triggerError(`Incorrect OTP. Use demo code ${target}`)
      return
    }
    setIsLoading(true)
    const fullPhone = `${countryCode} ${normalizePhone(phoneVal)}`
    triggerSuccess(verifyBtnRef.current, '✓ Verified successfully!', () => {
      setIsLoading(false)
      signIn(role, { phone: fullPhone }, params.next || HOME[role], params.nextParams || {})
      toast('Signed in successfully')
    })
  }

  // Email submission
  const submitEmail = (e) => {
    e?.preventDefault()
    const okEmail = isEmail(emailVal)
    const okPass = passwordVal.length >= 4
    if (!okEmail || !okPass) {
      triggerError(!okEmail ? 'Please enter a valid email address' : 'Password must be at least 4 characters')
      if (!okEmail) emailInputRef.current?.focus()
      else passwordInputRef.current?.focus()
      return
    }
    setIsLoading(true)
    triggerSuccess(emailBtnRef.current, '✓ Signed in successfully!', () => {
      setIsLoading(false)
      signIn(role, { email: emailVal, name: ME[role] }, params.next || HOME[role], params.nextParams || {})
      toast('Signed in successfully')
    })
  }

  return (
    <div className="vv-auth-stage">
      {/* Animated Sky Background */}
      <div className="vv-auth-sky" aria-hidden="true">
        <div className="vv-auth-sun" />
        <div className="vv-auth-cloud" style={{ '--w': '230px', '--t': '95s', '--dl': '-30s', top: '8%' }}>
          <svg viewBox="0 0 220 80">
            <path d="M42 74a26 26 0 0 1 4-51 36 36 0 0 1 68-6 30 30 0 0 1 50 23 25 25 0 0 1-2 34z" />
          </svg>
        </div>
        <div className="vv-auth-cloud" style={{ '--w': '150px', '--t': '120s', '--dl': '-80s', top: '22%' }}>
          <svg viewBox="0 0 220 80">
            <path d="M42 74a26 26 0 0 1 4-51 36 36 0 0 1 68-6 30 30 0 0 1 50 23 25 25 0 0 1-2 34z" />
          </svg>
        </div>
        <div className="vv-auth-cloud" style={{ '--w': '190px', '--t': '140s', '--dl': '-10s', top: '4%' }}>
          <svg viewBox="0 0 220 80">
            <path d="M42 74a26 26 0 0 1 4-51 36 36 0 0 1 68-6 30 30 0 0 1 50 23 25 25 0 0 1-2 34z" />
          </svg>
        </div>
      </div>

      {/* Layered Landscape Meadow Scene */}
      <svg className="vv-auth-scene" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="vvHillBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c3e36b" />
            <stop offset="100%" stopColor="#a5d352" />
          </linearGradient>
          <linearGradient id="vvHillFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fcf4a" />
            <stop offset="100%" stopColor="#6bb73b" />
          </linearGradient>
          <linearGradient id="vvWood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d28a4a" />
            <stop offset="100%" stopColor="#a8602c" />
          </linearGradient>
          <linearGradient id="vvBush" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6dbf45" />
            <stop offset="100%" stopColor="#4b9a30" />
          </linearGradient>
          <linearGradient id="vvRock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a9a8cf" />
            <stop offset="100%" stopColor="#8584ad" />
          </linearGradient>
        </defs>
        {/* Back hill */}
        <path className="hb" d="M0 190C220 110 430 150 660 215S1110 120 1440 175V420H0z" fill="url(#vvHillBack)" />
        {/* Fence */}
        <g fill="url(#vvWood)" opacity="0.85">
          <rect x="22" y="178" width="270" height="9" rx="4" />
          <rect x="22" y="212" width="270" height="9" rx="4" />
          <rect x="30" y="140" width="26" height="130" rx="12" />
          <rect x="104" y="128" width="26" height="140" rx="12" />
          <rect x="178" y="136" width="26" height="140" rx="12" />
          <rect x="252" y="150" width="26" height="130" rx="12" />
        </g>
        {/* Front hill */}
        <path className="hf" d="M0 262C260 205 520 245 740 300S1190 215 1440 255V420H0z" fill="url(#vvHillFront)" />
        {/* Bushes */}
        <g>
          <g fill="url(#vvBush)">
            <circle cx="48" cy="318" r="52" />
            <circle cx="108" cy="338" r="42" />
            <circle cx="18" cy="360" r="40" />
          </g>
          <g fill="#93d35f" opacity="0.55">
            <circle cx="34" cy="298" r="16" />
            <circle cx="100" cy="324" r="11" />
          </g>
          <g fill="url(#vvBush)">
            <circle cx="1396" cy="274" r="54" />
            <circle cx="1340" cy="306" r="40" />
            <circle cx="1420" cy="340" r="44" />
          </g>
          <g fill="#93d35f" opacity="0.55">
            <circle cx="1384" cy="254" r="17" />
            <circle cx="1330" cy="292" r="11" />
          </g>
          <g className="vv-auth-sway" style={{ '--s': '5s' }}>
            <path d="M1395 232q-4-30 2-52" stroke="#3f8f2a" strokeWidth="4" fill="none" strokeLinecap="round" />
            <ellipse cx="1398" cy="176" rx="6" ry="14" fill="#93d35f" />
          </g>
        </g>
        {/* Rocks */}
        <g>
          <ellipse cx="120" cy="412" rx="105" ry="56" fill="url(#vvRock)" />
          <ellipse cx="82" cy="388" rx="38" ry="14" fill="#ffffff" opacity="0.28" />
          <ellipse cx="1330" cy="418" rx="92" ry="44" fill="url(#vvRock)" />
          <ellipse cx="1350" cy="400" rx="30" ry="10" fill="#ffffff" opacity="0.25" />
        </g>
        {/* Flowers */}
        <g id="vv-flowers">
          {FLOWER_SEEDS.map((f, idx) => (
            <g key={idx} transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
              <g className="vv-auth-sway" style={{ '--s': `${f.rot}s`, '--d': `${f.delay}s` }}>
                <path d="M0 0q-2 16 0 30" stroke="#3f8f2a" strokeWidth="3" fill="none" />
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="0"
                    cy="-9"
                    rx="5.5"
                    ry="9"
                    fill="#ffffff"
                    stroke="rgba(2, 132, 199, 0.15)"
                    strokeWidth="0.8"
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle r="6" fill="#facc15" />
                <circle r="2.6" fill="#f59e0b" />
              </g>
            </g>
          ))}
        </g>
        {/* Grass blades */}
        <g id="vv-grass">
          {GRASS_SEEDS.map((g, idx) => (
            <g key={idx} transform={`translate(${g.x} ${g.y}) scale(${g.s})`}>
              <path
                className="vv-auth-sway"
                style={{ '--s': `${g.rot}s`, '--d': `${g.delay}s` }}
                d="M0 0Q-3-14-7-22M0 0Q0-16 1-27M0 0Q4-12 9-20"
                stroke="#3f8f2a"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Main Wrap */}
      <div className="vv-auth-wrap">
        {/* Animated Mascot (Puppy) */}
        <svg
          ref={mascotRef}
          className={cx(
            'vv-mascot',
            isCovering && 'covering',
            isPeeking && 'peeking',
            isSad && 'sad',
            isHappy && 'happy'
          )}
          viewBox="0 0 200 172"
          aria-hidden="true"
        >
          <g id="bob">
            {/* Body */}
            <path className="ol" d="M58 172c0-24 12-42 42-42s42 18 42 42z" fill="#f7a23c" />
            <path d="M92 134q8 6 16 0l4 38H88z" fill="#fff7ec" />
            {/* Head with interactive transform */}
            <g
              id="head"
              style={{
                transform: `translate(${headPos.x.toFixed(2)}px, ${headPos.y.toFixed(2)}px) rotate(${headPos.rot.toFixed(2)}deg)`,
              }}
            >
              <g className="ear l">
                <path className="ol" d="M62 56C34 38 14 62 18 96c3 22 22 30 36 18 10-9 12-30 12-46z" fill="#e57f1e" />
                <path d="M52 64c-14-6-24 6-22 26 2 12 10 16 17 10 6-6 7-20 5-36z" fill="#f7a5b4" opacity="0.85" />
              </g>
              <g className="ear r">
                <path className="ol" d="M138 56c28-18 48 6 44 40-3 22-22 30-36 18-10-9-12-30-12-46z" fill="#e57f1e" />
                <path d="M148 64c14-6 24 6 22 26-2 12-10 16-17 10-6-6-7-20-5-36z" fill="#f7a5b4" opacity="0.85" />
              </g>
              <ellipse className="ol" cx="100" cy="90" rx="54" ry="47" fill="#f7a23c" />
              <path d="M91 44q9-8 18 0l3 36q-12 10-24 0z" fill="#ffffff" />
              <ellipse cx="100" cy="112" rx="32" ry="24" fill="#fff7ec" />
              <ellipse cx="62" cy="106" rx="11" ry="7.5" fill="#ff7f9a" opacity="0.5" />
              <ellipse cx="138" cy="106" rx="11" ry="7.5" fill="#ff7f9a" opacity="0.5" />
              {/* Eyes with interactive pupil tracking */}
              <g className="eye l">
                <ellipse cx="78" cy="86" rx="12" ry="13.5" fill="#ffffff" className="ol" style={{ strokeWidth: 1.6 }} />
                <g
                  className="pupil"
                  style={{
                    transform: `translate(${pupilPos.x.toFixed(2)}px, ${pupilPos.y.toFixed(2)}px)`,
                  }}
                >
                  <ellipse cx="78" cy="87" rx="9.5" ry="11" fill="#3a1c0b" />
                  <circle cx="74.5" cy="82" r="3.6" fill="#ffffff" />
                  <circle cx="82" cy="92" r="1.8" fill="#ffffff" />
                </g>
              </g>
              <g className="eye r">
                <ellipse cx="122" cy="86" rx="12" ry="13.5" fill="#ffffff" className="ol" style={{ strokeWidth: 1.6 }} />
                <g
                  className="pupil"
                  style={{
                    transform: `translate(${pupilPos.x.toFixed(2)}px, ${pupilPos.y.toFixed(2)}px)`,
                  }}
                >
                  <ellipse cx="122" cy="87" rx="9.5" ry="11" fill="#3a1c0b" />
                  <circle cx="118.5" cy="82" r="3.6" fill="#ffffff" />
                  <circle cx="126" cy="92" r="1.8" fill="#ffffff" />
                </g>
              </g>
              {/* Error Tear */}
              <path className="tear" d="M70 100q-4 8 0 11 4-3 0-11z" fill="#38bdf8" />
              {/* Nose */}
              <path d="M92 101q8-6 16 0 0 7-8 8-8-1-8-8z" fill="#3a1c0b" />
              <ellipse cx="97" cy="102" rx="3" ry="1.6" fill="#ffffff" opacity="0.6" />
              {/* Mouth variants */}
              <g className="mouth-happy">
                <path d="M100 109v5" stroke="#5c3514" strokeWidth="2" fill="none" />
                <path d="M84 112q8 10 16 2 8 8 16-2" stroke="#5c3514" strokeWidth="2.2" fill="none" />
                <path d="M93 117q7 14 14 0z" fill="#ff7f9a" stroke="#5c3514" strokeWidth="1.6" />
              </g>
              <g className="mouth-open">
                <path d="M100 109v3" stroke="#5c3514" strokeWidth="2" fill="none" />
                <path d="M82 112q18 28 36 0z" fill="#7a2a2a" stroke="#5c3514" strokeWidth="2" />
                <path d="M92 126q8-8 16 0-8 6-16 0z" fill="#ff7f9a" />
              </g>
              <g className="mouth-sad">
                <path d="M100 109v4" stroke="#5c3514" strokeWidth="2" fill="none" />
                <path d="M87 123q13-12 26 0" stroke="#5c3514" strokeWidth="2.2" fill="none" />
              </g>
            </g>
            {/* Resting Paws */}
            <g className="rest-paws">
              <g className="ol" fill="#ffffff">
                <ellipse cx="74" cy="166" rx="18" ry="13" />
                <ellipse cx="126" cy="166" rx="18" ry="13" />
              </g>
              <g stroke="#5c3514" strokeWidth="1.6" fill="none">
                <path d="M68 156v8M75 155v9M82 157v7M118 157v7M125 155v9M132 156v8" />
              </g>
            </g>
            {/* Covering Paws */}
            <g className="cover-paws">
              <g className="ol" fill="#ffffff">
                <ellipse cx="76" cy="92" rx="21" ry="26" transform="rotate(-8 76 92)" />
                <ellipse cx="124" cy="92" rx="21" ry="26" transform="rotate(8 124 92)" />
              </g>
              <g className="pads" fill="#ff8aa5">
                <g transform="rotate(-8 76 92)">
                  <ellipse cx="76" cy="98" rx="9" ry="8" />
                  <circle cx="64" cy="84" r="3.6" />
                  <circle cx="71" cy="78" r="3.6" />
                  <circle cx="81" cy="78" r="3.6" />
                  <circle cx="88" cy="84" r="3.6" />
                </g>
                <g transform="rotate(8 124 92)">
                  <ellipse cx="124" cy="98" rx="9" ry="8" />
                  <circle cx="112" cy="84" r="3.6" />
                  <circle cx="119" cy="78" r="3.6" />
                  <circle cx="129" cy="78" r="3.6" />
                  <circle cx="136" cy="84" r="3.6" />
                </g>
              </g>
            </g>
          </g>
        </svg>

        {/* Glassmorphism Login Card */}
        <div className={cx('vv-auth-card', cardShake && 'shake')}>
          <header className="vv-auth-header">
            <h1 className="vv-auth-title" aria-label="Welcome to VendorVerse">
              <span className="vv-word">Welcome</span>{' '}
              <span className="vv-word">to</span>{' '}
              <span className="vv-word vv-brand-word">VendorVerse</span>
            </h1>
            <p className="vv-auth-sub">Sign in to continue to your dashboard.</p>
          </header>

          {/* Sign In Method Tabs */}
          <div className="vv-auth-tabs" role="tablist" aria-label="Sign in method">
            <button
              type="button"
              role="tab"
              aria-selected={method === 'phone'}
              onClick={() => {
                setMethod('phone')
                setErrMsg('')
                setInfoMsg('')
                setIsCovering(false)
                setIsPeeking(false)
                setShowPassword(false)
                modeRef.current = 'idle'
                look(0, 0)
              }}
              className="vv-auth-tab"
            >
              Phone
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={method === 'email'}
              onClick={() => {
                setMethod('email')
                setErrMsg('')
                setInfoMsg('')
                setIsCovering(false)
                setIsPeeking(false)
                setShowPassword(false)
                modeRef.current = 'idle'
                look(0, 0)
              }}
              className="vv-auth-tab"
            >
              Email
            </button>
          </div>

          {/* Method: Phone */}
          {method === 'phone' ? (
            phoneStep === 'input' ? (
              <form onSubmit={submitPhone}>
                <div className="vv-auth-group">
                  <label className="vv-auth-label">Mobile number</label>
                  <div className="vv-auth-phone-box" data-invalid={Boolean(errMsg && !isPhone(phoneVal))}>
                    <select
                      aria-label="Country calling code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="vv-auth-cc-select"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+49">🇩🇪 +49</option>
                    </select>
                    <div className="vv-auth-phone-input-wrap">
                      <Phone size={17} />
                      <input
                        ref={phoneInputRef}
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="98290 00001"
                        value={phoneVal}
                        onChange={(e) => {
                          setPhoneVal(e.target.value.replace(/\D/g, ''))
                          setErrMsg('')
                        }}
                        onFocus={handleInputFocus(10)}
                        onInput={handleInputFocus(10)}
                        onBlur={handleInputBlur}
                        className="vv-auth-phone-input"
                      />
                    </div>
                  </div>
                  <p className="vv-auth-hint">Standard SMS rates may apply</p>
                </div>

                <button
                  ref={sendOtpBtnRef}
                  type="submit"
                  disabled={isLoading}
                  className={cx('vv-auth-btn', isLoading && 'loading')}
                >
                  <span className="lab">Send OTP</span>
                  <span className="spin"><i className="vv-auth-spinner" /></span>
                  <span className="done">✓ OTP sent</span>
                </button>
              </form>
            ) : (
              <div>
                <div className="vv-auth-otp-top">
                  <span>Code sent to <strong>{countryCode} {phoneVal}</strong></span>
                  <button
                    type="button"
                    className="vv-auth-link"
                    style={{ background: 'none', border: 0, cursor: 'pointer' }}
                    onClick={() => {
                      setPhoneStep('input')
                      setErrMsg('')
                      setInfoMsg('')
                    }}
                  >
                    Change
                  </button>
                </div>

                <div className="vv-auth-otp-grid" role="group" aria-label="One-time password">
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpInputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      onFocus={() => {
                        modeRef.current = 'type'
                        look(-0.7 + 1.4 * (i / 5), 0.75)
                      }}
                      onBlur={handleInputBlur}
                      className="vv-auth-otp-input"
                      aria-label={`Digit ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="vv-auth-otp-banner">
                  <span>Demo code: <strong>{role === 'admin' ? ADMIN_MFA : DEMO_OTP}</strong></span>
                  <button
                    type="button"
                    className="vv-auth-autofill-btn"
                    onClick={() => {
                      const target = role === 'admin' ? ADMIN_MFA : DEMO_OTP
                      setOtpDigits(target.split(''))
                      verifyOtp(target)
                    }}
                  >
                    Auto-fill
                  </button>
                </div>

                <div className="vv-auth-otp-top" style={{ margin: '8px 0 14px' }}>
                  <span>{otpTimer > 0 ? `Resend code in 0:${String(otpTimer).padStart(2, '0')}` : ''}</span>
                  <button
                    type="button"
                    disabled={otpTimer > 0}
                    className="vv-auth-link"
                    style={{ background: 'none', border: 0, cursor: otpTimer > 0 ? 'default' : 'pointer', opacity: otpTimer > 0 ? 0.5 : 1 }}
                    onClick={() => {
                      setOtpTimer(30)
                      setInfoMsg('A new OTP has been sent')
                      setOtpDigits(['', '', '', '', '', ''])
                      otpInputRefs.current[0]?.focus()
                    }}
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  ref={verifyBtnRef}
                  type="button"
                  disabled={isLoading}
                  onClick={() => verifyOtp()}
                  className={cx('vv-auth-btn', isLoading && 'loading', isHappy && 'ok')}
                >
                  <span className="lab">Verify &amp; Sign in</span>
                  <span className="spin"><i className="vv-auth-spinner" /></span>
                  <span className="done">✓ Signed in</span>
                </button>
              </div>
            )
          ) : (
            /* Method: Email */
            <form onSubmit={submitEmail}>
              <div className="vv-auth-group">
                <label className="vv-auth-label">Email</label>
                <div className="vv-auth-field">
                  <Mail className="ic" size={17} />
                  <input
                    ref={emailInputRef}
                    type="email"
                    placeholder="you@company.com"
                    value={emailVal}
                    onChange={(e) => {
                      setEmailVal(e.target.value)
                      setErrMsg('')
                    }}
                    onFocus={handleInputFocus(26)}
                    onInput={handleInputFocus(26)}
                    onBlur={handleInputBlur}
                    aria-invalid={Boolean(errMsg && !isEmail(emailVal))}
                  />
                </div>
              </div>

              <div className="vv-auth-group">
                <label className="vv-auth-label">Password</label>
                <div className="vv-auth-field">
                  <Lock className="ic" size={17} />
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={passwordVal}
                    onChange={(e) => {
                      setPasswordVal(e.target.value)
                      setErrMsg('')
                    }}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    aria-invalid={Boolean(errMsg && passwordVal.length < 4)}
                  />
                  <button
                    type="button"
                    className="vv-auth-eye-btn"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="vv-auth-row">
                <label className="vv-auth-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="vv-auth-box">
                    <svg viewBox="0 0 12 12"><path d="m2 6.5 2.7 2.6L10 3" /></svg>
                  </span>
                  Remember me
                </label>
                <button
                  type="button"
                  className="vv-auth-link"
                  style={{ background: 'none', border: 0, cursor: 'pointer' }}
                  onClick={() => {
                    setInfoMsg(isEmail(emailVal) ? `We'll send a reset link to ${emailVal.trim()}` : "Enter your email above and we'll send a reset link.")
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                ref={emailBtnRef}
                type="submit"
                disabled={isLoading}
                className={cx('vv-auth-btn', isLoading && 'loading', isHappy && 'ok')}
              >
                <span className="lab">Sign in</span>
                <span className="spin"><i className="vv-auth-spinner" /></span>
                <span className="done">✓ Signed in</span>
              </button>
            </form>
          )}

          {/* Feedback Messages */}
          <div className={cx('vv-auth-msg-wrap', (errMsg || infoMsg || successMsg) && 'show')}>
            <div>
              {errMsg && <p className="vv-auth-msg err">{errMsg}</p>}
              {!errMsg && infoMsg && <p className="vv-auth-msg info">{infoMsg}</p>}
              {!errMsg && !infoMsg && successMsg && <p className="vv-auth-msg ok">{successMsg}</p>}
            </div>
          </div>

          {/* Choose Your Workspace */}
          <div className="vv-auth-ws-section">
            <h2 className="vv-auth-ws-title">CHOOSE YOUR WORKSPACE</h2>
            <div className="vv-auth-ws-grid">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="vv-auth-ws-btn"
                  aria-pressed={role === r.id}
                  onClick={() => {
                    setRole(r.id)
                    setErrMsg('')
                    setInfoMsg('')
                  }}
                >
                  {r.short}
                </button>
              ))}
            </div>
            <p className="vv-auth-ws-note">
              Sales Agents and Super Admins are invited by the platform — they cannot self-register.
            </p>
          </div>

          {/* Footer Navigation */}
          <div className="vv-auth-footer">
            <div>
              <span>New to VendorVerse? </span>
              <button
                type="button"
                className="vv-auth-link"
                style={{ background: 'none', border: 0, cursor: 'pointer' }}
                onClick={() => nav.go('register')}
              >
                Create account
              </button>
            </div>
            <button
              type="button"
              className="vv-auth-browse-btn"
              onClick={() => {
                setMe({ role: 'customer', loggedIn: false, guest: true, vendorId: 'v-me', name: 'Guest' })
                nav.reset('c_home')
              }}
            >
              Browse without login →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Welcome({ params = {} }) {
  return <InteractiveAuthCard params={params} />
}

export function Login({ params = {} }) {
  return <InteractiveAuthCard params={params} />
}

export function AuthScreen({ params = {} }) {
  if (params.mode === 'login') return <Login params={params} />
  if (params.mode === 'register') return <Register params={params} />
  return <Welcome params={params} />
}

export function Otp({ params }) {
  const { contact = '+91 98290 00001', role = 'customer', mode, name, biz, next, nextParams } = params
  const nav = useNav()
  const { setMe, toast } = useApp()
  const signIn = useSignIn()
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [step, setStep] = useState(0)
  const [secs, setSecs] = useState(30)
  useEffect(() => {
    if (secs <= 0) return
    const t = setTimeout(() => setSecs((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secs])
  const target = step === 0 ? DEMO_OTP : ADMIN_MFA
  const verify = (candidate = code) => {
    if (candidate.length < 6) return setErr('Enter all 6 digits')
    if (candidate !== target) return setErr(step === 0 ? 'Incorrect OTP. Please check and try again.' : 'Incorrect authenticator code.')
    if (mode === 'register') {
      if (role === 'business') {
        setMe({ role: 'business', loggedIn: true, guest: false, vendorId: 'v-me', name: name || 'Company owner', businessName: biz, bizId: 'biz-me', businessWorkspace: true, phone: contact })
        toast('Account created. Confirm your eligibility to open a Business account.')
        nav.reset('b_eligibility')
      } else if (role === 'vendor') {
        setMe({ role: 'vendor', loggedIn: true, guest: false, vendorId: 'v-new', name: name || 'New Vendor', biz, phone: contact, isNew: true })
        toast('Account created. Tell us what kind of vendor you are.')
        nav.reset('v_register_type', { biz })
      } else {
        setMe({ role: 'customer', loggedIn: true, guest: false, vendorId: 'v-me', name: name || ME.customer, phone: contact })
        toast('Welcome to VendorVerse!')
        nav.reset('c_home')
      }
      return
    }
    signIn(role, {}, next || HOME[role], nextParams || {})
    toast('Signed in successfully')
  }
  return (
    <Screen title={step === 0 ? 'Verify OTP' : 'Two-step verification'} pad={false} bg="bg-[#f8fcff]" headerless>
      <div className="vv-otp-stage">
        <div className="vv-otp-card">
          <div className="vv-otp-heading">
            <div className="grid size-14 place-items-center rounded-2xl bg-[#e0f2fe] text-[#0284c7]">{step === 0 ? <ShieldCheck size={28} /> : <Lock size={28} />}</div>
            <div className="vv-otp-scene" aria-hidden="true">
              <div className="vv-otp-orbit vv-otp-orbit-one" /><div className="vv-otp-orbit vv-otp-orbit-two" />
              <div className="vv-otp-mini-cube"><span>V</span><span>+</span><span>✓</span></div>
              <span className="vv-otp-float vv-otp-float-one">Verified</span><span className="vv-otp-float vv-otp-float-two">Secure</span>
            </div>
          </div>
          <div className="vv-otp-copy">
            <p className="vv-login-eyebrow">SECURE ACCOUNT ACCESS</p>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#183247]">{step === 0 ? 'Enter the code' : 'Authenticator code'}</h2>
            <p className="mt-1 text-sm text-[#64748b]">
              {step === 0 ? <>We sent a 6-digit code to <b className="text-[#183247]">{contact}</b></> : 'Super Admin accounts require a second factor. Open your authenticator app and enter the current code.'}
            </p>
          </div>
          <div className="vv-otp-entry relative">
            <div className="flex justify-between gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={cx('grid h-14 flex-1 place-items-center rounded-xl text-xl font-extrabold ring-1 ring-inset', i === code.length ? 'ring-2 ring-[#0284c7]' : err ? 'ring-red-300' : 'ring-[#d9ecf8]', code[i] ? 'bg-[#f0f9ff] text-[#0284c7]' : 'bg-white')}>{code[i] || ''}</div>
              ))}
            </div>
            <input autoFocus aria-label="One-time code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => { const nextCode = e.target.value.replace(/\D/g, '').slice(0, 6); setCode(nextCode); setErr(''); if (nextCode.length === 6) window.setTimeout(() => verify(nextCode), 0) }} className="absolute inset-0 h-full w-full cursor-text opacity-0" />
          </div>
          {err && <p className="text-sm font-medium text-red-600" role="alert">{err}</p>}
          <Banner tone="blue" title="Access code">Use <b>{target}</b> as the {step === 0 ? `${role === 'admin' ? 'Super Admin' : role === 'agent' ? 'Sales Agent' : role === 'business' ? 'Business / Company supplier' : role} OTP` : 'authenticator code'}. <button type="button" className="font-bold underline text-[#0284c7]" onClick={() => { setCode(target); setErr(''); window.setTimeout(() => verify(target), 0) }}>Auto-fill</button></Banner>
          <Button full size="lg" onClick={verify}>{step === 0 && role === 'admin' ? 'Continue' : mode === 'register' ? 'Verify & create account' : 'Verify & log in'}</Button>
          {step === 0 && (
            <p className="text-center text-sm text-[#64748b]">
              {secs > 0 ? `Resend code in 0:${String(secs).padStart(2, '0')}` : <button onClick={() => { setSecs(30); toast('A new OTP has been sent') }} className="font-bold text-[#0284c7] hover:underline">Resend OTP</button>}
            </p>
          )}
        </div>
      </div>
    </Screen>
  )
}

export function Register() {
  const nav = useNav()
  const [role, setRole] = useState('customer')
  const [f, set] = useForm({ name: '', phone: '', email: '', biz: '', agree: false })
  const [errs, setErrs] = useState({})
  const submit = () => {
    const e = {}
    if (f.name.trim().length < 3) e.name = 'Enter your full name'
    if (!isPhone(f.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (f.email && !isEmail(f.email)) e.email = 'Enter a valid email address'
    if (role !== 'customer' && f.biz.trim().length < 3) e.biz = 'Enter your business name'
    if (!f.agree) e.agree = 'Please accept to continue'
    setErrs(e)
    if (Object.keys(e).length === 0) nav.go('otp', { contact: `+91 ${f.phone}`, role, mode: 'register', name: f.name, biz: f.biz })
  }
  return (
    <Screen title="Create account" pad={false} bg="bg-[#f8fcff]" headerless>
      <div className="space-y-4 p-5 max-w-[620px] mx-auto mt-20 mb-8 bg-white rounded-2xl border border-[#d9ecf8] shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#183247]">Join VendorVerse</h2>
          <p className="mt-1 text-sm text-[#64748b]">Choose how you want to use the marketplace.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[['customer', User, 'Customer', 'Buy products, book services, request quotes'], ['vendor', Store, 'Vendor', 'Sell products and services to customers'], ['business', Building2, 'Business', 'Registered company, 3+ years. Supply and services for vendors']].map(([id, I, a, b]) => (
            <button key={id} onClick={() => setRole(id)} className={cx('rounded-2xl p-3.5 text-left ring-1 ring-inset transition', role === id ? 'bg-[#f0f9ff] ring-2 ring-[#0284c7]' : 'bg-white ring-[#d9ecf8] hover:bg-[#f8fcff]')}>
              <span className={cx('grid size-10 place-items-center rounded-xl', role === id ? 'bg-[#0284c7] text-white' : 'bg-[#e0f2fe] text-[#0284c7]')}><I size={20} /></span>
              <p className="mt-2.5 text-sm font-bold text-[#183247]">{a}</p>
              <p className="mt-0.5 text-xs leading-snug text-[#64748b]">{b}</p>
            </button>
          ))}
        </div>
        <Input label="Full name" required placeholder="As per ID" value={f.name} onChange={set('name')} error={errs.name} />
        {role !== 'customer' && <Input label={role === 'business' ? 'Company legal name' : 'Business name'} required placeholder="Registered business name" value={f.biz} onChange={set('biz')} error={errs.biz} />}
        <Input label="Mobile number" required icon={Phone} inputMode="numeric" maxLength={10} placeholder="98290 00001" value={f.phone} onChange={(e) => set('phone')(normalizePhone(e.target.value))} error={errs.phone} className="!pl-10" />
        <Input label="Email (optional)" icon={Mail} type="email" placeholder="you@company.com" value={f.email} onChange={set('email')} error={errs.email} />
        <div>
          <Checkbox checked={f.agree} onChange={(v) => set('agree')(v)}>I agree to the <b className="text-[#0284c7]">Terms of Service</b> and <b className="text-[#0284c7]">Privacy Policy</b>, and consent to my data being processed to provide this service.</Checkbox>
          {errs.agree && <p className="mt-1 text-xs font-medium text-red-600">{errs.agree}</p>}
        </div>
        {role === 'business' && <Banner tone="blue" title="Business accounts are for company owners">You will confirm that you own a registered company that has operated for 3+ years, then submit a six-step company form for admin verification.</Banner>}
        {role === 'vendor' && <Banner tone="amber" title="Verification required">Vendors are shown as <b>Verified</b> only after Super Admin approves your business documents.</Banner>}
        <Button full size="lg" onClick={submit}>Continue</Button>
        <p className="text-center text-sm text-[#64748b]">Already have an account? <button onClick={() => nav.replace('login')} className="font-bold text-[#0284c7] hover:underline">Log in</button></p>
      </div>
    </Screen>
  )
}
