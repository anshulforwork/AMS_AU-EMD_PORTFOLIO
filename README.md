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

## Pages / sections

Home scrolls: Profile → About → Skills → Education → Work → Gallery → Experience → Contact  
Project detail: `/projects/<slug>`  
Admin: use the **Admin** button in the navbar / footer

## Admin

Use **Admin** on the site to sign in. You can change the password with OTP to your registered mobile number.

Content saves to `data/portfolio.json` and uploads to `public/media/uploads/`. Commit those files after editing so GitHub Pages stays updated.

> Admin APIs need a Node server (`npm run dev`). On GitHub Pages (static hosting), browse the public site; edit content locally, then push.

## Content sources

- Seed defaults: `src/content/defaultPortfolio.ts`
- Live editable store: `data/portfolio.json`
- Media: `public/media/`
