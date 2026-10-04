# brandonduran.dev

A fast, single-page portfolio built with plain HTML, CSS, and vanilla JavaScript. There's no build step and no dependencies other than Google Fonts.

```
index.html   page content (all sections)
styles.css   theme + layout (colors live in :root at the top)
script.js    typing effect, nav, scroll reveal, particle background
CNAME        custom domain for GitHub Pages (brandonduran.dev)
.nojekyll    tells GitHub Pages to serve files as-is
```

## Editing content

The site has no placeholder content left. Here's where everything lives:

| What | Where |
|---|---|
| Hero badge, tagline, buttons | `index.html` → `#hero` |
| Typing-effect roles | `script.js` → `const roles = [...]`. Also update the matching `sr-only` sentence in the hero |
| Bio, quick facts, stats | `index.html` → `#about` (`data-count` / `data-suffix` drive the count-up numbers) |
| Profile photo | `assets/profile.jpg`, shown in the circular gradient ring. A higher-resolution square photo (400×400+) will look sharper |
| Skills chips | `index.html` → `#skills` (each `<li>` is a chip) |
| Impact numbers + featured project | `index.html` → `#impact` |
| Experience timeline | `index.html` → `#experience` (newest first, bullets in `.bullets`) |
| Certifications & awards | `index.html` → `#certifications` (issuer badge colors are the `.issuer-*` classes in `styles.css`) |
| Email / GitHub / LinkedIn | `index.html` → `#contact`, the nav GitHub icon, and the footer links |
| Colors | `styles.css` → `--accent-1/2/3` |
| Social preview image | Optional: add a 1200×630 `og-image.png`, then add `<meta property="og:image" content="https://brandonduran.dev/og-image.png">` and switch `twitter:card` to `summary_large_image` |

Preview locally:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying with GitHub Pages + Porkbun

### 1. Push to GitHub
Create a public repository named **`Brandon-Duran.github.io`** (recommended: a user site serves from the root). Then push these files to the root of the `main` branch:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/Brandon-Duran/Brandon-Duran.github.io.git
git push -u origin main
```

### 2. Turn on Pages
Go to the repo, then **Settings → Pages**:
- **Source:** Deploy from a branch → `main` / `(root)` → Save.
- **Custom domain:** `brandonduran.dev` → Save. (The `CNAME` file already sets this.)

Optional but recommended: verify the domain in your GitHub account under **Settings → Pages → Add a domain**. This stops anyone else from claiming it.

### 3. Porkbun DNS
In Porkbun, go to **Domain Management → brandonduran.dev → DNS**. Delete any default parking records for the apex (`ALIAS`/`CNAME`/`A` pointing to Porkbun's parking page), including the `*` wildcard if it exists. Then add:

| Type | Host | Answer |
|---|---|---|
| A | *(blank)* | 185.199.108.153 |
| A | *(blank)* | 185.199.109.153 |
| A | *(blank)* | 185.199.110.153 |
| A | *(blank)* | 185.199.111.153 |
| AAAA | *(blank)* | 2606:50c0:8000::153 |
| AAAA | *(blank)* | 2606:50c0:8001::153 |
| AAAA | *(blank)* | 2606:50c0:8002::153 |
| AAAA | *(blank)* | 2606:50c0:8003::153 |
| CNAME | www | `Brandon-Duran.github.io` |

Leave TTL at the default (600). With these records, both `brandonduran.dev` and `www.brandonduran.dev` will work.

### 4. Enforce HTTPS
DNS can take anywhere from a few minutes to a few hours. Once **Settings → Pages** shows "DNS check successful" and the certificate is issued, tick **Enforce HTTPS**. (`.dev` domains require HTTPS, so the site won't load over plain http.)

Check DNS with:
```bash
dig brandonduran.dev +short
dig www.brandonduran.dev +short
```

## Notes
- Visitors who have *reduce motion* turned on in their OS get no animations, typing effect, or moving particles.
- The preview screenshots are kept outside this folder, so they won't be published.
