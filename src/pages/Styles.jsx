import { STYLES } from '../data/styles.js'
import StyleCard from '../components/StyleCard.jsx'

export default function Styles() {
  return (
    <main className="page">
      <header className="section-head">
        <p className="eyebrow">Explore styles</p>
      </header>

      <div className="style-grid">
        {STYLES.map((style, i) => (
          <StyleCard key={style.slug} style={style} eager={i < 8} />
        ))}
      </div>
    </main>
  )
}
