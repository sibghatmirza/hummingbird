# Hummingbird

A small, casual portfolio site. Next.js + TypeScript + Tailwind + Framer Motion.

## Run it

```bash
cd hummingbird
npm install
npm run dev
```

Open http://localhost:3000

## Pages

- `/` — Home (hero, selected work, about + contact previews)
- `/projects` — all projects
- `/projects/[slug]` — project detail
- `/about`
- `/contact`

## CMS — edit everything at `/admin`

The whole site is driven by JSON content files in `src/content/`
(`site`, `home`, `about`, `contact`, `projects`, `testimonials`, `clients`).

Edit them with the built-in admin panel:

1. Run the site (`npm run dev`) and open **http://localhost:3000/admin**.
2. Pick a section in the sidebar, edit the fields (text, lists, repeaters,
   images with upload), and hit **Save**.
3. Saving writes the JSON file and the site updates live.

**Password** — saving/uploading is protected. Copy `.env.local.example` to
`.env.local` and set `ADMIN_PASSWORD`. Enter the same password in the admin
sidebar (default: `hummingbird`).

**Images** — the Upload button on any image field saves the file to
`public/uploads/` and fills in the path automatically.

**Publishing** — the admin writes files locally, so the easiest workflow is:
edit locally → commit the changed files in `src/content/` and `public/uploads/`
→ redeploy. (On read-only hosts like Vercel the live `/admin` save won't
persist; run it locally to make changes.)

## Make it yours (by hand)

You can also edit `src/content/*.json` directly. Each project has a `slug`,
`title`, `category`, `year`, `accent` (`blue` | `coral` | `yellow`),
`description`, `cover`, `gallery`, and optional `credits`, `client`, `tools`,
`tags`, `published`.

**Logo** — currently an SVG stand-in in `src/components/Logo.tsx`. To use your
real logo, drop it in `public/` and swap the `<svg>` for an `<img>`.

**Your name** — search for `[Your Name]` in `src/app/about/page.tsx`.

**Contact links** — edit `src/app/contact/page.tsx` (email, Instagram, etc.).

## Brand

| Color           | Hex       | Use                |
| --------------- | --------- | ------------------ |
| Ink Black       | `#202428` | text               |
| Hummingbird Blue| `#18BBD0` | accent             |
| Coral Red       | `#FF575D` | accent             |
| Warm Yellow     | `#FFC65A` | accent             |
| Soft Cream      | `#FFF9ED` | background         |
| White           | `#FFFFFF` | cards              |

Tailwind tokens: `ink`, `blue`, `coral`, `yellow`, `cream`.
