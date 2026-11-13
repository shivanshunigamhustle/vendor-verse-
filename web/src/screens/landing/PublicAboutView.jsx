import React from 'react'
import { Globe2, ShieldCheck, CheckCircle2, Building2, Users, Layers, ArrowRight, TrendingUp, Award, Sparkles } from 'lucide-react'
import { TiltCard } from './TiltCard.jsx'

export function PublicAboutView({ onExplore, onBecomeVendor }) {
  const ECOSYSTEMS = [
    { icon: Users, title: '01. Hire Services', subtitle: 'On-Demand Trade & Technical Specialists', desc: 'Connect with verified electrical engineers, deep cleaning crews, commercial contractors, and legal/tax advisors. Transparent hourly/visit rates, verified work history, and milestone sign-offs.' },
    { icon: Layers, title: '02. Source Products & Suppliers', subtitle: 'Direct Factory & Wholesale Distribution', desc: 'Bypass intermediaries and procure directly from audited factories, packaging converters, and bulk distributors. Tiered volume pricing, clear MOQs, and reliable freight dispatch.' },
    { icon: Building2, title: '03. Business Procurement', subtitle: 'Multi-Vendor RFQ & Enterprise Contracts', desc: 'Post complex bills of materials (BOQs) and project specifications. Receive itemized quotation matrices, negotiate commercial terms, and execute binding supply agreements.' },
  ]
  const AUDIENCES = [
    { role: 'Commercial Buyers & Homeowners', desc: 'Looking for verified trade services, quick quotes, and reliable project execution with money-back milestone escrow.', badge: 'BUYERS' },
    { role: 'SME Business Owners & Traders', desc: 'Sourcing packaging, raw materials, or specialized maintenance teams with transparent pricing and fast turnaround times.', badge: 'SMEs' },
    { role: 'Industrial Manufacturers & Exporters', desc: 'Expanding wholesale reach across regional and international trade corridors with guaranteed invoice settlements.', badge: 'FACTORIES' },
    { role: 'Professional Service Contractors', desc: 'Growing their business reputation, receiving qualified buyer inquiries, and securing verified client reviews.', badge: 'CONTRACTORS' },
  ]
  const TRUST_PILLARS = [
    { title: '100% Verified Business Profiles', desc: 'Every vendor undergoes multi-stage verification including government tax ID (GSTIN/VAT/EIN), bank proof validation, and physical operating location checks.' },
    { title: 'Escrow Payment Protection', desc: 'Funds are safeguarded in compliant escrow accounts and released only upon buyer milestone inspection and explicit satisfaction sign-off.' },
    { title: 'Accredited Quality Standards', desc: 'Profiles prominently feature factory audits, ISO certifications, BIS/CE compliance, and authenticated customer reviews.' },
    { title: 'Dispute Resolution & Safety', desc: 'Platform mediation team handles claims within 24 hours, ensuring fair outcomes and preventing commercial fraud.' },
  ]
  const CORRIDORS = [
    { region: 'North America', hub: 'United States', focus: 'Industrial Fasteners, Specialized Tech & Corporate Services' },
    { region: 'Europe', hub: 'Germany & United Kingdom', focus: 'Precision Engineering, Renewable Energy & Commercial Logistics' },
    { region: 'Middle East', hub: 'United Arab Emirates', focus: 'Construction Infrastructure, Hospitality Sourcing & Trade Hubs' },
    { region: 'South Asia', hub: 'India (Rajasthan & NCR)', focus: 'Steel, Cement, Electrical Components, Textiles & Craftsmanship' },
    { region: 'Southeast Asia', hub: 'Singapore', focus: 'Electronics, Hybrid Collaboration Systems & Regional Logistics' },
  ]
  const ADVANTAGES = [
    { title: 'No Middleman Markup', desc: 'Direct commercial relationships with vetted factories and service contractors.' },
    { title: 'Side-by-Side Comparison', desc: 'Compare quotes across pricing, lead times, warranties, and supplier track record.' },
    { title: 'End-to-End Tracking', desc: 'From initial quotation to contract award, milestone approval, and tax invoice generation.' },
    { title: 'Cross-Border Ready', desc: 'Multi-currency settlement support, regional compliance documentation, and freight coordination.' },
  ]

  return <div className="public-about-page">
    <section className="about-hero-section"><div className="section-container">
      <div className="about-hero-center"><span className="eyebrow-tag"><Sparkles size={13} strokeWidth={2.4}/>ABOUT VENDORVERSE</span><h1 className="about-hero-title">Connecting Businesses. <span className="text-gradient">Creating Opportunities.</span></h1><p className="about-hero-lead">VendorVerse is the next-generation global marketplace connecting buyers, verified suppliers, and professional contractors across international trade corridors.</p></div>
      <div className="about-vision-card"><div className="vision-card-inner"><div className="vision-quote-col"><span className="vision-badge">OUR FOUNDATIONAL STORY</span><h3 className="vision-heading">Re-architecting Global Trade for Trust &amp; Speed</h3><p className="vision-text">Finding dependable commercial suppliers and certified service contractors has historically been hindered by opaque pricing, fragmented directories, and lack of transaction safety. VendorVerse solves this by establishing verified identity, side-by-side quotation matrices, and milestone-based escrow payments into one coherent standard.</p></div><div className="vision-metrics-col"><div className="about-stat-item"><span className="about-stat-val">5+</span><span className="about-stat-label">Core Global Hubs</span></div><div className="about-stat-item"><span className="about-stat-val">100%</span><span className="about-stat-label">Verified Profiles</span></div><div className="about-stat-item"><span className="about-stat-val">30+</span><span className="about-stat-label">Commercial Industries</span></div></div></div></div>
    </div></section>

    <section className="about-section bg-ice"><div className="section-container"><div className="section-header-center"><span className="eyebrow-tag">UNIFIED ECOSYSTEM</span><h2 className="section-heading dark">Three Unified Pathways on <span className="text-gradient">One Platform</span></h2><p className="section-subcopy center">Designed from the ground up to support varied business requirements seamlessly.</p></div><div className="about-ecosystems-grid">{ECOSYSTEMS.map((eco,idx)=>{const Icon=eco.icon;return <TiltCard key={idx} className="about-tilt-wrap" maxTilt={6} scale={1.02} elevation={14}><div className="about-eco-card"><div className="eco-icon-wrap"><Icon size={24} strokeWidth={2.2}/></div><h3 className="eco-title">{eco.title}</h3><h4 className="eco-subtitle">{eco.subtitle}</h4><p className="eco-desc">{eco.desc}</p></div></TiltCard>})}</div></div></section>

    <section className="about-section"><div className="section-container"><div className="section-header-center"><span className="eyebrow-tag">WHO WE SERVE</span><h2 className="section-heading dark">Empowering Every Participant in the <span className="text-gradient">Supply Chain</span></h2><p className="section-subcopy center">Tailored workflows for individual buyers, growing enterprises, and established manufacturers.</p></div><div className="about-audience-grid">{AUDIENCES.map((aud,idx)=><div key={idx} className="about-audience-card"><span className="audience-badge">{aud.badge}</span><h3 className="audience-title">{aud.role}</h3><p className="audience-desc">{aud.desc}</p></div>)}</div></div></section>

    <section className="about-section bg-ice"><div className="section-container"><div className="section-header-center"><span className="eyebrow-tag">TRUST &amp; COMPLIANCE</span><h2 className="section-heading dark">Built on Trust, Verification &amp; <span className="text-gradient">Financial Safety</span></h2><p className="section-subcopy center">Our four-layer trust model ensures every interaction is secure, authentic, and accountable.</p></div><div className="about-trust-grid">{TRUST_PILLARS.map((tp,idx)=><div key={idx} className="about-trust-card"><div className="trust-check-badge"><ShieldCheck size={20} strokeWidth={2.2}/></div><h3 className="trust-pillar-title">{tp.title}</h3><p className="trust-pillar-desc">{tp.desc}</p></div>)}</div></div></section>

    <section className="about-section"><div className="section-container"><div className="section-header-center"><span className="eyebrow-tag">GLOBAL CORRIDORS</span><h2 className="section-heading dark">Worldwide Reach with <span className="text-gradient">Local Market Depth</span></h2><p className="section-subcopy center">Active trade connections connecting primary manufacturing territories and major commercial consumption centers.</p></div><div className="corridors-list-card">{CORRIDORS.map((c,idx)=><div key={idx} className="corridor-row"><div className="corridor-region"><Globe2 size={18} className="text-sky-600 shrink-0"/><strong>{c.region}</strong></div><div className="corridor-hub"><span className="corridor-tag">HUB</span><span>{c.hub}</span></div><div className="corridor-focus"><span className="text-slate-400 text-xs">CORE CAPABILITIES:</span><p className="text-sm font-medium text-slate-800">{c.focus}</p></div></div>)}</div></div></section>

    <section className="about-section bg-ice"><div className="section-container"><div className="section-header-center"><span className="eyebrow-tag">COMPETITIVE ADVANTAGE</span><h2 className="section-heading dark">Why Forward-Thinking Businesses <span className="text-gradient">Choose VendorVerse</span></h2><p className="section-subcopy center">Eliminate procurement friction and replace cumbersome negotiations with streamlined operations.</p></div><div className="about-advantages-grid">{ADVANTAGES.map((adv,idx)=><div key={idx} className="advantage-card"><div className="advantage-check"><CheckCircle2 size={20} strokeWidth={2.4}/></div><div><h3 className="advantage-title">{adv.title}</h3><p className="advantage-desc">{adv.desc}</p></div></div>)}</div></div></section>

    <section className="about-cta-section"><div className="section-container"><div className="about-cta-card"><span className="eyebrow-tag">GET STARTED TODAY</span><h2 className="about-cta-heading">Ready to Modernize Your Sourcing &amp; Growth?</h2><p className="about-cta-desc">Join thousands of buyers, suppliers and contractors trading securely across global business markets.</p><div className="about-cta-buttons"><button type="button" className="hero-primary-btn" onClick={onExplore}>Explore Marketplace <ArrowRight size={18} strokeWidth={2.4}/></button><button type="button" className="outline-sky-btn" onClick={onBecomeVendor}>Become a Verified Vendor</button></div></div></div></section>
  </div>
}
