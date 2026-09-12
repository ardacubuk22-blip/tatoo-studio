import { useState } from 'react'
import { STYLES, STYLE_SLUGS, styleName } from '../data/styles.js'
import { ARTISTS } from '../data/artists.js'
import { FILTER_GROUPS } from '../data/filters.js'
import {
  isSupported,
  pickProjectRoot,
  writeAssetFile,
  writeDataJson,
} from '../lib/localFs.js'
import './Admin.css'

const SUBJECTS = FILTER_GROUPS.find((g) => g.key === 'subject').options
const BODY_PARTS = FILTER_GROUPS.find((g) => g.key === 'bodyPart').options
const SIZES = FILTER_GROUPS.find((g) => g.key === 'size').options

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '-')
}

function extOf(filename) {
  const m = filename.match(/\.[^.]+$/)
  return m ? m[0] : ''
}

/* ---------- upload ---------- */

function UploadPanel({ root }) {
  const [target, setTarget] = useState('tattoo') // tattoo | hero | artist
  const [styleSlug, setStyleSlug] = useState(STYLE_SLUGS[0])
  const [artistId, setArtistId] = useState(ARTISTS[0]?.id || '')
  const [subject, setSubject] = useState('')
  const [bodyPart, setBodyPart] = useState('')
  const [size, setSize] = useState('')
  const [motif, setMotif] = useState('')
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState(null) // { type: 'ok'|'error', text }
  const [busy, setBusy] = useState(false)

  function buildFilename(originalName) {
    const ext = extOf(originalName) || '.jpg'
    if (target === 'hero') return `${styleSlug}${ext}`
    const tags = [subject, bodyPart, size, motif].map((t) => t.trim()).filter(Boolean)
    if (tags.length === 0) return sanitizeName(originalName)
    return sanitizeName(tags.join('__')) + ext
  }

  async function upload() {
    if (!root || files.length === 0) return
    setBusy(true)
    setStatus(null)
    try {
      for (const file of files) {
        const filename = buildFilename(file.name)
        if (target === 'tattoo') {
          await writeAssetFile(root, ['tattoos', styleSlug], filename, file)
        } else if (target === 'hero') {
          await writeAssetFile(root, ['styles'], filename, file)
        } else {
          await writeAssetFile(root, ['artists', artistId], filename, file)
        }
      }
      setStatus({
        type: 'ok',
        text: `${files.length} dosya yüklendi. Site birkaç saniye içinde otomatik güncellenir.`,
      })
      setFiles([])
      setMotif('')
    } catch (err) {
      setStatus({ type: 'error', text: `Yükleme başarısız: ${err.message}` })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel__title">Resim / Video Yükle</h2>

      <div className="admin-field">
        <span className="admin-field__label">Nereye?</span>
        <div className="admin-radio-row">
          <label>
            <input
              type="radio"
              checked={target === 'tattoo'}
              onChange={() => setTarget('tattoo')}
            />
            Dövme fotoğrafı (galeri)
          </label>
          <label>
            <input
              type="radio"
              checked={target === 'hero'}
              onChange={() => setTarget('hero')}
            />
            Stil kapak görseli
          </label>
          <label>
            <input
              type="radio"
              checked={target === 'artist'}
              onChange={() => setTarget('artist')}
            />
            Sanatçı portfolyosu
          </label>
        </div>
      </div>

      {(target === 'tattoo' || target === 'hero') && (
        <div className="admin-field">
          <span className="admin-field__label">Stil</span>
          <select value={styleSlug} onChange={(e) => setStyleSlug(e.target.value)}>
            {STYLES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {target === 'artist' && (
        <div className="admin-field">
          <span className="admin-field__label">Sanatçı</span>
          <select value={artistId} onChange={(e) => setArtistId(e.target.value)}>
            {ARTISTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.city}
              </option>
            ))}
          </select>
        </div>
      )}

      {target === 'tattoo' && (
        <div className="admin-field admin-field--tags">
          <span className="admin-field__label">
            Etiketler (opsiyonel — filtrelemede kullanılır)
          </span>
          <div className="admin-tag-row">
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Konu —</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select value={bodyPart} onChange={(e) => setBodyPart(e.target.value)}>
              <option value="">Vücut bölgesi —</option>
              {BODY_PARTS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">Boyut —</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="motif (örn: lion)"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="admin-field">
        <span className="admin-field__label">Dosyalar</span>
        <input
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm,video/quicktime"
          onChange={(e) => setFiles([...e.target.files])}
        />
        {files.length > 0 && (
          <ul className="admin-file-list">
            {files.map((f) => (
              <li key={f.name}>{f.name}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="btn btn--solid"
        disabled={!root || files.length === 0 || busy}
        onClick={upload}
      >
        {busy ? 'Yükleniyor…' : 'Yükle'}
      </button>

      {status && (
        <p className={`admin-msg admin-msg--${status.type}`}>{status.text}</p>
      )}
    </div>
  )
}

/* ---------- text editor ---------- */

function TextsPanel({ root }) {
  const [styles, setStyles] = useState(
    STYLES.map((s) => ({ slug: s.slug, name: s.name, description: s.description })),
  )
  const [artists, setArtists] = useState(
    ARTISTS.map((a) => ({
      id: a.id,
      name: a.name,
      city: a.city,
      mainStyle: a.mainStyle,
      instagram: a.instagram || '',
    })),
  )
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  function updateStyle(slug, field, value) {
    setStyles((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, [field]: value } : s)),
    )
  }

  function updateArtist(id, field, value) {
    setArtists((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  async function saveAll() {
    if (!root) return
    setBusy(true)
    setStatus(null)
    try {
      await writeDataJson(root, 'styles', { styles })
      await writeDataJson(root, 'artists', { artists })
      setStatus({ type: 'ok', text: 'Yazılar kaydedildi.' })
    } catch (err) {
      setStatus({ type: 'error', text: `Kaydedilemedi: ${err.message}` })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel__title">Yazıları Düzenle</h2>

      <h3 className="admin-panel__subtitle">Stil açıklamaları</h3>
      {styles.map((s) => (
        <div key={s.slug} className="admin-field">
          <span className="admin-field__label">{s.name}</span>
          <textarea
            rows={2}
            value={s.description}
            onChange={(e) => updateStyle(s.slug, 'description', e.target.value)}
          />
        </div>
      ))}

      <h3 className="admin-panel__subtitle">Sanatçılar</h3>
      {artists.map((a) => (
        <div key={a.id} className="admin-artist-row">
          <input
            type="text"
            value={a.name}
            onChange={(e) => updateArtist(a.id, 'name', e.target.value)}
            placeholder="İsim"
          />
          <input
            type="text"
            value={a.city}
            onChange={(e) => updateArtist(a.id, 'city', e.target.value)}
            placeholder="Şehir"
          />
          <select
            value={a.mainStyle}
            onChange={(e) => updateArtist(a.id, 'mainStyle', e.target.value)}
          >
            {STYLE_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {styleName(slug)}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={a.instagram}
            onChange={(e) => updateArtist(a.id, 'instagram', e.target.value)}
            placeholder="Instagram (opsiyonel)"
          />
        </div>
      ))}

      <button
        type="button"
        className="btn btn--solid"
        disabled={!root || busy}
        onClick={saveAll}
      >
        {busy ? 'Kaydediliyor…' : 'Kaydet'}
      </button>

      {status && (
        <p className={`admin-msg admin-msg--${status.type}`}>{status.text}</p>
      )}
    </div>
  )
}

/* ---------- root ---------- */

function AdminHome() {
  const [root, setRoot] = useState(null)
  const [tab, setTab] = useState('upload')
  const [error, setError] = useState('')

  async function connect() {
    setError('')
    try {
      const handle = await pickProjectRoot()
      setRoot(handle)
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    }
  }

  if (!isSupported()) {
    return (
      <main className="page">
        <header className="section-head">
          <p className="eyebrow">Admin</p>
          <h1 className="display">Desteklenmiyor</h1>
          <p className="lede">
            Bu araç dosyaları doğrudan bilgisayarına yazmak için Chrome/Edge'in
            dosya sistemi özelliğini kullanıyor. Lütfen masaüstü Chrome veya Edge
            ile aç.
          </p>
        </header>
      </main>
    )
  }

  return (
    <main className="page">
      <header className="section-head">
        <p className="eyebrow">Admin</p>
        <h1 className="display">İçerik Yönetimi</h1>
        <p className="lede">
          Fotoğraf, video ve yazı ekle — kaydettiğinde doğrudan proje klasörüne
          yazılır, site birkaç saniye içinde kendini günceller.
        </p>
      </header>

      {!root ? (
        <div className="admin-panel">
          <p className="admin-field__label">
            Önce proje ana klasörünü seç (içinde <code>package.json</code> ve{' '}
            <code>src</code> olan klasör).
          </p>
          <button type="button" className="btn btn--solid" onClick={connect}>
            Proje klasörünü seç
          </button>
          {error && <p className="admin-msg admin-msg--error">{error}</p>}
        </div>
      ) : (
        <>
          <div className="admin-tabs">
            <button
              type="button"
              className={'admin-tab' + (tab === 'upload' ? ' is-on' : '')}
              onClick={() => setTab('upload')}
            >
              Yükle
            </button>
            <button
              type="button"
              className={'admin-tab' + (tab === 'texts' ? ' is-on' : '')}
              onClick={() => setTab('texts')}
            >
              Yazılar
            </button>
          </div>

          {tab === 'upload' ? <UploadPanel root={root} /> : <TextsPanel root={root} />}
        </>
      )}
    </main>
  )
}

export default function AdminPage() {
  return <AdminHome />
}
