import React, { useMemo, useState } from 'react'
import { Search, MapPin, Package, Wrench, Building2, Home, HardHat, CalendarDays, BriefcaseBusiness, Boxes, Laptop, Settings, Factory, Grid2X2, List, SlidersHorizontal, ChevronDown, ShoppingBag, X, ArrowRight } from 'lucide-react'
import { LISTINGS0, VENDORS0 } from '../../data.jsx'

const categories = [
  ['For You', 'all', ShoppingBag], ['Home & Household', 'Home & Household', Home], ['Construction', 'Construction', HardHat],
  ['Events & Celebrations', 'Events & Celebrations', CalendarDays], ['Professional Services', 'Professional Services', BriefcaseBusiness],
  ['Wholesale & Distribution', 'Wholesale & Distribution', Boxes], ['Electronics', 'Electronics', Laptop],
  ['Machinery & Equipment', 'Machinery & Equipment', Settings], ['Industrial Supplies', 'Industrial Supplies', Factory], ['More', 'all', SlidersHorizontal],
]
const countries = ['India', 'United States', 'Germany', 'United Kingdom', 'Singapore', 'United Arab Emirates']
const industries = ['Home & Household', 'Construction', 'Events & Celebrations', 'Professional Services', 'Wholesale & Distribution', 'Electronics', 'Machinery & Equipment', 'Industrial Supplies']
const categoryFor = (cat, sub = '') => {
  if (['home', 'clean'].includes(cat)) return 'Home & Household'
  if (cat === 'build') return 'Construction'
  if (cat === 'event') return 'Events & Celebrations'
  if (cat === 'staff') return 'Professional Services'
  if (cat === 'office') return 'Professional Services'
  if (cat === 'elec' && /wire|switch|lighting|cable|power|solar/i.test(sub)) return 'Electronics'
  if (cat === 'elec' && /machine|tool/i.test(sub)) return 'Machinery & Equipment'
  return 'Wholesale & Distribution'
}
const imageFor = (category) => ({
  'Home & Household': '/images/industry-home.jpg', Construction: '/images/industry-construction.jpg',
  'Events & Celebrations': '/images/industry-events.jpg', 'Professional Services': '/images/industry-professional.jpg',
  'Wholesale & Distribution': '/images/industry-wholesale.jpg', Electronics: '/images/cat-it.jpg',
  'Machinery & Equipment': '/images/cat-manufacturing.jpg', 'Industrial Supplies': '/images/cat-logistics.jpg',
}[category] || '/images/industry-wholesale.jpg')

