# Deploying Hummingbird to your Omantel domain

This is a Next.js app (it has a small CMS with API routes), so it needs a host
that runs Node.js. You own a domain but no host yet, so the simplest route is:

**Host on Vercel (free) → point your Omantel domain's DNS at it.**

---

## 1. Put the code on Vercel

Easiest (no GitHub needed) — using the Vercel CLI:

```bash
cd hummingbird
npm i -g vercel
vercel            # first run: log in, accept defaults, it builds & deploys
vercel --prod     # promote to a production URL
```

Or via GitHub: push this folder to a GitHub repo, then on
https://vercel.com → "Add New Project" → import the repo. It auto-detects
Next.js and builds.

## 2. Set the admin password on Vercel

Vercel won't read your local `.env.local`. In the Vercel project:
**Settings → Environment Variables → Add**

```
Name:  ADMIN_PASSWORD
Value: #Livewire321
```

Redeploy after adding it.

## 3. Connect your Omantel domain

In Vercel: **Settings → Domains → Add** → type your domain (e.g.
`yourname.om`). Vercel shows you the DNS records to create.

Then log in to your **Omantel domain DNS panel** and add what Vercel shows,
usually:

- Apex/root domain → an **A record** pointing to `76.76.21.21`
- `www` → a **CNAME** pointing to `cname.vercel-dns.com`

(Use the exact values Vercel displays — they're authoritative.)
DNS can take a few minutes to a few hours to propagate. Vercel handles the
HTTPS certificate automatically.

---

## Make the CMS work on the LIVE site

The CMS can edit content directly on the live site. Instead of a database, it
**commits your changes to GitHub**, and Vercel auto-rebuilds (~30s later the
site shows the update). Content stays in your repo, fully in your control.

To enable it, the project must be on GitHub and connected to Vercel, then set
these environment variables in **Vercel → Settings → Environment Variables**:

```
ADMIN_PASSWORD = #Livewire321
GITHUB_TOKEN   = <a GitHub token, see below>
GITHUB_REPO    = your-username/your-repo
GITHUB_BRANCH  = main
```

**Getting the GitHub token:**
GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate.
- Repository access: only your portfolio repo.
- Permissions: **Contents → Read and write**.
Copy the token into `GITHUB_TOKEN`.

That's it. On the live `/admin`:
1. Log in, edit any section, click **Save** (or **Upload** an image).
2. It commits to GitHub → Vercel redeploys → the change goes live in ~30s.

If these vars are **not** set (e.g. local dev), the CMS just writes the local
files instead — so `npm run dev` keeps working exactly as before.
