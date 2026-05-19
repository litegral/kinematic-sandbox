# Solary Roadmap

## Next up for Level 3

### 1. Add Level 3 object fact cards
Show a fact card after a correct placement, similar to Level 1 planet facts.

Planned scope:
- Add fact data for each Level 3 object in `js/data.js`
- Reuse the existing fact modal in `js/ui.js`
- Support placeholder illustrations first, then final art later
- Trigger card reveal after correct drop in `js/levels/level3.js`

Suggested objects:
- Vesta
- Ceres
- Chiron
- Halley’s Comet
- Hale-Bopp
- Shoemaker-Levy 9
- Pluto
- Haumea
- Makemake

Potential data shape:
```js
objectFacts: {
  Pluto: {
    image: 'illustrations/level3/pluto-card.png',
    en: '...',
    id: '...'
  }
}
```

---

### 2. Localize Level 3 zone labels live (EN/ID)
Right now the gameplay text is localized, but the zone labels rendered inside the 3D world still use static labels from the level definitions.

Planned scope:
- Move displayed zone label text to i18n-driven values
- Refresh zone label sprites when language changes
- Keep internal keys stable:
  - `inner`
  - `asteroid`
  - `outer`
  - `kuiper`
  - `oort`

Likely files:
- `js/data.js`
- `js/game-world.js`
- `app.js`

---

### 3. Swap placeholder object art with final illustrations
Current Level 3 uses generated placeholder sprites, but the render path is already ready for real art.

Implementation later:
- Add final assets under something like:
  - `illustrations/level3/`
- Set `art.illustration` per object in `js/data.js`
- Tune sprite scale/position per object if needed

Example:
```js
{
  name: "Halley's Comet",
  zone: 'oort',
  art: {
    symbol: '☄️',
    illustration: 'illustrations/level3/halley.png',
    accent: '#e1f5fe'
  }
}
```

---

## Notes
- Keep Level 3 wording focused on “home region” rather than implying objects permanently stay in one exact band.
- If we add object fact cards, we should decide whether the final game win screen still shows the asteroid belt fact, or whether that fact should move into the Level 3 completion modal only.
