import { useState } from 'react'
import { Ticker } from './landing/Ticker.jsx'
import { Navbar } from './landing/Navbar.jsx'
import { Hero } from './landing/Hero.jsx'
import { Categories } from './landing/Categories.jsx'
import { FeaturedVendors } from './landing/FeaturedVendors.jsx'
import { HowItWorks } from './landing/HowItWorks.jsx'
import './website-home.css'

export function WebsiteHome() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="vv-landing-page">
      {/* 1. Announcement Ticker at the very top */}
      <Ticker />

      {/* 2. Sticky Translucent Navbar */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Landing Page Sections */}
      <div id="main-content">
        {/* 3. Hero Section with Masked Background Artwork */}
        <Hero />

        {/* 4. Popular Categories Grid */}
        <Categories />

        {/* 5. Featured Verified Vendors */}
        <FeaturedVendors />

        {/* 6. How It Works - 3 Step Flow with Circular Arrow Connectors */}
        <HowItWorks />
      </div>
    </div>
  )
}
