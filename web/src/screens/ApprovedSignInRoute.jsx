import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import approvedSignInHtml from './approved-signin.html?raw'
import { ME } from '../data.jsx'
import { HOME } from '../roles.js'
import { useApp } from '../store.jsx'
import { useNav } from '../nav.jsx'
import { useSignIn } from './auth.jsx'

const ROLE_IDS = {
  Customer: 'customer',
  Vendor: 'vendor',
  Business: 'business',
  Agent: 'agent',
  Admin: 'admin',
}

export function ApprovedSignInRoute() {
  const frameRef = useRef(null)
  const selectedWorkspace = useRef('Customer')
  const nav = useNav()
  const { setMe, toast } = useApp()
  const signIn = useSignIn()
  const params = nav.params || {}

  useEffect(() => {
    const onMessage = (event) => {
      if (event.source !== frameRef.current?.contentWindow || event.origin !== window.location.origin) return
      const request = event.data
      if (request?.source !== 'vv-approved-signin') return
      const respond = (result) => frameRef.current?.contentWindow?.postMessage({
        source: 'vv-approved-signin-host',
        requestId: request.requestId,
        ...result,
      }, window.location.origin)

      if (request.type === 'workspace-change') {
        selectedWorkspace.current = request.workspace || selectedWorkspace.current
        respond({ ok: true })
        return
      }
      if (request.type === 'send-otp') {
        // The app currently has no OTP delivery endpoint; retain its existing local sign-in flow.
        respond({ ok: true })
        return
      }
      if (request.type === 'verify-otp') {
        const role = ROLE_IDS[request.workspace || selectedWorkspace.current] || 'customer'
        const expectedCode = role === 'admin' ? '654321' : '123456'
        respond(request.code === expectedCode
          ? { ok: true }
          : { ok: false, error: `Incorrect OTP. Use demo code ${expectedCode}.` })
        return
      }
      if (request.type === 'sign-in-email') {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(request.email || '').trim())
        respond(emailValid && String(request.password || '').length >= 4
          ? { ok: true }
          : { ok: false, error: 'Please enter a valid email and password.' })
        return
      }
      if (request.type === 'forgot-password') {
        respond({ ok: false, error: 'Password reset is not configured in this project yet.' })
        return
      }
      if (request.type === 'complete-sign-in') {
        const role = ROLE_IDS[request.workspace || selectedWorkspace.current] || 'customer'
        const extra = request.method === 'phone'
          ? { phone: `${request.countryCode || '+91'} ${request.phone || ''}`.trim() }
          : { email: request.email || '', name: ME[role] }
        signIn(role, extra, params.next || HOME[role], params.nextParams || {})
        toast('Signed in successfully')
        return
      }
      if (request.type === 'create-account') {
        nav.go('register')
        return
      }
      if (request.type === 'browse-without-login') {
        setMe({ role: 'customer', loggedIn: false, guest: true, vendorId: 'v-me', name: 'Guest' })
        nav.reset('c_home')
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [nav, params.next, params.nextParams, setMe, signIn, toast])

  return createPortal(
    <iframe
      ref={frameRef}
      title="VendorVerse sign in"
      srcDoc={approvedSignInHtml}
      style={{ position: 'fixed', inset: 0, zIndex: 2147483000, width: '100vw', height: '100vh', border: 0, display: 'block' }}
    />,
    document.body,
  )
}
