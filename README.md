# yougijain.com

Personal portfolio for Madhiyougi (Yougi) Jain — data science & informatics.
Plain HTML/CSS/JS, no build step. Clean and minimal now, easy to push toward a
more creative direction later.

## Structure

```
.
├── index.html        # all content + page structure
├── css/style.css     # design tokens at the top — start there
├── js/main.js        # nav, mobile menu, scroll reveals
├── assets/           # résumé PDF (add images/og-image here)
├── CNAME             # custom domain for GitHub Pages
└── README.md
```

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Editing content

Everything lives in `index.html` and is commented by section
(About, Work, Experience, Skills, Contact). To add a project, copy any
`<article class="project">` block. To add a role, copy a `<li class="timeline__item">`.

## Changing the look

Open `css/style.css` — the `:root` block at the top holds all colors, fonts,
spacing, and the single accent color. Change `--accent`, swap the Google Fonts
in `index.html`, and the whole site follows. A `[data-theme="dark"]` palette is
already stubbed in if you want to wire up a light/dark toggle.

## Deploying

**GitHub Pages**
1. Push this folder to a repo.
2. Settings → Pages → deploy from `main` / root.
3. The included `CNAME` points the site at `yougijain.com`. In your domain
   registrar, add a CNAME record for `www` → `<username>.github.io` and four
   A records for the apex domain pointing to GitHub Pages IPs
   (185.199.108–111.153).

**Netlify / Vercel / Cloudflare Pages**
Drag-and-drop the folder (or connect the repo). Add `yougijain.com` as a custom
domain and follow the DNS instructions they give you.

## Email

Contact links point to `yougi@yougijain.com`. To collect messages via a form
later, drop in a service like Formspree or Netlify Forms and add a `<form>` to
the Contact section.
