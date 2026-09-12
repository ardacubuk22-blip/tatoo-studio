# Photos

Drop image files in here and they show up on the site automatically.
No code changes, no imports, no data entry.

Accepted: `.jpg` `.jpeg` `.png` `.webp` `.avif`

## Tattoos

```
src/assets/tattoos/<style-slug>/<anything>.jpg
```

The **folder decides the style**, so straight-off-the-camera filenames
are fine:

```
src/assets/tattoos/black-and-grey/IMG_4821.jpg
src/assets/tattoos/japanese/DSC_0099.jpg
```

### Optional tagging

To make a photo filterable, name it with `__` between tags:

```
animal__forearm__medium__lion.jpg
portrait__chest__large.jpg
flower__hand__small__peony.jpg
```

Tags can appear in any order. Anything the parser doesn't recognise
becomes the search keyword ("lion", "peony"). Untagged photos still
appear in the gallery — they just won't match a Subject / Body Part /
Size filter until renamed.

Valid tag values:

| Subject | Body Part | Size |
|---|---|---|
| Portrait | Arm | Small |
| Animal | Forearm | Medium |
| Flower | Hand | Large |
| Skull | Chest | Sleeve |
| Nature | Back | |
| Abstract | Leg | |

## Style hero images

```
src/assets/styles/<style-slug>.jpg
```

Optional. Without one, the Styles page uses the first tattoo photo
filed under that style.

## Artist portfolios

```
src/assets/artists/<artist-id>/<anything>.jpg
```

Ids are in `src/data/artists.js` (`a-001`, `a-002`, …).

## Style slugs

`black-and-grey` · `realism` · `fine-line` · `blackwork` · `minimal` ·
`traditional` · `neo-traditional` · `japanese` · `ornamental` ·
`geometric` · `dotwork` · `lettering` · `abstract` · `trash-polka`
