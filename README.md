# Anshul Sahu — Portfolio

Premium one-page site inspired by [your previous AMS portfolio](https://anshulforwork.github.io/Portfolio_website_AMS/).

**Live (GitHub Pages):** [https://anshulforwork.github.io/AMS_AU-EMD_PORTFOLIO/](https://anshulforwork.github.io/AMS_AU-EMD_PORTFOLIO/)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy-github-pages.yml` and publishes the static site.

One-time setup in the GitHub repo:

1. **Settings → Pages**
2. Source: **GitHub Actions**

Local preview of the Pages build:

```bash
npm run build:pages
npx serve out
```

> Admin (`/admin`) needs a Node server, so it works locally with `npm run dev` only — not on GitHub Pages. Edit content locally, commit `data/portfolio.json` + media, then push.

## Pages / sections

Home scrolls: Profile → About → Skills → Education → Work → Gallery → Experience → Contact  
Project detail: `/projects/<slug>`  
Admin: `/admin/login`

## Admin (edit content + upload images)

1. Go to `/admin/login`
2. Password default: `anshul123` (set `ADMIN_PASSWORD` in `.env.local`)
3. Edit site, projects, skills, gallery → **Save all**
4. Uploads land in `public/media/uploads/`
5. Content is written to `data/portfolio.json` — commit that file after editing so deploys stay updated

> On Vercel, file writes from admin may not persist. Edit locally with `npm run dev`, save, then commit `data/portfolio.json` + uploaded media and redeploy.

## Content sources

- Seed defaults: `src/content/defaultPortfolio.ts`
- Live editable store: `data/portfolio.json`
- Media: `public/media/`
