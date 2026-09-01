# SketchRace website

The public landing page for [SketchRace](https://github.com/martynpekala/SketchRace), a landscape-first iPhone racing-line puzzle.

## Local preview

Because the page is static, any local HTTP server works:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Deployment

Pushing to `main` runs the GitHub Pages workflow in `.github/workflows/pages.yml`.
