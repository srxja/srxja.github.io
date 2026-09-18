# srxja.github.io

Personal site. Plain HTML/CSS/JS, no build step, hosted on GitHub Pages.

| Page | File |
| --- | --- |
| Home | `index.html` |
| Projects | `projects.html` |
| Publications | `publications.html` |
| Sky log (astrophotography) | `sky.html` — reads `gallery/index.json` |
| Blog | `blog.html` + `post.html` — read `posts/index.json` and `posts/*.md` |
| About + contact | `about.html` |

Shared: `style.css`, `sky.js` (the animated night sky), `nav.js` (the ☰ menu), `md.js` (markdown renderer for posts).

## Deploy

Push everything to the `main` branch of the `srxja.github.io` repo. That's it.

## Add a blog post

See `posts/how-this-site-works.md` (it's also the first post on the live site).

## Add a sky image

See `gallery/README.md`.

## Preview locally

The gallery and blog `fetch()` JSON, which browsers block on `file://`. Serve the folder instead:

```
python3 -m http.server 8000
```

then open http://localhost:8000.
