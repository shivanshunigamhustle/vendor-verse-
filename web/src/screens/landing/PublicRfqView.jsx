import React, { useState } from 'react'
import {
  FileText,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Layers,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Loader2,
} from 'lucide-react'

export function PublicRfqView({ onActionRequireLogin, isLoggedIn = false }) {
  const [formData, setFormData] = useState({
    title: '',
    industry: 'Construction',
    quantity: '',
    unit: 'Units',
    location: 'India',
    targetDate: '2026-11-28',
    budget: '',
    specifications: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRfq, setSubmittedRfq] = useState(null)
  const [openFaq, setOpenFaq] = useState(0)

  const RFQ_STEPS = [
    { num: '01', title: 'Post Requirement', desc: 'Define your technical specs, required quantities & delivery target.' },
    { num: '02', title: 'Verified Routing', desc: 'Our engine routes your RFQ directly to certified suppliers.' },
    { num: '03', title: 'Compare Quotes', desc: 'Inspect bids side-by-side with pricing, MOQs and lead times.' },
    { num: '04', title: 'Secure PO & Escrow', desc: 'Award the tender and transact safely under milestone escrow.' },
  ]

  const FAQS = [
    {
      q: 'Is there any fee to post a Request for Quotation (RFQ)?',
      a: 'No. Posting an RFQ on VendorVerse is completely free for both registered buyers and guests. You can post multiple requirements without upfront charges.',
    },
    {
      q: 'How fast do verified vendors typically respond with quotations?',
      a: 'Most global suppliers respond within 4 to 24 hours with itemized quotations, technical datasheets, and delivery schedules.',
    },
    {
      q: 'Are supplier quotes binding?',
      a: 'Suppliers provide commercial quotes with a stated validity period (typically 14 to 30 days). Once you accept a quotation, a formal purchase order is generated.',
    },
    {
      q: 'Can I request sample orders before committing to full production?',
      a: 'Yes. You can request sample runs directly through the quote review interface to inspect quality and tolerances before approving bulk dispatch.',
    },
  ]

  const validate = () => {
    const errs = {}
    if (!formData.title.trim() || formData.title.trim().length < 6) {
      errs.title = 'Please provide a clear title (at least 6 characters).'
    }
    if (!formData.quantity.trim()) {
      errs.quantity = 'Please specify quantity required.'
    }
    if (!formData.specifications.trim() || formData.specifications.trim().length < 15) {
      errs.specifications = 'Please describe your technical specifications or bill of materials (min 15 characters).'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    if (!isLoggedIn) {
      if (onActionRequireLogin) {
        onActionRequireLogin({
          type: 'rfq',
          title: formData.title,
          rfqData: formData,
        })
      }
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmittedRfq({
        id: `RFQ-${Math.floor(10000 + Math.random() * 90000)}`,
        title: formData.title,
        industry: formData.industry,
        quantity: `${formData.quantity} ${formData.unit}`,
        location: formData.location,
        submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      })
    }, 1200)
  }

  return (
    <div className="public-rfq-page">
      {/* RFQ Hero Header */}
      <div className="rfq-hero-banner">
        <div className="section-container">
          <div className="rfq-hero-center">
            <span className="eyebrow-tag">
              <Sparkles size={13} strokeWidth={2.4} />
              REQUEST FOR QUOTATION (RFQ)
            </span>
            <h1 className="rfq-main-title">
              One Requirement. <span className="text-gradient">Multiple Opportunities.</span>
            </h1>
            <p className="rfq-subtitle">
              Publish your commercial sourcing or project specifications once. Verified global suppliers and
              certified contractors submit competitive bids directly to your dashboard.
            </p>
          </div>

          {/* 4-Step Process Strip */}
          <div className="rfq-process-strip">
            {RFQ_STEPS.map((s) => (
              <div key={s.num} className="rfq-process-card">
                <span className="process-num-badge">{s.num}</span>
                <h4 className="process-title">{s.title}</h4>
                <p className="process-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Form Section */}
      <div className="section-container rfq-form-section">
        <div className="rfq-form-layout">
          {/* Left: Interactive RFQ Form */}
          <div className="rfq-form-col">
            {submittedRfq ? (
              <div className="rfq-success-card">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={42} strokeWidth={2.4} className="text-emerald-500" />
                </div>
                <h3 className="success-title">Requirement Successfully Dispatched!</h3>
                <p className="success-desc">
                  Your RFQ has been routed to verified suppliers matching{' '}
                  <strong>{submittedRfq.industry}</strong> in <strong>{submittedRfq.location}</strong>.
                </p>

                <div className="success-meta-box">
                  <div className="success-meta-item">
                    <span>Reference ID:</span>
                    <strong>{submittedRfq.id}</strong>
                  </div>
                  <div className="success-meta-item">
                    <span>Target Quantity:</span>
                    <strong>{submittedRfq.quantity}</strong>
                  </div>
                  <div className="success-meta-item">
                    <span>Date Published:</span>
                    <strong>{submittedRfq.submittedAt}</strong>
                  </div>
                  <div className="success-meta-item">
                    <span>Expected First Bid:</span>
                    <strong>Within 4 hours</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="outline-sky-btn mt-6"
                  onClick={() => {
                    setSubmittedRfq(null)
                    setFormData({
                      title: '',
                      industry: 'Construction',
                      quantity: '',
                      unit: 'Units',
                      location: 'India',
                      targetDate: '2026-11-28',
                      budget: '',
                      specifications: '',
                    })
                  }}
                >
                  Post Another Requirement
                </button>
              </div>
            ) : (
              <form className="rfq-main-form" onSubmit={handleSubmit}>
                <div className="form-card-header">
                  <FileText size={22} className="text-sky-600" />
                  <div>
                    <h3 className="form-title">Specify Your Commercial Requirement</h3>
                    <p className="form-subtitle">Fill in the specification details below for accurate supplier bids.</p>
                  </div>
                </div>

                {/* Requirement Title */}
                <div className="form-group">
                  <label className="form-label" htmlFor="rfq-title">
                    Requirement Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="rfq-title"
                    type="text"
                    placeholder="e.g. 500 Units Industrial Steel Valves, Fe500D TMT Rebars, or 2 BHK Interior Design"
                    className={`form-text-input ${errors.title ? 'error' : ''}`}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  {errors.title && <p className="form-error-text">{errors.title}</p>}
                </div>

                {/* Industry & Location */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="rfq-industry">Industry Category</label>
                    <select
                      id="rfq-industry"
                      className="form-select-input"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    >
                      <option value="Construction">Construction &amp; Infrastructure</option>
                      <option value="Home & Household">Home &amp; Household Services</option>
                      <option value="Events & Celebrations">Events &amp; Celebrations</option>
                      <option value="Professional Services">Professional &amp; IT Services</option>
                      <option value="Wholesale & Distribution">Wholesale, Electrical &amp; Packaging</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="rfq-location">Delivery Destination / Market</label>
                    <select
                      id="rfq-location"
                      className="form-select-input"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    >
                      <option value="India">India (Jaipur, Delhi NCR, Nationwide)</option>
                      <option value="United States">United States</option>
                      <option value="Germany">Germany (European Union)</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">United Arab Emirates (GCC)</option>
                      <option value="Singapore">Singapore (Southeast Asia)</option>
                    </select>
                  </div>
                </div>

                {/* Quantity & Target Date */}
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="rfq-qty">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="rfq-qty"
                      type="text"
                      placeholder="e.g. 500, 10,000"
                      className={`form-text-input ${errors.quantity ? 'error' : ''}`}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                    {errors.quantity && <p className="form-error-text">{errors.quantity}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="rfq-unit">Unit</label>
                    <select
                      id="rfq-unit"
                      className="form-select-input"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="Units">Units / Pieces</option>
                      <option value="Tonnes">Tonnes / MT</option>
                      <option value="Kilograms">Kilograms (kg)</option>
                      <option value="Boxes">Boxes / Cartons</option>
                      <option value="Visits">Service Visits</option>
                      <option value="Months">Months (Retainer)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="rfq-date">Delivery By</label>
                    <input
                      id="rfq-date"
                      type="date"
                      className="form-text-input"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="form-group">
                  <label className="form-label" htmlFor="rfq-budget">
                    Target Budget (Optional)
                  </label>
                  <input
                    id="rfq-budget"
                    type="text"
                    placeholder="e.g. ₹1,50,000 or $5,000 USD (Leave blank for open bids)"
                    className="form-text-input"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>

                {/* Specifications & BOM */}
                <div className="form-group">
                  <label className="form-label" htmlFor="rfq-specs">
                    Detailed Technical Specifications &amp; Instructions <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="rfq-specs"
                    rows={4}
                    placeholder="Describe material grade, tolerance, warranty requirements, delivery terms (e.g. Ex-Factory / Door Delivery), or attachment needs..."
                    className={`form-textarea-input ${errors.specifications ? 'error' : ''}`}
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  />
                  {errors.specifications && <p className="form-error-text">{errors.specifications}</p>}
                </div>

                <div className="form-footer-action">
                  <button
                    type="submit"
                    className="rfq-submit-action-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Dispatching to Global Suppliers...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} strokeWidth={2.4} />
                        <span>Publish RFQ to Verified Suppliers</span>
                      </>
                    )}
                  </button>

                  <p className="form-safety-note">
                    <ShieldCheck size={14} className="text-sky-600 inline mr-1" />
                    Supplier proposals are protected under VendorVerse Non-Disclosure &amp; Escrow Guidelines.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right: RFQ Benefits & FAQs */}
          <div className="rfq-info-col">
            <div className="rfq-benefits-card">
              <h4 className="benefits-title">Why Sourcing via RFQ Works Better</h4>
              <ul className="benefits-list">
                <li>
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Average 18% Cost Savings</strong>
                    <p>Transparent bidding motivates suppliers to offer their most competitive wholesale rates.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Side-by-Side Matrix</strong>
                    <p>Evaluate quotes on price, lead times, warranties, and supplier credit score together.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Milestone Escrow Protection</strong>
                    <p>Hold funds safely in escrow until you verify goods or completed work.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Accordion FAQs */}
            <div className="rfq-faqs-card">
              <h4 className="faqs-heading">Frequently Asked Questions</h4>
              <div className="faqs-list">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx
                  return (
                    <div key={idx} className="faq-accordion-item">
                      <button
                        type="button"
                        className="faq-accordion-trigger"
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {isOpen && <p className="faq-accordion-answer">{faq.a}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
