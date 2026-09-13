import { useEffect, useMemo, useRef } from 'react'
import { useMatchQuiz } from '../context/MatchQuizContext.jsx'
import { ARTISTS } from '../data/artists.js'
import { STYLES, styleName } from '../data/styles.js'
import { styleCoverImage } from '../data/selectors.js'
import { BUDGET_BRACKETS, matchArtists, matchReasons } from '../lib/matching.js'
import BodyMap from './BodyMap.jsx'
import ArtistMatchCard from './ArtistMatchCard.jsx'
import LazyImage from './LazyImage.jsx'
import './MatchQuizModal.css'

const TOTAL_QUESTIONS = 7

const SIZE_OPTIONS = [
  { value: 'xs', label: 'Çok küçük', hint: '5 cm altı', d: 5 },
  { value: 's', label: 'Küçük', hint: '5–10 cm', d: 9 },
  { value: 'm', label: 'Orta', hint: '10–20 cm', d: 14 },
  { value: 'l', label: 'Büyük', hint: '20 cm üstü', d: 20 },
  { value: 'full', label: 'Tam bölge', hint: 'kaplama', d: 26 },
]

function useFocusTrap(active, containerRef) {
  useEffect(() => {
    if (!active) return undefined
    const container = containerRef.current
    if (!container) return undefined

    const focusables = () =>
      [...container.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.disabled,
      )

    const first = focusables()[0]
    first?.focus()

    function onKeyDown(e) {
      if (e.key !== 'Tab') return
      const els = focusables()
      if (els.length === 0) return
      const firstEl = els[0]
      const lastEl = els[els.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => container.removeEventListener('keydown', onKeyDown)
  }, [active, containerRef])
}

export default function MatchQuizModal() {
  const { isOpen, close, answers, step, setAnswer, setStep, reset } = useMatchQuiz()
  const containerRef = useRef(null)

  useFocusTrap(isOpen, containerRef)

  useEffect(() => {
    if (!isOpen) return undefined
    function onKey(e) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  const cities = useMemo(
    () => [...new Set(ARTISTS.map((a) => a.city).filter(Boolean))].sort(),
    [],
  )

  const ranked = useMemo(() => {
    if (step < TOTAL_QUESTIONS) return []
    return matchArtists(ARTISTS, answers)
  }, [step, answers])

  const hasAnyScoredAnswer = answers.styles.length > 0 || Boolean(answers.city) || Boolean(answers.budget)

  const results = useMemo(() => {
    if (!hasAnyScoredAnswer) {
      // nothing scored — surface the most complete profiles instead
      return [...ranked].sort((a, b) => b.artist.portfolio.length - a.artist.portfolio.length)
    }
    return ranked
  }, [ranked, hasAnyScoredAnswer])

  const topScore = results[0]?.score.total ?? 0
  const weakMatches = hasAnyScoredAnswer && topScore < 0.55

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_QUESTIONS))
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function toggleStyle(slug) {
    const current = answers.styles
    const nextStyles = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]
    setAnswer('styles', nextStyles)
  }

  function pickAndNext(key, value) {
    setAnswer(key, value)
    next()
  }

  if (!isOpen) return null

  return (
    <div className="quiz-modal" role="dialog" aria-modal="true" aria-label="Sana uygun sanatçıyı bul" onClick={close}>
      <div className="quiz-modal__body" ref={containerRef} onClick={(e) => e.stopPropagation()}>
        <button className="quiz-modal__close" onClick={close} aria-label="Kapat">
          &times;
        </button>

        {step < TOTAL_QUESTIONS ? (
          <>
            <div className="quiz-modal__progress">
              <div className="quiz-modal__progress-bar">
                <div
                  className="quiz-modal__progress-fill"
                  style={{ width: `${((step + 1) / TOTAL_QUESTIONS) * 100}%` }}
                />
              </div>
              <span>{step + 1}/{TOTAL_QUESTIONS}</span>
            </div>

            {step === 0 && (
              <section className="quiz-step">
                <h2 className="quiz-step__title">Hangi tarzı düşünüyorsun?</h2>
                <p className="quiz-step__hint">Birden fazla seçebilirsin.</p>
                <div className="quiz-style-grid">
                  {STYLES.map((s) => {
                    const on = answers.styles.includes(s.slug)
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        className={'quiz-style-card' + (on ? ' is-on' : '')}
                        onClick={() => toggleStyle(s.slug)}
                        aria-pressed={on}
                      >
                        <LazyImage src={styleCoverImage(s)} alt={s.name} width={300} height={375} />
                        <span>{s.name}</span>
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  className="quiz-modal__undecided"
                  onClick={() => pickAndNext('styles', [])}
                >
                  Kararsızım / Bana öner
                </button>
              </section>
            )}

            {step === 1 && (
              <section className="quiz-step">
                <h2 className="quiz-step__title">Vücudunun neresine?</h2>
                <BodyMap value={answers.bodyPart} onChange={(v) => setAnswer('bodyPart', v)} />
              </section>
            )}

            {step === 2 && (
              <section className="quiz-step">
                <h2 className="quiz-step__title">Yaklaşık boyut?</h2>
                <div className="quiz-size-row">
                  {SIZE_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={'quiz-size-card' + (answers.size === o.value ? ' is-on' : '')}
                      onClick={() => setAnswer('size', o.value)}
                    >
                      <span className="quiz-size-card__dot" style={{ width: o.d, height: o.d }} />
                      <span>{o.label}</span>
                      <em>{o.hint}</em>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="quiz-step">
                <h2 className="quiz-step__title">Renkli mi, siyah-gri mi?</h2>
                <p className="quiz-step__hint">
                  Bu tercih eşleştirmeyi etkilemez, sadece randevu talebinde sanatçıya iletilir.
                </p>
                <div className="quiz-choice-row">
                  {[
                    { value: 'color', label: 'Renkli' },
                    { value: 'bw', label: 'Siyah-gri' },
                    { value: 'any', label: 'Fark etmez' },
                  ].map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={'chip' + (answers.colorPref === o.value ? ' is-on' : '')}
                      onClick={() => setAnswer('colorPref', o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="quiz-step">
                <h2 className="quiz-step__title">İlk dövmen mi?</h2>
                <div className="quiz-choice-row">
                  {[
                    { value: 'yes', label: 'Evet' },
                    { value: 'no', label: 'Hayır' },
                  ].map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={'chip' + (answers.firstTattoo === o.value ? ' is-on' : '')}
                      onClick={() => setAnswer('firstTattoo', o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 5 && (
              <section className="quiz-step">
                <h2 className="quiz-step__title">Bütçe aralığın?</h2>
                <div className="quiz-choice-row quiz-choice-row--wrap">
                  {BUDGET_BRACKETS.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      className={'chip' + (answers.budget === b.value ? ' is-on' : '')}
                      onClick={() => setAnswer('budget', b.value)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="quiz-modal__undecided"
                  onClick={() => setAnswer('budget', null)}
                >
                  Belirtmek istemiyorum
                </button>
              </section>
            )}

            {step === 6 && (
              <section className="quiz-step">
                <h2 className="quiz-step__title">Nerede arıyorsun?</h2>
                <div className="quiz-choice-row quiz-choice-row--wrap">
                  {cities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={'chip' + (answers.city === c ? ' is-on' : '')}
                      onClick={() => setAnswer('city', c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <button type="button" className="quiz-modal__undecided" onClick={() => setAnswer('city', null)}>
                  Farketmez
                </button>
              </section>
            )}

            <div className="quiz-modal__nav">
              <button type="button" className="btn" onClick={back} disabled={step === 0}>
                Geri
              </button>
              <button type="button" className="btn" onClick={next}>
                Atla
              </button>
              <button type="button" className="btn btn--solid" onClick={next}>
                Devam
              </button>
            </div>
          </>
        ) : (
          <section className="quiz-results">
            <div className="quiz-results__head">
              <div>
                <p className="eyebrow">{weakMatches ? 'Tam eşleşme az, benzer sanatçılar' : 'Sana uygun sanatçılar'}</p>
                <h2 className="quiz-step__title">
                  {hasAnyScoredAnswer ? 'Eşleşme Sonuçların' : 'Öne Çıkan Sanatçılar'}
                </h2>
              </div>
              <div className="quiz-results__head-actions">
                <button type="button" className="btn" onClick={() => setStep(0)}>
                  Cevapları Düzenle
                </button>
                <button type="button" className="btn" onClick={reset}>
                  Baştan Başla
                </button>
              </div>
            </div>

            {answers.firstTattoo === 'yes' && (
              <div className="quiz-results__info">
                <strong>İlk dövmen mi?</strong> Genelde hafif bir batma/yanma hissi olur, bölgeye göre
                değişir. İyileşme 2–3 hafta sürer; bu süre boyunca doğrudan güneşten ve denizden
                kaçınman gerekir. İlk seansta sanatçın tasarımı seninle netleştirir, sonra dövmeye başlar.
              </div>
            )}

            <div className="quiz-results__grid">
              {results.map(({ artist, score }) => (
                <ArtistMatchCard
                  key={artist.id}
                  artist={artist}
                  answers={answers}
                  reasons={hasAnyScoredAnswer ? matchReasons(artist, answers, score) : []}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
