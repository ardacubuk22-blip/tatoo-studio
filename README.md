# TATTOO ARCHIVE

A visual tattoo **discovery and reference** gallery — not a studio site.
Image first, text second. Black / white / light grey, minimal typography,
generous whitespace, mobile-first.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

Stack: **React + Vite + JavaScript + plain CSS**. No UI framework.

## Structure

```
src/
  assets/               DROP PHOTOS HERE — see src/assets/README.md
    tattoos/<style>/    folder decides the style
    styles/<style>.jpg  optional hero per style
    artists/<id>/       optional portfolio per artist
  data/                 content model — edit these to add material
    assets.js           scans src/assets and resolves every photo
    styles.js           the 14 tattoo styles (slug, name, description)
    tattoos.js          the archive, built from assets (or placeholders)
    artists.js          artists, grouped by `mainStyle` slug
    filters.js          Subject / Body Part / Size taxonomy
    selectors.js        lookups that span styles + tattoos
  lib/
    search.js           keyword search over the archive
    placeholder.js      inline SVG stand-ins for missing photos
    findMyStyle.js      FIND MY STYLE — scaffolded, see below
  context/
    FavoritesContext.jsx   favourites, persisted to localStorage
  components/
    Navbar  TattooCard  TattooGrid  TattooModal  LazyImage
    StyleCard  FilterBar  ArtistCard  FavoriteButton  SearchBar
  pages/
    Home            FIND YOUR STYLE heading + interleaved masonry grid
    Styles          EXPLORE STYLES — large image cards
    StyleDetail     /styles/:slug — description + live filters + grid
    Artists         /artists?style=slug — grouped "<STYLE> ARTISTS"
    Favorites       MY FAVORITES — saved tattoos as a grid
    SearchResults   /search?q=... — image-forward results
```

## Adding photos

Drop files into `src/assets/tattoos/<style-slug>/` and they appear on the
site — no code changes, no data entry. The folder decides the style, so
camera filenames are fine:

```
src/assets/tattoos/black-and-grey/IMG_4821.jpg
src/assets/tattoos/japanese/DSC_0099.jpg
```

To make a photo filterable, tag it in the filename with `__`:

```
animal__forearm__medium__lion.jpg
```

Full rules, tag values and style slugs: **`src/assets/README.md`**.

Until real photos exist, the archive falls back to a demo set built on
inline SVG placeholders (`lib/placeholder.js`) — instant, offline, and
monochrome by design, so an empty archive still reads as intentional.

### Image loading

`LazyImage` always sets `width`/`height`. This is not cosmetic: in a
`column-count` masonry grid, images without intrinsic dimensions give the
columns zero height, which collapses the layout. The first 12 images load
eagerly; the rest use native lazy loading.

## Favourites

Heart button on any card or in the detail modal. Stored under
`tattoo-archive:favorites` in `localStorage`; no backend yet.

## Detail view

Clicking any tattoo opens `TattooModal` — big photo, minimal meta
(Style / Subject / Body Part / Size / Artist), and two actions:
`♡ Save` and `Find an Artist` (jumps to `/artists?style=<slug>`).

## FIND MY STYLE (future AI feature — scaffolded)

`src/lib/findMyStyle.js` already isolates the ranking step:

```js
analyseSelection(likedTattooIds) -> { ranking, topStyleSlug, label }
```

Current implementation is a transparent tally over style slugs. It can be
swapped for an embedding / model-based ranker without touching any UI, as
long as the return shape holds. Planned flow: show an image deck → user
picks favourites → `analyseSelection` → show `YOUR STYLE` + matching
tattoos and artists.

## Not done yet (intentional, next steps)

- Real photography (the pipeline is ready — just add files)
- Dedicated shareable `/tattoo/:id` route (currently modal-only)
- The FIND MY STYLE screen itself (the lib is ready)
- Backend for favourites / artist profiles / booking
