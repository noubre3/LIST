# Tech Stack — LIST

## Overview

LIST is a web application optimized for iPad, saved to the home screen for an app-like experience. It requires an internet connection (WiFi at home) and integrates with Bring! for grocery list management.

---

## Architecture

```
iPad (Safari) → Web App → Supabase (database + storage)
                       → OpenAI (photo extraction)
                       → Bring! API (shopping list)
```

---

## Frontend

| Technology | Purpose |
|---|---|
| **React** | UI framework — builds the screens and interactions |
| **TypeScript** | Keeps the code reliable and easier to maintain |
| **Tailwind CSS** | Styling — makes the app look good on iPad |
| **PWA (Progressive Web App)** | Allows saving to iPad home screen, feels like a native app |

---

## Backend & Database

| Technology | Purpose |
|---|---|
| **Supabase** | Stores all recipes, meal plans, and tags in the cloud |
| **Supabase Storage** | Stores recipe photos |
| **Supabase Auth** | Simple login so your data is private |

- Free tier — more than enough for personal use
- Data is safe even if the iPad is lost or reset
- Accessible from any browser if needed

---

## AI & Integrations

| Technology | Purpose | Cost |
|---|---|---|
| **OpenAI GPT-4o Vision** | Extracts recipes from photos (paper recipes) | ~$1–2/month |
| **Recipe scraping library** | Extracts recipes from URLs automatically | Free |
| **Bring! API** | Sends ingredients directly to your Bring! shopping list | Free |

---

## Hosting & Deployment

| Technology | Purpose |
|---|---|
| **Vercel** | Hosts the web app — free tier, deploys automatically from GitHub |
| **GitHub** | Stores the code (already set up at github.com/noubre3/LIST) |

Every time code is updated and pushed to GitHub, Vercel automatically deploys the latest version. No manual steps needed.

---

## Cost Summary

| Service | Monthly Cost |
|---|---|
| Supabase | Free |
| Vercel (hosting) | Free |
| OpenAI (photo AI) | ~$1–2 |
| Bring! API | Free |
| **Total** | **~$1–2/month** |

---

## Why These Choices

- **No App Store** — web app avoids Apple's review process and $99/year developer fee
- **Supabase over iCloud** — works with web apps, free, and backs up all data in the cloud
- **Vercel** — simplest way to host a web app for free with automatic GitHub deployment
- **OpenAI** — best accuracy for reading handwritten and printed recipes from photos
