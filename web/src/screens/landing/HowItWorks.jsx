export function HowItWorks() {
  return (
    <section className="howsec" id="how">
      <div className="how">
        {/* Title Block */}
        <div className="howhead">
          <h2>How it works</h2>
          <p>Get from requirement to the right vendor in three simple steps.</p>
        </div>

        {/* 3 Step Cards */}
        <ol className="steps">
          {/* Step 1 */}
          <li className="step">
            <span className="sic">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <div>
              <h3>1. Find what you need</h3>
              <p>Search for products, services, or vendors across multiple categories.</p>
            </div>
          </li>

          {/* Step 2 */}
          <li className="step">
            <span className="sic">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m12 3 9 5-9 5-9-5z" />
                <path d="m3 13 9 5 9-5" />
                <path d="m3 17.5 9 5 9-5" opacity="0.55" />
              </svg>
            </span>
            <div>
              <h3>2. Compare options</h3>
              <p>Review verified vendors, check ratings, and compare quotations.</p>
            </div>
          </li>

          {/* Step 3 */}
          <li className="step">
            <span className="sic">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="8" r="3.5" />
                <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
                <circle cx="17" cy="9" r="2.8" />
                <path d="M17 14c2.6 0 4.5 1.8 4.5 4.5" />
              </svg>
            </span>
            <div>
              <h3>3. Connect directly</h3>
              <p>Reach out to vendors, discuss your requirements, and get the best deal.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}
