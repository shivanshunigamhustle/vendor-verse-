import { useState } from 'react'
import { useNav } from '../../nav.jsx'

export function Hero({ onSearch }) {
  const nav = useNav()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({ q: searchTerm.trim(), location: selectedLocation })
    } else {
      nav.go('c_explore', {
        q: searchTerm.trim() || undefined,
        location: selectedLocation !== 'All Locations' ? selectedLocation : undefined,
      })
    }
  }

  return (
    <section className="herosec" id="top">
      {/* Globe & Logistics Illustration behind text */}
      <div className="heroart" aria-hidden="false">
        <img
          src="/images/hero-art.jpg"
          alt="Globe above a cargo ship, truck and shipping containers, with Construction, Manufacturing, IT and Logistics vendor badges"
        />
      </div>

      <div className="herocontent">
        <div className="herotext">
          {/* Trust Badge */}
          <span className="badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" />
            </svg>
            A Trusted Global Marketplace
          </span>

          {/* Heading */}
          <h1 className="heroh1">
            Find trusted vendors.
            <br />
            Get <span className="work-moving">work moving.</span>
          </h1>

          {/* Description */}
          <p className="herodesc">
            Discover verified suppliers and service providers, compare quotations,
            and connect directly to get your work done faster.
          </p>

          {/* Search Form */}
          <form className="herosearch" onSubmit={handleSubmit}>
            <label className="search-input-wrap">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1b1b4b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                className="search-input"
                aria-label="Search products, services, or vendor names"
                placeholder="Search products, services or vendors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>

            <span className="search-sep" />

            <label className="search-select-wrap">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1b1b4b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <select
                className="search-select"
                aria-label="Location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="All Locations">All Locations</option>
                <option value="India">India</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Europe">Europe</option>
                <option value="North America">North America</option>
              </select>
            </label>

            <button className="search-btn" type="submit">
              Search
              <svg
                width="18"
                height="18"
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
            </button>
          </form>

          {/* Three Trust Points */}
          <div className="trustpoints">
            <span className="trustpoint">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5b21d6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Verified vendors
            </span>

            <span className="trustpoint">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5b21d6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m12 3 9 5-9 5-9-5z" />
                <path d="m3 13 9 5 9-5" />
              </svg>
              Compare quotations
            </span>

            <span className="trustpoint">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5b21d6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
              </svg>
              Direct &amp; secure communication
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
