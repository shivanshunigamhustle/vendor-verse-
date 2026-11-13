import React, { useState } from 'react'
import {
  HelpCircle,
  Search,
  BookOpen,
  ShoppingBag,
  Wrench,
  FileText,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  Phone,
  Clock,
} from 'lucide-react'

export function PublicHelpView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(0)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: '',
  })
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactError, setContactError] = useState('')

  const HELP_CATEGORIES = [
    {
      id: 'start',
      icon: BookOpen,
      title: 'Getting Started',
      desc: 'Account registration, profile setup, identity verification, and platform roles.',
      articles: 12,
    },
    {
      id: 'products',
      icon: ShoppingBag,
      title: 'Sourcing Products & Suppliers',
      desc: 'Browsing catalogs, checking MOQs, requesting samples, and wholesale orders.',
      articles: 18,
    },
    {
      id: 'services',
      icon: Wrench,
      title: 'Booking Services',
      desc: 'Scheduling trade visits, milestone reviews, service warranties, and technician tracking.',
      articles: 15,
    },
    {
      id: 'rfqs',
      icon: FileText,
      title: 'RFQs & Tenders',
      desc: 'Posting requirements, comparing supplier quotation matrices, and contract awards.',
      articles: 14,
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: 'Payments & Escrow Protection',
      desc: 'Milestone escrow accounts, invoices, GST compliance, and refund policies.',
      articles: 16,
    },
    {
      id: 'trust',
      icon: ShieldCheck,
      title: 'Trust, Safety & Disputes',
      desc: 'Vendor accreditation, document checks, mediation services, and reporting issues.',
      articles: 11,
    },
  ]

  const POPULAR_FAQS = [
    {
      q: 'How does VendorVerse verify suppliers and contractors?',
      a: 'All vendors must pass our structured 4-step onboarding audit: valid government tax registration (GSTIN/VAT/EIN), bank proof check, identity verification of owners, and physical address confirmation. Accredited vendors receive the blue "VERIFIED" badge.',
    },
    {
      q: 'How does milestone escrow protect my payment?',
      a: 'When you place an order or book a service, your payment is deposited into a secure escrow account. The funds are only transferred to the vendor once you inspect the deliverables and digitally approve milestone completion.',
    },
    {
      q: 'Can I browse and request quotes as a guest without signing in?',
      a: 'Yes! Guest users can freely explore all products, services, supplier profiles, and draft RFQ requirements. You are only prompted to authenticate when finalizing a purchase order, submitting an official RFQ, or reserving a booking slot.',
    },
    {
      q: 'What should I do if a delivered product does not match the specifications?',
      a: 'You can open a formal dispute directly from your Activity dashboard within 7 days of delivery. Our platform mediation team reviews the original specification sheet and inspects evidence to authorize replacements or full escrow refunds.',
    },
    {
      q: 'How do I register as a vendor or manufacturer on VendorVerse?',
      a: 'Click "Become a Vendor" in the navigation bar or footer. Fill out your company profile, select your core industries, and upload your business tax credentials. Our verification team reviews applications within 24 business hours.',
    },
  ]

  const handleContactSubmit = (e) => {
    e.preventDefault()
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please complete all required fields.')
      return
    }
    setContactError('')
    setContactSubmitted(true)
  }

  const filteredCategories = HELP_CATEGORIES.filter((c) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
  })

  return (
    <div className="public-help-page">
      {/* Help Hero Header */}
      <div className="help-hero-banner">
        <div className="section-container">
          <div className="help-hero-center">
            <span className="eyebrow-tag">
              <Sparkles size={13} strokeWidth={2.4} />
              HELP &amp; SUPPORT CENTER
            </span>
            <h1 className="help-main-title">
              How Can We <span className="text-gradient">Help You Today?</span>
            </h1>
            <p className="help-subtitle">
              Find instant answers to questions regarding sourcing, service bookings, milestone escrow,
              and vendor accounts.
            </p>

            {/* Help Search Input */}
            <div className="help-search-wrap">
              <Search size={20} className="help-search-icon" />
              <input
                type="text"
                placeholder="Search help guides, topics and policies (e.g. Escrow, RFQ, Verification)..."
                className="help-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6 Help Categories Grid */}
      <div className="section-container help-categories-section">
        <div className="section-header-center">
          <span className="eyebrow-tag">KNOWLEDGE BASE</span>
          <h2 className="section-heading dark">Browse Help by Category</h2>
        </div>

        <div className="help-categories-grid">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <div key={cat.id} className="help-category-card">
                <div className="help-cat-icon">
                  <Icon size={24} strokeWidth={2.2} />
                </div>
                <h3 className="help-cat-title">{cat.title}</h3>
                <p className="help-cat-desc">{cat.desc}</p>
                <span className="help-cat-meta">{cat.articles} articles</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAQs & Contact Support Grid */}
      <div className="section-container help-content-section">
        <div className="help-split-layout">
          {/* Left: Popular Accordion FAQs */}
          <div className="help-faqs-col">
            <span className="eyebrow-tag">TOP INQUIRIES</span>
            <h3 className="help-col-heading">Frequently Asked Questions</h3>
            <p className="help-col-subcopy">
              Quick answers to the most common questions across the VendorVerse platform.
            </p>

            <div className="help-accordion-list">
              {POPULAR_FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div key={idx} className="help-faq-item">
                    <button
                      type="button"
                      className="help-faq-trigger"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && <p className="help-faq-answer">{faq.a}</p>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Validated Contact Support Form */}
          <div className="help-contact-col">
            <div className="help-contact-card">
              <div className="contact-card-header">
                <Mail size={22} className="text-sky-600" />
                <div>
                  <h4 className="contact-card-title">Still Need Assistance?</h4>
                  <p className="contact-card-desc">Our dedicated commercial support team responds within 2 hours.</p>
                </div>
              </div>

              {contactSubmitted ? (
                <div className="contact-success-state">
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                  <h4>Support Ticket #SUP-4102 Created</h4>
                  <p className="text-sm text-slate-600 mt-2">
                    Thank you, <strong>{contactForm.name}</strong>. A confirmation email has been dispatched to{' '}
                    <strong>{contactForm.email}</strong>. Our support desk will reply promptly.
                  </p>
                  <button
                    type="button"
                    className="outline-sky-btn mt-5"
                    onClick={() => {
                      setContactSubmitted(false)
                      setContactForm({ name: '', email: '', topic: 'General Inquiry', message: '' })
                    }}
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form className="help-contact-form" onSubmit={handleContactSubmit}>
                  {contactError && <p className="contact-error-banner">{contactError}</p>}

                  <div className="form-group">
                    <label className="form-label" htmlFor="help-name">Your Full Name *</label>
                    <input
                      id="help-name"
                      type="text"
                      placeholder="e.g. Aarav Mehta"
                      className="form-text-input"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="help-email">Work Email *</label>
                    <input
                      id="help-email"
                      type="email"
                      placeholder="e.g. name@company.com"
                      className="form-text-input"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="help-topic">Subject Area</label>
                    <select
                      id="help-topic"
                      className="form-select-input"
                      value={contactForm.topic}
                      onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                    >
                      <option value="General Inquiry">General Marketplace Inquiry</option>
                      <option value="Sourcing / RFQ">Sourcing &amp; RFQ Assistance</option>
                      <option value="Service Booking">Service Booking &amp; Scheduling</option>
                      <option value="Payments / Escrow">Escrow &amp; Payment Inquiries</option>
                      <option value="Vendor Verification">Vendor Application &amp; Verification</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="help-msg">Message / Description *</label>
                    <textarea
                      id="help-msg"
                      rows={3}
                      placeholder="How can we assist your business today?"
                      className="form-textarea-input"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    <Send size={16} strokeWidth={2.4} />
                    <span>Send Message to Support Desk</span>
                  </button>
                </form>
              )}

              <div className="contact-footer-badges">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Clock size={14} className="text-sky-600" />
                  <span>24/7 Global Desk Coverage</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Enterprise SLA Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
