export function PolicyModal({ type, isOpen, onClose }) {
  if (!isOpen) return null

  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    cookies: 'Cookie Policy',
    about: 'About VendorVerse',
    careers: 'Careers at VendorVerse',
    contact: 'Contact Support',
  }

  return (
    <div className="policy-modal-backdrop" role="dialog" aria-modal="true">
      <div className="policy-modal-card">
        <div className="policy-modal-header">
          <h3>{titles[type] || 'Policy Document'}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="policy-modal-body">
          {type === 'privacy' && (
            <div>
              <p><strong>Effective Date: November 2026</strong></p>
              <p>
                VendorVerse is dedicated to protecting the privacy of buyers, suppliers, and service providers.
                In Phase 1 (Jaipur, Ajmer, Sikar, and Delhi NCR), business registration details, GSTIN, and contact information
                are verified strictly to prevent fraudulent listings.
              </p>
              <h4>Data Handling Principles</h4>
              <ul>
                <li>We do not sell contact information to unauthorized 3rd parties.</li>
                <li>Communications between buyers and service providers occur through marketplace channels.</li>
                <li>Payment terms and commercial settlements in Phase 1 occur directly between counter-parties.</li>
              </ul>
            </div>
          )}

          {type === 'terms' && (
            <div>
              <p><strong>Terms of Use — B2B Marketplace Platform</strong></p>
              <p>
                Welcome to VendorVerse. By accessing this platform, buyers and vendors agree to conduct trade
                honestly, maintain up-to-date business registrations, and deliver goods and services as quoted.
              </p>
              <h4>Verification Standards</h4>
              <p>
                Vendor verification badges reflect documentary review and site verification at the recorded inspection date.
                Users must independently evaluate quotation terms, delivery timelines, and warranty terms.
              </p>
            </div>
          )}

          {type === 'cookies' && (
            <div>
              <p><strong>Cookie &amp; Local Storage Policy</strong></p>
              <p>
                VendorVerse utilizes standard session cookies and browser local storage to preserve your launch city preference,
                selected intent tabs, and active session authentication. No non-essential tracking pixels are installed.
              </p>
            </div>
          )}

          {type === 'about' && (
            <div>
              <p><strong>About VendorVerse</strong></p>
              <p>
                VendorVerse is India's B2B + B2C multi-vendor marketplace connecting service providers,
                manufacturers, wholesale distributors, and businesses across Jaipur, Ajmer, Sikar, and Delhi NCR.
              </p>
            </div>
          )}

          {type === 'careers' && (
            <div>
              <p><strong>Careers at VendorVerse</strong></p>
              <p>
                We are building VendorVerse&apos;s Phase 1 operations across Jaipur, Ajmer, Sikar, and Delhi NCR.
                Roles span regional vendor onboarding, partner success, and product engineering.
              </p>
              <p>Reach out with your background at careers@vendorverse.in.</p>
            </div>
          )}

          {type === 'contact' && (
            <div>
              <p><strong>Contact Support &amp; Launch Markets</strong></p>
              <p>Phase 1 Launch Operations: Jaipur, Ajmer, Sikar &amp; Delhi NCR</p>
              <p>Support Email: support@vendorverse.in</p>
              <p>Hours: Mon &ndash; Sat, 9:00 AM &ndash; 7:00 PM IST</p>
            </div>
          )}
        </div>

        <div className="policy-modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
