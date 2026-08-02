# Dhanvanth Kumar Gude — Research Portfolio

A static, dependency-free portfolio site. No build step, no framework, no trackers.
Open `index.html` in a browser and it runs.

---

## 1. Files

```
portfolio/
├─ index.html                      ← all page content lives here
├─ assets/
│  ├─ css/styles.css               ← theme tokens, layout, components
│  ├─ js/main.js                   ← theme switch, filters, DP console, animations
│  ├─ img/
│  │  ├─ profile-placeholder.svg   ← shown until you add your photo
│  │  └─ favicon.svg
│  └─ docs/
│     └─ CV_Dhanvanth_Kumar_Gude.pdf   ← replace whenever the CV updates
├─ README.md
└─ .gitignore
```

---

## 2. Add your photo

Save your portrait as:

```
assets/img/profile.jpg
```

That is the only step. The page loads `profile.jpg`; if it is missing it silently falls
back to the placeholder. Recommended: **portrait crop, roughly 800 × 1000 px, under 400 KB.**
A `.png` also works — just change the filename in `index.html` (search for `profile.jpg`).

---

## 3. Before you publish — fill these in

Everything below is marked in `index.html` with a `TODO` comment or an obvious placeholder.

| What | Where | Current value |
|---|---|---|
| Email address | `#contact` section, `mailto:` link | `your.email@example.com` |
| LinkedIn URL | `#contact` section | `linkedin.com/in/your-handle` |
| Google Scholar URL | `#contact` section | `YOUR_ID` |
| ORCID iD | `#contact` section | `0000-0000-0000-0000` |
| DOI links | Publication entries, `href="https://doi.org/"` | generic doi.org |

Search the file for `example.com`, `your-handle`, `YOUR_ID`, `0000-0000` and
`https://doi.org/"` to find them all quickly.

---

## 4. Editing content

Everything is plain HTML — no templating to learn.

**Add a publication:** copy an existing `<li class="pub reveal" data-type="...">` block and edit it.
Valid `data-type` values: `patent`, `journal`, `review`, `conference`, `chapter`.
Then update the count inside the matching filter button at the top of the section
(e.g. `<button ... data-filter="journal">Journal <span>2</span></button>`) and the `All` count.

**Change colours:** open `assets/css/styles.css` and edit the variables under
`html[data-theme="dark"]` and `html[data-theme="light"]`. Every colour on the page derives
from those two blocks, so a full re-skin is about ten lines.

**Change fonts:** the Google Fonts `<link>` in `index.html`, plus `--font-display`,
`--font-body` and `--font-mono` at the top of the stylesheet.

---

## 5. Run it locally

Double-clicking `index.html` works. For a proper local server (recommended, because
`fetch`-style behaviour and relative paths behave exactly as they will in production):

**VS Code:** install the *Live Server* extension → right-click `index.html` → **Open with Live Server**.

**Or with Python (already on most machines):**

```bash
cd portfolio
python -m http.server 5500
# then open http://localhost:5500
```

---

## 6. Put it online (free)

### Option A — GitHub Pages
```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
git push -u origin main
```
Then in the repo: **Settings → Pages → Source: `main` / root**.
Live at `https://<your-username>.github.io` within a minute or two.

### Option B — Netlify (fastest)
Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `portfolio` folder
onto the page. Done — you get a URL immediately, and you can attach a custom domain later.

### Option C — Vercel
`npm i -g vercel`, then run `vercel` inside the folder and accept the defaults.

---

## 7. Accessibility & performance notes

- Dark and light themes both meet WCAG AA contrast for body text.
- The theme choice is stored in `localStorage` and respects `prefers-color-scheme` on first visit.
- `prefers-reduced-motion` is honoured: the hero animation, the scramble headline and all
  scroll reveals switch off for visitors who have that setting on.
- Keyboard navigation works throughout, with a visible focus ring and a skip-to-content link.
- Total page weight is well under 200 KB excluding your photo and CV.
- The site prints cleanly (Ctrl/Cmd + P) if anyone wants a paper copy.

---

## 8. Optional: background video

The hero uses an animated canvas lattice rather than a video file — it is a fraction of the
weight, adapts to both themes, and never blocks page load. If you would still prefer a video,
drop an MP4 at `assets/img/hero.mp4` and replace `<canvas class="lattice" id="lattice">` with:

```html
<video class="lattice" autoplay muted loop playsinline poster="assets/img/hero-poster.jpg">
  <source src="assets/img/hero.mp4" type="video/mp4">
</video>
```

Use footage you own or that is explicitly licensed for reuse.
