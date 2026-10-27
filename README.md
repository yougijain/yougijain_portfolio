# yougijain.com

Personal portfolio for Madhiyougi (Yougi) Jain, aimed at machine learning
roles: production ML, computer vision, and model evaluation.
Plain HTML/CSS/JS, no build step. Clean and minimal now, easy to push toward a
more creative direction later.

## Structure

```
.
├── index.html        # all content + page structure
├── notes/            # standalone note pages, not linked from the home page
├── css/style.css     # design tokens at the top (start there)
├── js/main.js        # nav, mobile menu, scroll reveals
├── assets/           # résumé PDF (add images/og-image here)
├── CNAME             # custom domain for GitHub Pages
├── wrangler.jsonc    # Cloudflare Workers config (static assets)
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
(Work, About, Experience, Education, Skills, Contact). Work is split
into labelled `.work-group` blocks. To add a project, copy an
`<article class="project">` inside the right group. For a one-line entry, copy
an `<li class="index-list__item">` in the "Also built" index below the groups.
To add a role, copy a `<li class="timeline__item">`.

To add a note, copy any page in `notes/`, keep its header, footer, and
stylesheet link, and replace the title, meta tags, and `.note__body`. Then
point the previous note's "Next" link at it. Formulas go in a `<p class="note__formula">` and tables in a
`.note__table` inside a `.note__table-wrap`.

## Changing the look

Open `css/style.css`. The `:root` block at the top holds all colors, fonts,
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
