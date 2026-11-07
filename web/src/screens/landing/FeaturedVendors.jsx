import { useNav } from '../../nav.jsx'

const FEATURED_VENDORS = [
  {
    id: 'v-buildwell',
    name: 'BuildWell Constructions',
    cat: 'Construction & Infrastructure',
    city: 'Mumbai, India',
    rating: '4.8',
    reviews: '(142 reviews)',
    photo: '/images/vendor-buildwell.jpg',
  },
  {
    id: 'v-prime',
    name: 'Prime Manufacturing Ltd.',
    cat: 'Manufacturing',
    city: 'Pune, India',
    rating: '4.7',
    reviews: '(98 reviews)',
    photo: '/images/vendor-prime.jpg',
  },
  {
    id: 'v-technova',
    name: 'TechNova Solutions',
    cat: 'IT & Software',
    city: 'Bengaluru, India',
    rating: '4.9',
    reviews: '(187 reviews)',
    photo: '/images/vendor-technova.jpg',
  },
]

export function FeaturedVendors({ onQuoteRequest, onViewProfile }) {
  const nav = useNav()

  const handleViewProfile = (e, vendor) => {
    e.preventDefault()
    if (onViewProfile) {
      onViewProfile(vendor)
    } else {
      nav.go('c_vendor_detail', { vendorId: vendor.id })
    }
  }

  const handleRequestQuote = (e, vendor) => {
    e.preventDefault()
    if (onQuoteRequest) {
      onQuoteRequest(vendor)
    } else {
      nav.go('c_rfq_new', { vendorId: vendor.id, vendorName: vendor.name })
    }
  }

  const handleViewAll = (e) => {
    e.preventDefault()
    nav.go('c_explore_suppliers')
  }

  return (
    <section className="vendorsec" id="vendors">
      <div className="secheader">
        <div>
          <h2>
            Featured verified vendors
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              aria-label="Verified"
            >
              <path
                d="M12 1.5 14.6 4l3.6-.3.9 3.5 3.1 1.8-1.3 3.4 1.3 3.4-3.1 1.8-.9 3.5-3.6-.3L12 22.5 9.4 20l-3.6.3-.9-3.5-3.1-1.8 1.3-3.4-1.3-3.4 3.1-1.8.9-3.5 3.6.3z"
                fill="#5b21d6"
              />
              <path
                d="m8 12 3 3 5-6"
                stroke="#ffffff"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h2>
          <p>Top-rated and verified vendors trusted by businesses worldwide.</p>
        </div>
        <a
          className="more"
          href="#vendors"
          onClick={handleViewAll}
        >
          View all vendors
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      <div className="vendorgrid">
        {FEATURED_VENDORS.map((v) => (
          <article key={v.id} className="vendorcard">
            {/* Vendor Photo with Overlay HTML Badge */}
            <div className="vendorphoto-wrap">
              <img
                src={v.photo}
                alt=""
                className="vendorphoto"
              />
              {/* IMPORTANT: Rendered ONLY ONCE per card as HTML overlay */}
              <span className="verified-overlay">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" fill="#ffffff" />
                  <path
                    d="m8 12 3 3 5-6"
                    stroke="#1b1b4b"
                    strokeWidth="2.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Verified Vendor
              </span>
            </div>

            {/* Vendor Details */}
            <div className="vendorinfo">
              <h3>
                {v.name}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-label="Verified"
                >
                  <circle cx="12" cy="12" r="10" fill="#5b21d6" />
                  <path
                    d="m8 12 3 3 5-6"
                    stroke="#ffffff"
                    strokeWidth="2.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h3>
              <span className="vendorcat">{v.cat}</span>
              <span className="vendorcity">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {v.city}
              </span>
              <span className="vendorrating">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="m12 2 3 6.5 7 .9-5.1 4.9 1.3 7L12 17.8 5.8 21.3l1.3-7L2 9.4l7-.9z"
                    fill="#f5a623"
                  />
                </svg>
                <b>{v.rating}</b>
                <span>{v.reviews}</span>
              </span>
            </div>

            {/* Actions */}
            <div className="vendoractions">
              <a
                className="vendorprofile-link"
                href="#vendors"
                onClick={(e) => handleViewProfile(e, v)}
              >
                View profile
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <button
                className="vendorquote-btn"
                type="button"
                onClick={(e) => handleRequestQuote(e, v)}
              >
                Request a quote
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
