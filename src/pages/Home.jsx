import { useMemo } from 'react'
import { TATTOOS } from '../data/tattoos.js'
import TattooGrid from '../components/TattooGrid.jsx'

/* deterministic shuffle so the grid feels curated, not sorted by style */
function interleave(list) {
  const byStyle = new Map()
  for (const t of list) {
    if (!byStyle.has(t.style)) byStyle.set(t.style, [])
    byStyle.get(t.style).push(t)
  }
  const buckets = [...byStyle.values()]
  const out = []
  let added = true
  let i = 0
  while (added) {
    added = false
    for (const b of buckets) {
      if (b[i]) {
        out.push(b[i])
        added = true
      }
    }
    i += 1
  }
  return out
}

export default function Home() {
  const tattoos = useMemo(() => interleave(TATTOOS), [])

  return (
    <main className="page">
      <header className="section-head">
        <p className="eyebrow">Find your style</p>
        <p className="lede">
          Dövme stillerini görseller üzerinden keşfet. İlham veren tasarımları
          kaydet ve tarzına uygun sanatçıyı bul.
        </p>
      </header>

      <TattooGrid tattoos={tattoos} />
    </main>
  )
}
