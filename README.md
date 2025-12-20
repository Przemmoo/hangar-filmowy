# 🎬 Hangar Filmowy

Profesjonalna strona do wynajmu ekranu LED na eventy outdoor - kino plenerowe, wydarzenia firmowe, kino samochodowe.

## 🚀 Quick Start

### 1. Instalacja zależności

```bash
npm install
```

### 2. Konfiguracja zmiennych środowiskowych

Skopiuj `.env.example` do `.env.local` i uzupełnij:

```bash
cp .env.example .env.local
```

Edytuj `.env.local`:
- `DATABASE_URL` - connection string z Supabase
- `NEXTAUTH_SECRET` - wygeneruj: `openssl rand -base64 32`
- `RESEND_API_KEY` - API key z Resend
- inne zmienne zgodnie z projektem

### 3. Uruchom lokalnie

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000)

### 4. Build produkcyjny

```bash
npm run build
```

## 📦 Deployment na Cloudflare Pages

### Połączenie z GitHub:

1. **Push do GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - Hangar Filmowy"
git branch -M main
git remote add origin https://github.com/[USERNAME]/hangar-filmowy.git
git push -u origin main
```

2. **Cloudflare Pages Dashboard:**
   - Zaloguj się: https://dash.cloudflare.com
   - Pages → Create a project
   - Connect to Git → wybierz repo `hangar-filmowy`
   
3. **Build settings:**
   - **Framework preset:** Next.js
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory:** `/`
   
4. **Environment variables (w Cloudflare):**
   Dodaj wszystkie zmienne z `.env.local`:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` = `https://hangarfilmowy.pl`
   - `NEXTAUTH_SECRET`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `EMAIL_TO`

5. **Custom Domain:**
   - W Cloudflare Pages → Custom domains
   - Add domain → `hangarfilmowy.pl`
   - Cloudflare automatycznie skonfiguruje DNS (jeśli domena już w Cloudflare)

### Automatyczne deploymenty:

Każdy `git push` do `main` branch automatycznie triggeruje deployment 🚀

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router, SSG)
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Auth:** NextAuth.js v5 (w trakcie konfiguracji)
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Hosting:** Cloudflare Pages
- **Icons:** Lucide React

## 📁 Struktura projektu

```
hangar-filmowy/
├── app/
│   ├── layout.tsx          # Root layout z metadata
│   ├── page.tsx            # Strona główna
│   ├── globals.css         # Global styles
│   └── admin/
│       └── login/
│           └── page.tsx    # Panel logowania
├── components/             # React components (w budowie)
├── lib/                    # Utilities, auth config
├── public/                 # Static assets
├── .env.example           # Przykładowy plik env
└── README.md
```

## 🎨 Design System

- **Primary:** Gold (#F4B740) → Orange (#FF6F20) gradient
- **Background:** Dark (#0A1828) → Blue (#1E3A5F) gradient
- **Font:** Inter (Google Fonts)

## 📝 Status

- ✅ Podstawowa struktura Next.js 14
- ✅ Strona główna z Hero section
- ✅ Panel logowania (UI gotowy)
- 🚧 NextAuth.js - w trakcie konfiguracji
- 🚧 Interaktywny konfigurator
- 🚧 Panel administracyjny
- 🚧 Integracja z Supabase
- 🚧 Email notifications (Resend)

## 🔗 Links

- **Produkcja:** https://hangarfilmowy.pl (wkrótce)
- **Email:** pokaz@hangarfilmowy.pl
- **Admin:** https://hangarfilmowy.pl/admin/login

---

Made with ❤️ for outdoor cinema lovers
