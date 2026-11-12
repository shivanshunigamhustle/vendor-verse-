import { useState } from 'react'
import { useNav } from '../../nav.jsx'
import { PolicyModal } from './PolicyModal.jsx'

export function Footer({ onOpenVendorApply }) {
  const nav = useNav()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [subscribeSuccess, setSubscribeSuccess] = useState(false)
  const [activeModal, setActiveModal] = useState(null)

  const handleSubscribe = (e) => {
    e.preventDefault()
    setEmailError('')

    const trimmed = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmed) {
      setEmailError('Please enter your email address.')
      return
    }
    if (!emailRegex.test(trimmed)) {
      setEmailError('Please enter a valid email address.')
      return
    }

    setSubscribeSuccess(true)
    setEmail('')
    setTimeout(() => {
      setSubscribeSuccess(false)
    }, 4500)
  }

  return (
    <footer className="landing-footer midnight-footer" role="contentinfo">
      <div className="footer-top-container">
        {/* Brand Column */}
        <div className="footer-col footer-brand-col">
          <div className="footer-brand-header">
            <div className="brand-bag-icon small" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="brand-v-glyph">V</span>
            </div>
            <div className="brand-title-wrap">
              <span className="brand-name">VendorVerse</span>
              <span className="brand-tagline">Global B2B Marketplace</span>
            </div>
          </div>

          <p className="footer-brand-desc">
            Connect with suppliers, manufacturers, and service providers across global business markets.
          </p>

          {/* Social Icons */}
          <div className="footer-social-links" aria-label="Social media channels">
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            {/* Twitter/X */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Twitter / X"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="YouTube"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <polygon points="10 15 15 12 10 9" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* For Buyers */}
        <div className="footer-col">
          <h4 className="footer-col-title">For Buyers</h4>
          <ul className="footer-links-list">
            <li>
              <button type="button" className="footer-link-btn" onClick={() => nav.go('c_explore')}>
                Explore Marketplace
              </button>
            </li>
            <li>
              <a
                href="#rfq-section"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('rfq-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Request Quotation (RFQ)
              </a>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => nav.go('c_explore', { type: 'services' })}
              >
                Book Services
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => nav.go('c_activity')}
              >
                Compare Vendors
              </button>
            </li>
          </ul>
        </div>

        {/* For Vendors */}
        <div className="footer-col">
          <h4 className="footer-col-title">For Vendors</h4>
          <ul className="footer-links-list">
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => {
                  if (onOpenVendorApply) onOpenVendorApply()
                  else nav.go('v_home')
                }}
              >
                Become a Vendor
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => nav.go('v_home')}
              >
                Vendor Plans
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => nav.go('v_home')}
              >
                Grow Your Business
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => setActiveModal('about')}
              >
                Vendor Resources
              </button>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4 className="footer-col-title">Company</h4>
          <ul className="footer-links-list">
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => setActiveModal('about')}
              >
                About Us
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => setActiveModal('careers')}
              >
                Careers
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => setActiveModal('contact')}
              >
                Contact Us
              </button>
            </li>
            <li>
              <a
                href="#how"
                className="footer-link-btn"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Help &amp; Support
              </a>
            </li>
          </ul>
        </div>

        {/* Subscribe for Updates */}
        <div className="footer-col subscribe-col">
          <h4 className="footer-col-title">Subscribe for Updates</h4>
          <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
            <div className="subscribe-input-wrap">
              <input
                type="email"
                placeholder="Enter your email"
                className="subscribe-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError('')
                }}
                aria-label="Email for subscription"
              />
              <button type="submit" className="subscribe-send-btn" aria-label="Subscribe">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            {emailError && <p className="subscribe-error-msg">{emailError}</p>}
            {subscribeSuccess && (
              <p className="subscribe-success-msg">
                Thank you for subscribing &mdash; you will receive VendorVerse updates at your inbox.
              </p>
            )}
          </form>

          <p className="subscribe-subtext">
            Get the latest updates, new features and marketplace opportunities.
          </p>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <div className="copyright-text">
            © 2026 VendorVerse. All rights reserved.
          </div>

          <div className="legal-links-row">
            <button
              type="button"
              className="legal-link"
              onClick={() => setActiveModal('privacy')}
            >
              Privacy Policy
            </button>
            <span className="legal-sep" aria-hidden="true">|</span>
            <button
              type="button"
              className="legal-link"
              onClick={() => setActiveModal('terms')}
            >
              Terms of Use
            </button>
            <span className="legal-sep" aria-hidden="true">|</span>
            <button
              type="button"
              className="legal-link"
              onClick={() => setActiveModal('cookies')}
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>

      <PolicyModal
        type={activeModal}
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
      />
    </footer>
  )
}
