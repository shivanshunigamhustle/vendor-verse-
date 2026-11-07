import { useState } from 'react'

const ANNOUNCEMENTS = [
  'New: request quotes from several verified vendors at once',
  'Compare quotations side by side before you decide',
  'Connect directly and securely with verified vendors',
  'Browse Construction, Manufacturing, IT & Software and Logistics vendors',
  'Join free and get your work moving faster',
]

export function Ticker({ onSelectAnnouncement }) {
  const [isPaused, setIsPaused] = useState(false)

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const handleClick = (e, item) => {
    e.preventDefault()
    if (onSelectAnnouncement) {
      onSelectAnnouncement(item)
    } else {
      const el = document.getElementById('vendors')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      className={`ticker ${isPaused ? 'paused' : ''}`}
      id="ticker"
      role="region"
      aria-label="Announcements"
    >
      <span className="tlabel">
        <i className="tdot" aria-hidden="true" />
        NEW
      </span>

      <div className="tview">
        <div className="ttrack">
          {/* Primary Announcement Track */}
          <div className="tg">
            {ANNOUNCEMENTS.map((msg, i) => (
              <span key={`primary-${i}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <a
                  className="ti"
                  href="#vendors"
                  onClick={(e) => handleClick(e, msg)}
                >
                  {msg}
                </a>
                <span className="tsep" aria-hidden="true">&#9670;</span>
              </span>
            ))}
          </div>

          {/* Duplicated Track for Seamless Infinite Scrolling */}
          <div className="tg" aria-hidden="true">
            {ANNOUNCEMENTS.map((msg, i) => (
              <span key={`clone-${i}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <a
                  className="ti"
                  href="#vendors"
                  tabIndex={-1}
                  onClick={(e) => handleClick(e, msg)}
                >
                  {msg}
                </a>
                <span className="tsep" aria-hidden="true">&#9670;</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        className="tpause"
        id="tpause"
        type="button"
        onClick={togglePause}
        aria-label={isPaused ? 'Play announcements' : 'Pause announcements'}
        aria-pressed={isPaused}
        title={isPaused ? 'Play announcements' : 'Pause announcements'}
      >
        <svg
          className="pi"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
        <svg
          className="pl"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7 4.5v15l13-7.5z" />
        </svg>
      </button>
    </div>
  )
}

