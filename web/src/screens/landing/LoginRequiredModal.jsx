import React, { useState } from 'react'
import { X, Lock, CheckCircle2, User, Building2, ShieldCheck, ArrowRight } from 'lucide-react'
import { useSignIn } from '../auth.jsx'

export function LoginRequiredModal({
  isOpen,
  onClose,
  pendingAction,
  onLoginSuccess,
}) {
  const signIn = useSignIn()
  const [activeTab, setActiveTab] = useState('demo')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const actionDescription = pendingAction?.title
    ? `to complete "${pendingAction.title}"`
    : pendingAction?.type === 'cart'
    ? 'to add this item to your cart and checkout'
    : pendingAction?.type === 'rfq'
    ? 'to publish your RFQ and receive competitive vendor bids'
    : pendingAction?.type === 'booking'
    ? 'to confirm your service booking slot'
    : 'to continue this protected action'

  const handleDemoSignIn = (role) => {
    signIn(role, {}, 'c_home')
    if (onLoginSuccess) {
      onLoginSuccess(pendingAction)
    }
    onClose()
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Please enter a valid phone number or email address.')
      return
    }
    setError('')
    signIn('customer', { contact: phone.trim() }, 'c_home')
    if (onLoginSuccess) {
      onLoginSuccess(pendingAction)
    }
    onClose()
  }

  return (
    <div className="login-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div className="login-modal-card">
        <button
          type="button"
          className="login-modal-close"
          onClick={onClose}
          aria-label="Close login dialog"
        >
          <X size={20} strokeWidth={2.4} />
        </button>

        <div className="login-modal-header">
          <div className="login-modal-icon">
            <Lock size={24} strokeWidth={2.2} />
          </div>
          <h3 id="login-modal-title" className="login-modal-title">Sign In Required</h3>
          <p className="login-modal-desc">
            Please sign in {actionDescription}. Your form data and selections will be preserved.
          </p>
        </div>

        <div className="login-modal-tabs">
          <button
            type="button"
            className={`login-modal-tab ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            Quick 1-Click Sign In
          </button>
          <button
            type="button"
            className={`login-modal-tab ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            Phone / Email
          </button>
        </div>

        {activeTab === 'demo' ? (
          <div className="demo-accounts-list">
            <button
              type="button"
              className="demo-account-btn"
              onClick={() => handleDemoSignIn('customer')}
            >
              <div className="demo-account-icon customer">
                <User size={20} />
              </div>
              <div className="demo-account-info">
                <strong>Sign In as Customer (Aarav Mehta)</strong>
                <small>Explore, book services, submit RFQs & manage cart</small>
              </div>
              <ArrowRight size={16} className="demo-arrow" />
            </button>

            <button
              type="button"
              className="demo-account-btn"
              onClick={() => handleDemoSignIn('business')}
            >
              <div className="demo-account-icon business">
                <Building2 size={20} />
              </div>
              <div className="demo-account-info">
                <strong>Sign In as Enterprise (Atlas Industrial)</strong>
                <small>Bulk procurement tenders, supply contracts & B2B POs</small>
              </div>
              <ArrowRight size={16} className="demo-arrow" />
            </button>
          </div>
        ) : (
          <form className="custom-login-form" onSubmit={handleCustomSubmit}>
            <div className="form-field">
              <label htmlFor="login-input" className="form-label">
                Mobile Number or Email
              </label>
              <input
                id="login-input"
                type="text"
                placeholder="e.g. +91 98290 00001 or name@company.com"
                className="form-input"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (error) setError('')
                }}
              />
              {error && <p className="form-error-msg">{error}</p>}
            </div>

            <button type="submit" className="login-submit-btn">
              Continue &amp; Complete Action
              <ArrowRight size={16} strokeWidth={2.4} />
            </button>
          </form>
        )}

        <div className="login-modal-footer">
          <ShieldCheck size={16} strokeWidth={2.4} color="#0284C7" />
          <span>Verified SSL Encryption · No transaction will occur until confirmed</span>
        </div>
      </div>
    </div>
  )
}
