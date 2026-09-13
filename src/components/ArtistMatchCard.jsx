import { Link } from 'react-router-dom'
import { styleName } from '../data/styles.js'
import LazyImage from './LazyImage.jsx'
import InstagramLink from './InstagramLink.jsx'
import './ArtistMatchCard.css'

const ANSWER_LABELS = {
  bodyPart: {
    neck: 'Boyun',
    shoulder: 'Omuz',
    chest: 'Göğüs',
    back: 'Sırt',
    ribs: 'Kaburga',
    arm: 'Kol',
    hand: 'El',
    leg: 'Bacak',
    ankle: 'Ayak bileği',
  },
  size: {
    'xs': 'Çok küçük (5 cm altı)',
    s: 'Küçük (5–10 cm)',
    m: 'Orta (10–20 cm)',
    l: 'Büyük (20 cm üstü)',
    full: 'Tam bölge kaplama',
  },
  colorPref: { color: 'Renkli', bw: 'Siyah-gri', any: 'Fark etmez' },
  firstTattoo: { yes: 'Evet', no: 'Hayır' },
}

function priceLabel(artist) {
  if (!artist.priceRange) return null
  const { min, max } = artist.priceRange
  const range = `${min.toLocaleString('tr-TR')}₺ – ${max.toLocaleString('tr-TR')}₺`
  return artist.priceNote ? `${range} (${artist.priceNote})` : range
}

function buildWhatsAppMessage(artist, answers) {
  const lines = [`Merhaba, ${artist.name} ile randevu almak istiyorum.`, '']
  if (answers.styles?.length) {
    lines.push(`İlgilendiğim stiller: ${answers.styles.map(styleName).join(', ')}`)
  }
  if (answers.bodyPart) lines.push(`Vücut bölgesi: ${ANSWER_LABELS.bodyPart[answers.bodyPart] || answers.bodyPart}`)
  if (answers.size) lines.push(`Boyut: ${ANSWER_LABELS.size[answers.size] || answers.size}`)
  if (answers.colorPref) lines.push(`Renk tercihi: ${ANSWER_LABELS.colorPref[answers.colorPref] || answers.colorPref}`)
  if (answers.firstTattoo) lines.push(`İlk dövmem mi: ${ANSWER_LABELS.firstTattoo[answers.firstTattoo] || answers.firstTattoo}`)
  return lines.join('\n')
}

/**
 * props:
 *   artist   record from artists.js
 *   reasons  string[] — "neden eşleşti" bullets
 *   answers  the quiz answers, forwarded into the WhatsApp message
 */
export default function ArtistMatchCard({ artist, reasons, answers }) {
  const price = priceLabel(artist)
  const waHref = `https://wa.me/905359862655?text=${encodeURIComponent(
    buildWhatsAppMessage(artist, answers),
  )}`

  return (
    <article className="match-card">
      <div className="match-card__portfolio">
        {artist.portfolio.slice(0, 4).map((item, i) => (
          <LazyImage
            key={i}
            src={item.url}
            kind={item.kind}
            alt={`${artist.name} portfolyo ${i + 1}`}
            width={800}
            height={1000}
          />
        ))}
      </div>

      <div className="match-card__body">
        <div className="match-card__head">
          <span className="match-card__name">{artist.name}</span>
          <span className="match-card__badge">{styleName(artist.mainStyle)}</span>
        </div>

        <p className="match-card__meta">
          {artist.city}
          {price && <> &middot; {price}</>}
        </p>

        <InstagramLink handle={artist.instagram} />

        {reasons.length > 0 && (
          <p className="match-card__reason">
            <span aria-hidden="true">&rarr;</span> {reasons.join(', ')}
          </p>
        )}

        <div className="match-card__actions">
          <Link className="btn" to={`/artists?style=${artist.mainStyle}`}>
            Profili Gör
          </Link>
          <a
            className="btn btn--solid"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Randevu Talep Et
          </a>
        </div>
      </div>
    </article>
  )
}
