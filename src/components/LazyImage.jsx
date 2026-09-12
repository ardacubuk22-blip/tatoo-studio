import { useState } from 'react'
import './LazyImage.css'

/**
 * Gallery image.
 *
 * Two things matter here:
 *   1. width/height are always set, so the box is reserved before
 *      the photo arrives. Without them the masonry columns collapse
 *      to zero height and the layout jumps on every load.
 *   2. Images below the first screenful defer via native lazy
 *      loading; the first screenful loads eagerly so the page is
 *      never empty on arrival.
 *
 * props:
 *   src, alt, width, height, className
 *   eager  load immediately (use for the first screenful)
 */
export default function LazyImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  eager = false,
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      className={`lazy-img ${className}${loaded ? ' is-loaded' : ''}`}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
    />
  )
}
