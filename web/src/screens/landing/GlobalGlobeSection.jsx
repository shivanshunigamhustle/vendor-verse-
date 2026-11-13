import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Globe2, MapPin, Compass, Clock } from 'lucide-react'
import { useNav } from '../../nav.jsx'
import { GLOBAL_MARKETS, formatCoordinates } from './worldGlobeData.js'
import { GlobalGlobeCanvas } from './GlobalGlobeCanvas.jsx'

export function GlobalGlobeSection({ onNavigateCountry }) {
  const nav = useNav()

  // Single shared selection state synchronizing Left list, 3D Earth markers & Right info panel
  const [selectedLocation, setSelectedLocation] = useState({
    countryId: 'india',
    cityId: null,
    isZoomed: false,
  })

  const activeCountry = useMemo(
    () => GLOBAL_MARKETS.find((c) => c.id === selectedLocation.countryId) || GLOBAL_MARKETS[0],
    [selectedLocation.countryId],
  )

  const activeCity = useMemo(() => {
    if (!selectedLocation.isZoomed || !selectedLocation.cityId) return null
    return activeCountry.cities.find((ct) => ct.id === selectedLocation.cityId) || null
  }, [activeCountry, selectedLocation.isZoomed, selectedLocation.cityId])

  // Preload location reference photography
  useEffect(() => {
    GLOBAL_MARKETS.forEach((country) => {
      const cImg = new Image()
      cImg.src = country.image
      country.cities.forEach((city) => {
        const ctImg = new Image()
        ctImg.src = city.image
      })
    })
  }, [])

  const handleSelectCountry = useCallback((countryId) => {
    const target = GLOBAL_MARKETS.find((c) => c.id === countryId)
    if (!target) return
    setSelectedLocation({
      countryId,
      cityId: target.cities?.[0]?.id || null,
      isZoomed: true,
    })
  }, [])

  const handleSelectCity = useCallback((countryId, cityId) => {
    setSelectedLocation({
      countryId,
      cityId,
      isZoomed: true,
    })
  }, [])

  const handleResetGlobe = useCallback(() => {
    setSelectedLocation((prev) => ({
      countryId: prev.countryId,
      cityId: null,
      isZoomed: false,
    }))
  }, [])

  const displayTitle = activeCity
    ? `${activeCity.name}, ${activeCountry.name}`
    : activeCountry.name
  const displayBadge = activeCity ? activeCity.subregion : activeCountry.region
  const displayFocus = activeCity ? activeCity.focusArea : activeCountry.focusArea
  const displayCoords = activeCity
    ? formatCoordinates(activeCity.lat, activeCity.lon)
    : formatCoordinates(activeCountry.lat, activeCountry.lon)
  const displayTimeZone = activeCity ? activeCity.timeZone : activeCountry.timeZone
  const displayIndustries = activeCity ? activeCity.industriesLine : activeCountry.industriesLine
  const displayOverview = activeCity ? activeCity.overview : activeCountry.overview
  const displayImage = activeCity ? activeCity.image : activeCountry.image
  const displayFallback = activeCity ? activeCity.fallbackImg : activeCountry.fallbackImg

  return (
    <section
      id="markets"
      className="global-globe-section"
      aria-labelledby="global-globe-heading"
    >
      {/* Subtle Sky-Blue studio contour & atmospheric glow */}
      <div className="global-tech-backdrop" aria-hidden="true" />
      <div className="global-ambient-glow" aria-hidden="true" />

      <div className="section-container">
        <div className="global-globe-grid">
          {/* LEFT: Global Locations & Regional Hubs Selector */}
          <div className="globe-left-col">
            <span className="eyebrow-tag">
              <Globe2 size={13} strokeWidth={2.4} />
              GLOBAL NETWORK
            </span>
            <h2 id="global-globe-heading" className="section-heading dark">
              Explore Global Locations.
            </h2>
            <p className="section-subcopy">
              Rotate the 3D Earth or choose a location below to inspect regional geography and key
              city coordinates.
            </p>

            {/* Compact Interactive Country & City Selector Stack */}
            <div className="country-selector-list" role="tablist" aria-label="Global Locations">
              {GLOBAL_MARKETS.map((country) => {
                const isSelected = country.id === activeCountry.id
                const isFocused = selectedLocation.isZoomed && isSelected
                return (
                  <div
                    key={country.id}
                    className={`country-selector-card ${isSelected ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className="country-selector-row"
                      onClick={() => handleSelectCountry(country.id)}
                    >
                      <div className="country-row-left">
                        <span className="country-pin-icon" aria-hidden="true">
                          <MapPin size={15} strokeWidth={2.3} />
                        </span>
                        <div className="country-row-text">
                          <strong>{country.name}</strong>
                          <span className="country-row-sub">{country.tagline}</span>
                        </div>
                      </div>

                      <div className="country-row-right">
                        {isFocused ? (
                          <span className="country-active-pill">Viewing</span>
                        ) : (
                          <span className="country-region-mini">{country.region}</span>
                        )}
                      </div>
                    </button>

                    {/* City Drill-Down Chips inside selected location */}
                    {isSelected && (
                      <div
                        className="country-cities-drawer"
                        role="group"
                        aria-label={`Locations in ${country.name}`}
                      >
                        {country.cities.map((city) => {
                          const cityActive = isFocused && selectedLocation.cityId === city.id
                          return (
                            <button
                              key={city.id}
                              type="button"
                              className={`city-drill-chip ${cityActive ? 'active' : ''}`}
                              onClick={() => handleSelectCity(country.id, city.id)}
                            >
                              {city.name}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="globe-coverage-note">
              <Compass size={16} strokeWidth={2} />
              <span>
                Drag the Earth to rotate manually or select any cyan-highlighted country marker.
              </span>
            </div>
          </div>

          {/* CENTER: Floating Realistic Interactive 3D Earth Globe */}
          <div className="globe-center-col">
            <div className="globe-center-stage">
              <GlobalGlobeCanvas
                selectedLocation={selectedLocation}
                onSelectCountry={handleSelectCountry}
                onSelectCity={handleSelectCity}
                onResetGlobe={handleResetGlobe}
              />
            </div>
          </div>

          {/* RIGHT: Synchronized Location & Geographical Information Panel */}
          <div className="globe-right-col">
            <div
              className="market-spotlight-card"
              key={`${activeCountry.id}-${activeCity?.id || 'country'}`}
            >
              <div className="spotlight-card-header">
                <span className="spotlight-breadcrumb">
                  <MapPin size={14} strokeWidth={2.5} />
                  {activeCity ? `${activeCountry.name} Hub` : 'Location Profile'}
                </span>
                <span className="spotlight-region-badge">{displayBadge}</span>
              </div>

              <div className="spotlight-thumb-wrap">
                <img
                  src={displayImage}
                  alt={displayTitle}
                  className="spotlight-thumb-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = displayFallback
                  }}
                />
              </div>

              <div className="spotlight-card-body">
                <h3 className="spotlight-title">{displayTitle}</h3>
                <p className="spotlight-subtitle">{displayFocus}</p>

                <div className="spotlight-geo-pills">
                  <span className="spotlight-workflow-pill">
                    <Compass size={13} strokeWidth={2.4} color="#0284C7" />
                    <span>{displayCoords}</span>
                  </span>
                  <span className="spotlight-workflow-pill">
                    <Clock size={13} strokeWidth={2.4} color="#0284C7" />
                    <span>{displayTimeZone}</span>
                  </span>
                </div>

                {/* Synchronized City Selector inside Right Panel */}
                <div className="spotlight-cities-bar">
                  <span className="spotlight-cities-label">
                    {activeCity
                      ? `Locations in ${activeCountry.name}:`
                      : `Major cities in ${activeCountry.name}:`}
                  </span>
                  <div className="spotlight-cities-pills">
                    {activeCountry.cities.map((ct) => {
                      const isCtActive = activeCity?.id === ct.id
                      return (
                        <button
                          key={ct.id}
                          type="button"
                          className={`spotlight-city-pill ${isCtActive ? 'active' : ''}`}
                          onClick={() => handleSelectCity(activeCountry.id, ct.id)}
                        >
                          {ct.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <p className="spotlight-industries-meta">{displayIndustries}</p>
                <p className="spotlight-overview-note">{displayOverview}</p>

                <div className="spotlight-actions-group">
                  <button
                    type="button"
                    className="spotlight-explore-btn"
                    onClick={() => {
                      const targetLoc = activeCity ? activeCity.name : activeCountry.name
                      if (onNavigateCountry) {
                        onNavigateCountry(targetLoc)
                      } else {
                        nav.go('c_explore', {
                          location: targetLoc,
                          category:
                            (activeCity ? activeCity.defaultCategory : activeCountry.defaultCategory) ||
                            'Construction',
                        })
                      }
                    }}
                  >
                    Browse Categories in {activeCity ? activeCity.name : activeCountry.name}
                    <ArrowRight size={16} strokeWidth={2.4} />
                  </button>

                  {selectedLocation.isZoomed && (
                    <button
                      type="button"
                      className="spotlight-reset-btn"
                      onClick={handleResetGlobe}
                    >
                      Return to Global View
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
