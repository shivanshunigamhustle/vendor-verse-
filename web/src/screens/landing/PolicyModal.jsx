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
                Business registration details and contact information are handled responsibly to support
                transparent B2B and customer interactions across markets.
              </p>
              <h4>Data Handling Principles</h4>
              <ul>
                <li>We do not sell contact information to unauthorized third parties.</li>
                <li>Communications between buyers and service providers occur through marketplace channels.</li>
                <li>Commercial terms and invoicing agreements occur directly between participating businesses.</li>
              </ul>
            </div>
          )}

          {type === 'terms' && (
            <div>
              <p><strong>Terms of Use — B2B &amp; B2C Marketplace Platform</strong></p>
              <p>
                Welcome to VendorVerse. By accessing this platform, buyers and vendors agree to conduct business
                transparently, maintain accurate profile details, and fulfill confirmed scopes as agreed.
              </p>
              <h4>Marketplace Standards</h4>
              <p>
                Participants are responsible for the accuracy of their service scopes and quotations.
                Users should independently review quotation terms, delivery schedules, and contract clauses before confirming orders.
              </p>
            </div>
          )}

          {type === 'cookies' && (
            <div>
              <p><strong>Cookie &amp; Local Storage Policy</strong></p>
              <p>
                VendorVerse utilizes standard session cookies and browser local storage to preserve your selected location preference,
                active search filters, and session state. No non-essential tracking pixels are installed.
              </p>
            </div>
          )}

          {type === 'about' && (
            <div>
              <p><strong>About VendorVerse</strong></p>
              <p>
                VendorVerse is a global B2B + B2C marketplace platform designed to connect buyers,
                suppliers, manufacturers, and service providers across structured procurement workflows.
              </p>
            </div>
          )}

          {type === 'careers' && (
            <div>
              <p><strong>Careers at VendorVerse</strong></p>
              <p>
                We are building VendorVerse&apos;s marketplace platform across product engineering, design,
                and partner operations.
              </p>
              <p>Reach out with your background at careers@vendorverse.in.</p>
            </div>
          )}

          {type === 'contact' && (
            <div>
              <p><strong>Contact Support</strong></p>
              <p>Marketplace Support: Available via Help &amp; Inquiries</p>
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
