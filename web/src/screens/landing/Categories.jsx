import { useNav } from '../../nav.jsx'

const CATEGORY_ITEMS = [
  {
    id: 'build',
    title: 'Construction',
    count: '2,480+ Verified Vendors',
    image: '/images/cat-construction.jpg',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 21h18M6 21V8l6-4 6 4v13" />
        <path d="M10 21v-6h4v6" />
      </svg>
    ),
  },
  {
    id: 'mfg',
    title: 'Manufacturing',
    count: '3,140+ Verified Vendors',
    image: '/images/cat-manufacturing.jpg',
    icon: (
      <svg
        width="24"
        height="24"
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
    ),
  },
  {
    id: 'office',
    title: 'IT & Software',
    count: '1,980+ Verified Vendors',
    image: '/images/cat-it.jpg',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />
      </svg>
    ),
  },
  {
    id: 'print',
    title: 'Logistics',
    count: '1,620+ Verified Vendors',
    image: '/images/cat-logistics.jpg',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
]

export function Categories({ onSelectCategory }) {
  const nav = useNav()

  const handleCardClick = (e, cat) => {
    e.preventDefault()
    if (onSelectCategory) {
      onSelectCategory(cat)
    } else {
      nav.go('c_explore', { cat: cat.id })
    }
  }

  const handleViewAll = (e) => {
    e.preventDefault()
    nav.go('c_categories')
    const sc = document.querySelector('.vv-customer-route')
    if (sc) sc.scrollTop = 0
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <section className="catsec" id="categories">
      <div className="secheader">
        <div>
          <h2>Popular Categories</h2>
          <p>Explore top categories and find the right vendors for your business needs.</p>
        </div>
        <a
          className="more"
          href="#/c_categories"
          onClick={handleViewAll}
        >
          View all categories
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

      <div className="catgrid">
        {CATEGORY_ITEMS.map((item) => (
          <a
            key={item.id}
            className="catcard"
            href="#vendors"
            onClick={(e) => handleCardClick(e, item)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="catthumb"
            />
            <span className="catbody">
              <span className="caticon">{item.icon}</span>
              <span className="cattext">
                <b>{item.title}</b>
                <span>{item.count}</span>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1b1b4b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 5 7 7-7 7" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
