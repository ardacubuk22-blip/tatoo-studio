/* ------------------------------------------------------------
   Inline SVG placeholders.

   Used wherever a real photo has not been added yet. They are
   data URIs, so they render instantly, work offline, and never
   leave a blank grid while the archive is being filled in.
   ------------------------------------------------------------ */

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/**
 * Deterministic monochrome placeholder.
 * @param {string} seed  any stable string (id, slug, filename)
 * @param {number} w
 * @param {number} h
 */
export function placeholder(seed = '', w = 900, h = 1200) {
  const n = hash(String(seed))
  const top = 14 + (n % 9)
  const bottom = 24 + ((n >> 4) % 12)
  const line = bottom + 13
  const r = Math.round(Math.min(w, h) * 0.16)

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0.7" y2="1">` +
    `<stop offset="0" stop-color="rgb(${top},${top},${top})"/>` +
    `<stop offset="1" stop-color="rgb(${bottom},${bottom},${bottom})"/>` +
    `</linearGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
    `<circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="none" ` +
    `stroke="rgb(${line},${line},${line})" stroke-width="1.25"/>` +
    `</svg>`

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
