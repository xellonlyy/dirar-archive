# Dirar — Editing Resources Archive

Website arsip dari **satvrn.li (Dirar)** — hub resource untuk editor video/AMV, meliputi software Adobe, plugin After Effects, extensions, scripts, dan panduan instalasi.

## Stack

- [VitePress](https://vitepress.dev/) v1.6.4 — static site generator
- Dark mode (force-dark)
- Local search

## Development

```bash
npm install
npm run dev      # localhost:5173
npm run build    # production build → .vitepress/dist
npm run preview  # preview production build
```

## Struktur Halaman

| Halaman | Deskripsi |
|---------|-----------|
| `index.md` | Home page |
| `windows.md` | Software & plugin Windows |
| `mac.md` | Software & plugin MacOS |
| `extensions.md` | Extensions & Scripts AE |
| `archived.md` | Versi lama software |
| `faq.md` | FAQ Windows & Mac |
| `beginnersguide.md` | Panduan AE untuk pemula |
| `tutorials.md` | Video tutorial instalasi |
| `changelog.md` | Update history |
| `gcc.md` | Adobe Ungenuine Fix |
| `genp.md` | GenP activation guide |
| `macked.md` | MacKed activation guide |
| `maxon.md` | Maxon/Red Giant fixes |
| `rosetta.md` | Rosetta M1+ guide |
| `ae-paths.md` | AE installation paths |
| `versionswapguide.md` | Version swap guide |
| `footage.md` | AMV footage guide |
| `websites.md` | Helpful websites |
| `safety.md` | Safety info |
| `extract.md` | Extraction guide |

## Deploy

Deployed via Vercel. Push ke `main` branch untuk auto-deploy.

> Archived from satvrn.li — Preserved for the editing community.
