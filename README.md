# Anshul Sahu — Portfolio

Premium one-page site inspired by [your previous AMS portfolio](https://anshulforwork.github.io/Portfolio_website_AMS/).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

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
