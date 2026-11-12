import { useState } from 'react'
import { useNav } from '../../nav.jsx'

export function QuickRFQModal({ isOpen, onClose }) {
  const nav = useNav()
  const [category, setCategory] = useState('Construction')
  const [city, setCity] = useState('Jaipur')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitted(true)
  }

  const handleClose = () => {
    setSubmitted(false)
    setTitle('')
    setDescription('')
    setQuantity('')
    onClose()
  }

  return (
    <div className="rfq-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="rfq-modal-title">
      <div className="rfq-modal-box">
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close RFQ Modal"
        >
          ✕
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="rfq-form">
            <div className="rfq-form-badge">POST A REQUIREMENT</div>
            <h3 id="rfq-modal-title" className="rfq-form-title">
              Request Quotations (RFQ)
            </h3>
            <p className="rfq-form-subtext">
              Reach registered suppliers and service providers in Jaipur, Ajmer, Sikar, and Delhi NCR. Compare quotes side-by-side.
            </p>

            <div className="form-group">
              <label htmlFor="rfq-category">Select Category</label>
              <select
                id="rfq-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Home and household">Home & Household</option>
                <option value="Construction">Construction</option>
                <option value="Events">Events & Celebrations</option>
                <option value="Professional">Professional Services</option>
                <option value="Wholesale">Wholesale & Distribution</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rfq-city">Delivery / Service City</label>
              <select id="rfq-city" value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="Jaipur">Jaipur, Rajasthan</option>
                <option value="Ajmer">Ajmer, Rajasthan</option>
                <option value="Sikar">Sikar, Rajasthan</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rfq-title">Requirement Title *</label>
              <input
                id="rfq-title"
                type="text"
                placeholder="e.g. 50 Tons TMT Rebars 550D / 2000 sq ft Office Interior"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="rfq-qty">Scope / Quantity</label>
                <input
                  id="rfq-qty"
                  type="text"
                  placeholder="e.g. 40 Tons / 1 Project"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="rfq-desc">Detailed Specifications</label>
              <textarea
                id="rfq-desc"
                rows="3"
                placeholder="Specify grade, dimensions, timeline, site address..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="rfq-modal-actions">
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Post Requirement
              </button>
            </div>
          </form>
        ) : (
          <div className="rfq-success-view">
            <div className="success-icon-ring">✓</div>
            <h3>RFQ Created Successfully!</h3>
            <p>
              Your requirement for <strong>{title}</strong> in <strong>{city}</strong> has been saved.
            </p>
            <div className="rfq-notice-box">
              <small>
                Your requirement has been added to your Activity Hub, where you can track progress and compare quotations as they arrive.
              </small>
            </div>
            <div className="success-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  handleClose()
                  nav.go('c_activity')
                }}
              >
                View in Activity Hub →
              </button>
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
