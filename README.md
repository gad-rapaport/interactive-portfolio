# Gadi Rapaport — Interactive Portfolio 3.1

A product-style interactive developer portfolio focused on Android, Python, automation, APIs, AI integration and DevOps.

## Highlights

- Three.js realtime background
- GSAP transitions
- Project case studies with visual previews
- Live GitHub stats and repository feed
- Local portfolio assistant with no API key
- Interactive terminal
- Cmd/Ctrl + K command palette
- Responsive mobile layout
- Reduced-motion accessibility support

## Run locally

Because the site loads JSON using `fetch()`, do not open `index.html` directly with `file://`.

From the project folder, run one of these:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also use VS Code Live Server.

## Deploy

The project is static and works well with GitHub Pages, Netlify or Vercel.

For GitHub Pages, keep `index.html` in the repository root and deploy the `main` branch/root folder.