export function PublicExploreView({ initialType = 'all', initialCategory = '', initialLocation = '', initialQuery = '', onActionRequireLogin, isLoggedIn = false, onAddToCart }) {
  const [activeTab, setActiveTab] = useState(initialType || 'all')
  const [searchQuery, setSearchQuery] = useState(initialQuery || '')
  const [selectedCountry, setSelectedCountry] = useState(countries.includes(initialLocation) ? initialLocation : 'all')
  const [selectedIndustry, setSelectedIndustry] = useState(industries.includes(initialCategory) ? initialCategory : 'all')
  const [listingType, setListingType] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [city, setCity] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [view, setView] = useState('grid')
  const [collapsed, setCollapsed] = useState({})
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery || '')
  const vendorById = useMemo(() => Object.fromEntries(VENDORS0.map((v) => [v.id, v])), [])
  const listings = useMemo(() => LISTINGS0.filter((item) => item.status === 'approved').map((item) => {
    const vendor = vendorById[item.vendorId]
    const industry = categoryFor(item.cat, item.sub)
    return { ...item, vendorName: vendor?.name || 'Marketplace supplier', country: vendor?.country || 'India', city: vendor?.city || '', industry, image: imageFor(industry), listingType: item.type === 'product' ? 'Product' : 'Service' }
  }), [vendorById])
  const results = useMemo(() => {
    const q = submittedQuery.trim().toLowerCase()
    return listings.filter((item) => {
      if (activeTab === 'services' && item.type !== 'service') return false
      if (activeTab === 'products' && item.type !== 'product') return false
      if (activeTab === 'businesses' && !item.moq) return false
      if (listingType === 'Businesses' && !item.moq) return false
      if (listingType === 'Suppliers' && item.type !== 'product') return false
      if (listingType === 'Product' && item.type !== 'product') return false
      if (listingType === 'Service' && item.type !== 'service') return false
      if (selectedCountry !== 'all' && item.country !== selectedCountry) return false
      if (selectedIndustry !== 'all' && item.industry !== selectedIndustry) return false
      if (city && !`${item.city} ${item.country}`.toLowerCase().includes(city.toLowerCase())) return false
      if (minPrice && item.price < Number(minPrice)) return false
      if (maxPrice && item.price > Number(maxPrice)) return false
      if (q && ![item.title, item.desc, item.vendorName, item.industry, item.sub, item.city, item.country].some((v) => String(v || '').toLowerCase().includes(q))) return false
      return true
    }).sort((a, b) => sortBy === 'price_asc' ? a.price - b.price : sortBy === 'price_desc' ? b.price - a.price : sortBy === 'recent' ? b.id.localeCompare(a.id) : 0)
  }, [listings, submittedQuery, activeTab, listingType, selectedCountry, selectedIndustry, city, minPrice, maxPrice, sortBy])
  const runSearch = () => { setLoading(true); setSubmittedQuery(searchQuery); window.setTimeout(() => setLoading(false), 180) }
  const clearAll = () => { setSearchQuery(''); setSubmittedQuery(''); setSelectedCountry('all'); setSelectedIndustry('all'); setListingType('all'); setMinPrice(''); setMaxPrice(''); setCity(''); setActiveTab('all'); setSortBy('relevance') }
  const toggle = (name) => setCollapsed((old) => ({ ...old, [name]: !old[name] }))
  const action = (item, type) => { if (!isLoggedIn) onActionRequireLogin?.({ type, title: item.title, item }); else if (type === 'cart') onAddToCart?.(item) }
  const filterGroup = (name, title, children) => <section className="vv-filter-group" key={name}><button className="vv-filter-heading" onClick={() => toggle(name)} aria-expanded={!collapsed[name]}>{title}<ChevronDown size={16} className={collapsed[name] ? 'vv-chevron-closed' : ''}/></button>{!collapsed[name] && <div className="vv-filter-options">{children}</div>}</section>

  return <div className="public-explore-page vv-explore">
    <nav className="vv-category-strip" aria-label="Explore categories">{categories.map(([label, value, Icon]) => <button key={label} className={selectedIndustry === value || (label === 'For You' && selectedIndustry === 'all') ? 'vv-category active' : 'vv-category'} onClick={() => setSelectedIndustry(value)}><Icon size={23}/><span>{label}</span></button>)}</nav>
    <section className="explore-hero-banner"><div className="section-container">
      <div className="explore-hero-copy"><span className="eyebrow-tag">UNIVERSAL BROWSE &amp; SEARCH</span><h1 className="explore-main-title">Explore Products, Services &amp; <span className="text-gradient">Suppliers</span></h1><p className="explore-subtitle">Browse products, services and suppliers across categories and locations. Explore marketplace listings without signing in.</p></div>
      <form className="explore-search-bar-wrap vv-search-form" onSubmit={(e) => { e.preventDefault(); runSearch() }}><Search size={23} className="search-lead-icon"/><input aria-label="Search listings" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for products, trade services, companies or keywords..."/><button type="submit">Search</button></form>
      <div className="explore-intent-tabs">{[['all','All Opportunities',Search],['products','Products & Suppliers',Package],['services','Hire Services',Wrench],['businesses','Business Procurement',Building2]].map(([id,label,Icon]) => <button key={id} className={`explore-tab-btn ${activeTab===id?'active':''}`} onClick={() => setActiveTab(id)}><Icon size={17}/>{label}</button>)}</div>
    </div></section>
    <div className="section-container vv-explore-layout">
      <aside className={`vv-filter-panel ${filtersOpen?'open':''}`}><div className="vv-filter-top"><strong><SlidersHorizontal size={17}/> Filters</strong><button onClick={clearAll}>Clear All</button><button className="vv-filter-close" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={18}/></button></div>
        {filterGroup('country','Country',<><label><input type="radio" name="country" checked={selectedCountry==='all'} onChange={() => setSelectedCountry('all')}/>All Countries</label>{countries.slice(0,4).map(c=><label key={c}><input type="radio" name="country" checked={selectedCountry===c} onChange={() => setSelectedCountry(c)}/>{c}</label>)}<select aria-label="More countries" value={countries.includes(selectedCountry)?'':selectedCountry} onChange={(e)=>setSelectedCountry(e.target.value||'all')}><option value="">More countries</option>{countries.slice(4).map(c=><option key={c}>{c}</option>)}</select></>)}
        {filterGroup('industry','Industry',<><label><input type="radio" name="industry" checked={selectedIndustry==='all'} onChange={() => setSelectedIndustry('all')}/>All Industries</label>{industries.slice(0,5).map(c=><label key={c}><input type="radio" name="industry" checked={selectedIndustry===c} onChange={() => setSelectedIndustry(c)}/>{c}</label>)}</>)}
        {filterGroup('type','Listing Type',<>{['all','Product','Suppliers','Service','Businesses'].map(t=><label key={t}><input type="radio" name="type" checked={listingType===t} onChange={()=>setListingType(t)}/>{t==='all'?'All Types':t}</label>)}</>)}
        {filterGroup('price','Price Range',<><div className="vv-price-row"><input type="number" min="0" placeholder="Minimum" value={minPrice} onChange={e=>setMinPrice(e.target.value)}/><input type="number" min="0" placeholder="Maximum" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)}/></div><small>Price in INR (₹), as listed</small></>)}
        {filterGroup('location','Location',<><select aria-label="Country" value={selectedCountry} onChange={e=>setSelectedCountry(e.target.value)}><option value="all">All Countries</option>{countries.map(c=><option key={c}>{c}</option>)}</select><input placeholder="City or region" value={city} onChange={e=>setCity(e.target.value)}/></>)}
      </aside>
      <section className="vv-results-area"><div className="explore-filter-bar"><button className="vv-mobile-filter" onClick={()=>setFiltersOpen(true)}><SlidersHorizontal size={16}/> Filters</button><label>Country <select value={selectedCountry} onChange={e=>setSelectedCountry(e.target.value)}><option value="all">All Countries</option>{countries.map(c=><option key={c}>{c}</option>)}</select></label><label>Industry <select value={selectedIndustry} onChange={e=>setSelectedIndustry(e.target.value)}><option value="all">All Industries</option>{industries.map(c=><option key={c}>{c}</option>)}</select></label><label className="vv-sort">Sort <select value={sortBy} onChange={e=>setSortBy(e.target.value)}><option value="relevance">Relevance</option><option value="recent">Recently Added</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option></select></label><div className="vv-view-toggle"><button className={view==='grid'?'selected':''} onClick={()=>setView('grid')} aria-label="Grid view"><Grid2X2 size={18}/></button><button className={view==='list'?'selected':''} onClick={()=>setView('list')} aria-label="List view"><List size={18}/></button></div></div>
        <div className="explore-results-header"><p className="results-count-text">Showing <strong>{results.length}</strong> opportunities</p></div>
        {loading ? <div className="vv-state">Loading listings…</div> : results.length===0 ? <div className="vv-state"><Package size={38}/><h3>No results found</h3><p>Try a different search or clear some filters.</p><button onClick={clearAll}>Clear filters</button></div> : <div className={`explore-listings-grid ${view==='list'?'vv-list-view':''}`}>{results.map(item=><article key={item.id} className="explore-listing-card"><div className="listing-card-media"><img src={item.image} alt="" className="listing-img"/><span className="listing-type-badge">{item.listingType}</span></div><div className="listing-card-body"><span className="vv-industry-label">{item.industry}</span><h3 className="listing-title">{item.title}</h3><p className="listing-desc">{item.desc}</p><div className="listing-location-row"><MapPin size={14}/><span>{[item.city,item.country].filter(Boolean).join(', ')}</span></div><div className="vv-card-footer"><span>{item.vendorName}</span><button onClick={()=>action(item,item.type==='product'?'cart':'booking')}>{item.type==='product'?'Add to Cart':'Book Service'}</button><button className="vv-details" onClick={()=>setSelectedItem(item)}>View Details <ArrowRight size={14}/></button></div></div></article>)}</div>}
      </section>
    </div>
    {selectedItem && <div className="vv-detail-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)setSelectedItem(null)}}><section className="vv-detail-modal" role="dialog" aria-modal="true" aria-labelledby="vv-detail-title"><button className="vv-detail-close" onClick={()=>setSelectedItem(null)} aria-label="Close details"><X size={20}/></button><img src={selectedItem.image} alt=""/><div><span className="vv-industry-label">{selectedItem.listingType} · {selectedItem.industry}</span><h2 id="vv-detail-title">{selectedItem.title}</h2><p>{selectedItem.desc}</p><p><MapPin size={15}/> {[selectedItem.city,selectedItem.country].filter(Boolean).join(', ')}</p><strong>{selectedItem.vendorName}</strong>{selectedItem.specs?.length>0 && <dl>{selectedItem.specs.map(([k,v])=><React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}</dl>}</div></section></div>}
  </div>
}
