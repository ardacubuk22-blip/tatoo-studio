import { useState } from 'react'
import './BodyMap.css'

/**
 * Simplified clickable body diagram — front/back toggle, no
 * anatomical precision needed, regions just have to be tellable
 * apart. Not used for scoring; the picked region is only carried
 * into the appointment request message.
 *
 * props:
 *   value     selected region key, or null
 *   onChange  (regionKey) => void
 */

const FRONT_REGIONS = [
  { key: 'neck', label: 'Boyun', d: 'M92,40 h16 v14 h-16 z' },
  { key: 'shoulder', label: 'Omuz', d: 'M58,54 a14,14 0 0 1 14,-8 h56 a14,14 0 0 1 14,8 v10 h-84 z' },
  { key: 'chest', label: 'Göğüs', d: 'M76,64 h48 v34 h-48 z' },
  { key: 'ribs', label: 'Kaburga', d: 'M62,64 h14 v50 h-14 z M124,64 h14 v50 h-14 z' },
  { key: 'arm', label: 'Kol (üst/ön kol)', d: 'M46,64 h16 v90 h-16 z M138,64 h16 v90 h-16 z' },
  { key: 'hand', label: 'El', d: 'M46,154 a8,10 0 1 0 16,0 z M138,154 a8,10 0 1 0 16,0 z' },
  { key: 'leg', label: 'Bacak', d: 'M76,98 h20 v130 h-20 z M104,98 h20 v130 h-20 z' },
  { key: 'ankle', label: 'Ayak Bileği', d: 'M76,228 h20 v14 h-20 z M104,228 h20 v14 h-20 z' },
]

const BACK_REGIONS = [
  { key: 'neck', label: 'Boyun', d: 'M92,40 h16 v14 h-16 z' },
  { key: 'shoulder', label: 'Omuz', d: 'M58,54 a14,14 0 0 1 14,-8 h56 a14,14 0 0 1 14,8 v10 h-84 z' },
  { key: 'back', label: 'Sırt', d: 'M62,64 h76 v50 h-76 z' },
  { key: 'arm', label: 'Kol (üst/ön kol)', d: 'M46,64 h16 v90 h-16 z M138,64 h16 v90 h-16 z' },
  { key: 'hand', label: 'El', d: 'M46,154 a8,10 0 1 0 16,0 z M138,154 a8,10 0 1 0 16,0 z' },
  { key: 'leg', label: 'Bacak', d: 'M76,98 h20 v130 h-20 z M104,98 h20 v130 h-20 z' },
  { key: 'ankle', label: 'Ayak Bileği', d: 'M76,228 h20 v14 h-20 z M104,228 h20 v14 h-20 z' },
]

export default function BodyMap({ value, onChange }) {
  const [view, setView] = useState('front')
  const regions = view === 'front' ? FRONT_REGIONS : BACK_REGIONS

  return (
    <div className="body-map">
      <div className="body-map__toggle">
        <button
          type="button"
          className={'body-map__toggle-btn' + (view === 'front' ? ' is-on' : '')}
          onClick={() => setView('front')}
        >
          Ön
        </button>
        <button
          type="button"
          className={'body-map__toggle-btn' + (view === 'back' ? ' is-on' : '')}
          onClick={() => setView('back')}
        >
          Arka
        </button>
      </div>

      <svg
        className="body-map__figure"
        viewBox="0 0 184 260"
        role="group"
        aria-label={`Vücut şeması (${view === 'front' ? 'ön' : 'arka'} görünüm)`}
      >
        {/* silhouette */}
        <g className="body-map__silhouette" aria-hidden="true">
          <circle cx="100" cy="24" r="18" />
          <rect x="92" y="40" width="16" height="18" rx="4" />
          <path d="M58,54 a14,14 0 0 1 14,-8 h56 a14,14 0 0 1 14,8 v70 h-84 z" />
          <rect x="46" y="64" width="16" height="90" rx="8" />
          <rect x="138" y="64" width="16" height="90" rx="8" />
          <circle cx="54" cy="158" r="9" />
          <circle cx="146" cy="158" r="9" />
          <rect x="76" y="122" width="20" height="120" rx="8" />
          <rect x="104" y="122" width="20" height="120" rx="8" />
        </g>

        {/* clickable regions */}
        {regions.map((r) => (
          <path
            key={r.key}
            d={r.d}
            className={'body-map__region' + (value === r.key ? ' is-selected' : '')}
            role="button"
            tabIndex={0}
            aria-pressed={value === r.key}
            aria-label={r.label}
            onClick={() => onChange(value === r.key ? null : r.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onChange(value === r.key ? null : r.key)
              }
            }}
          >
            <title>{r.label}</title>
          </path>
        ))}
      </svg>

      <p className="body-map__value">
        {value ? [...FRONT_REGIONS, ...BACK_REGIONS].find((r) => r.key === value)?.label : 'Bir bölge seç'}
      </p>
    </div>
  )
}
