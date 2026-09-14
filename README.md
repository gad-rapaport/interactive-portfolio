# Gadi Rapaport — Interactive Portfolio 3.0

A complete rebuild of the original interactive portfolio, focused on presenting real product-building capability rather than only DevOps-themed effects.

## What changed

- New positioning: Software Developer / Product Builder
- Android, Python, automation, APIs, AI and DevOps are represented together
- Project case studies instead of a flat project list
- Live GitHub profile stats
- Interactive developer terminal
- Command palette (`Ctrl/Cmd + K`)
- Three.js particle background
- Responsive mobile-first layout
- Reduced-motion accessibility support
- Data-driven project and capability files
- No build step required

## Structure

```text
.
├── index.html
├── css/
│   └── main.css
├── js/
│   └── app.js
├── data/
│   ├── profile.json
│   ├── capabilities.json
│   └── projects.json
└── README.md
```

## Run locally

Because the site loads JSON using `fetch`, run it through a local web server rather than opening `index.html` directly.

### Python
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

### VS Code
Use Live Server.

## Deploy

Works directly on GitHub Pages, Netlify, Vercel static hosting, Cloudflare Pages or any regular static web server.

## Customize

- Projects: `data/projects.json`
- Skills/capabilities: `data/capabilities.json`
- Contact links: `index.html` and `data/profile.json`
- Main styling: `css/main.css`
- Terminal and interactions: `js/app.js`

## Suggested replacement workflow

1. Back up the old repository.
2. Remove old `index.html`, `commands.json` and obsolete assets.
3. Copy this project into the repository root.
4. Test locally.
5. Commit and push.

```bash
git add .
git commit -m "Rebuild portfolio as v3"
git push
```
