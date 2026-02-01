# 🚀 Instrukcja konfiguracji Cloudflare D1 i R2

## Krok 1: Przygotowanie Cloudflare Dashboard

### 1.1 Zaloguj się do Cloudflare Dashboard
- Otwórz: https://dash.cloudflare.com/
- Wybierz swoje konto

---

## Krok 2: Utworzenie bazy danych D1

### 2.1 Przez Dashboard (opcja wizualna):
1. W lewym menu wybierz **"Workers & Pages"**
2. Przejdź do zakładki **"D1 SQL Database"**
3. Kliknij **"Create database"**
4. Nazwa bazy: `hangar-filmowy-db`
5. Kliknij **"Create"**

### 2.2 Przez CLI (zalecane - szybsze):
```powershell
# Zaloguj się do Cloudflare (jeśli jeszcze nie jesteś)
wrangler login

# Utwórz bazę danych D1
wrangler d1 create hangar-filmowy-db
```

**WAŻNE:** Zapisz ID bazy danych, który pojawi się po utworzeniu!  
Format: `database_id = "8c588b46-6e4c-467b-b32e-ee6f6e52ddc5"`

---

## Krok 3: Zaimportowanie schematu bazy danych

### 3.1 Lokalne wykonanie schematu (development):
```powershell
# Wykonaj schema SQL lokalnie
wrangler d1 execute hangar-filmowy-db --local --file=./d1-schema.sql
```

### 3.2 Produkcyjne wykonanie schematu:
```powershell
# Wykonaj schema SQL na produkcji
wrangler d1 execute hangar-filmowy-db --remote --file=./d1-schema.sql
```

---

## Krok 4: Utworzenie R2 Bucket dla zdjęć

### 4.1 Przez Dashboard:
1. W lewym menu wybierz **"R2"**
2. Kliknij **"Create bucket"**
3. Nazwa bucketa: `hangar-filmowy-media`
4. Region: **Automatic** (lub wybierz Europe dla GDPR)
5. Kliknij **"Create bucket"**

### 4.2 Przez CLI:
```powershell
# Utwórz R2 bucket
wrangler r2 bucket create hangar-filmowy-media
```

### 4.3 Konfiguracja publicznego dostępu:
1. Otwórz bucket `hangar-filmowy-media` w Dashboard
2. Przejdź do zakładki **"Settings"**
3. W sekcji **"Public access"** kliknij **"Allow Access"**
4. Zapisz **publiczny URL** - będzie w formacie:
   ```
   https://pub-xxxxxxxxxxxxxxxx.r2.dev
   ```

---

## Krok 5: Aktualizacja wrangler.toml

Po utworzeniu bazy i bucketa, zaktualizuj `wrangler.toml`:

```toml
name = "hangar-filmowy"
compatibility_flags = ["nodejs_compat", "nodejs_compat_populate_process_env"]
compatibility_date = "2024-12-20"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "hangar-filmowy-db"
database_id = "TWOJE-DATABASE-ID-TUTAJ" # Wklej ID z kroku 2

# R2 Storage binding
[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "hangar-filmowy-media"

[site]
bucket = ".vercel/output/static"
```

---

## Krok 6: Aktualizacja zmiennych środowiskowych

### 6.1 Lokalne zmienne (.env.local):
```env
# Cloudflare bindings (dostępne automatycznie w runtime)
# DB i MEDIA_BUCKET będą dostępne przez context.env

# Publiczny URL R2 (po włączeniu public access)
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxxxxxxxxxxxxx.r2.dev

# NextAuth (zostaw jak było)
NEXTAUTH_SECRET=twoj-sekret
NEXTAUTH_URL=http://localhost:3000

# Resend API (zostaw jak było)
RESEND_API_KEY=twoj-klucz
```

### 6.2 Produkcyjne zmienne (Cloudflare Pages):
```powershell
# Ustaw zmienne przez CLI
wrangler pages secret put NEXTAUTH_SECRET
wrangler pages secret put RESEND_API_KEY
wrangler pages secret put NEXT_PUBLIC_R2_PUBLIC_URL
```

Lub przez Dashboard:
1. **Workers & Pages** → Twoja aplikacja → **Settings** → **Environment variables**

---

## Krok 7: Migracja danych z Supabase (opcjonalnie)

### 7.1 Eksport danych z Supabase:
1. Zaloguj się do Supabase Dashboard
2. Dla każdej tabeli wykonaj:
   ```sql
   -- W SQL Editor Supabase
   COPY (SELECT * FROM users) TO STDOUT WITH CSV HEADER;
   ```
3. Zapisz do plików CSV

### 7.2 Import do D1:
```powershell
# Wygeneruj SQL INSERT statements z CSV
# Wykonaj przez wrangler d1 execute
```

---

## Krok 8: Testowanie lokalnie

```powershell
# Uruchom dev server z D1 lokalnie
npm run dev

# W drugim terminalu - sprawdź bazę
wrangler d1 execute hangar-filmowy-db --local --command="SELECT * FROM users"
```

---

## Krok 9: Deploy na produkcję

```powershell
# Build i deploy
npm run deploy
```

---

## 🔧 Weryfikacja poprawności

### Test D1:
```powershell
# Lista wszystkich baz
wrangler d1 list

# Sprawdź tabele
wrangler d1 execute hangar-filmowy-db --remote --command="SELECT name FROM sqlite_master WHERE type='table'"

# Sprawdź dane
wrangler d1 execute hangar-filmowy-db --remote --command="SELECT COUNT(*) FROM users"
```

### Test R2:
```powershell
# Lista bucketów
wrangler r2 bucket list

# Lista plików w buckecie
wrangler r2 object list hangar-filmowy-media
```

---

## 📊 Limity FREE tier (przypomnienie)

### D1:
- ✅ 10 GB storage
- ✅ 5M czytań/dzień
- ✅ 100K zapisów/dzień

### R2:
- ✅ 10 GB storage
- ✅ Unlimited egress (darmowy download!)
- ✅ 1M Class A operations/miesiąc (PUT, LIST)
- ✅ 10M Class B operations/miesiąc (GET, HEAD)

---

## ⚠️ Troubleshooting

### Problem: "Error: No D1 database found"
**Rozwiązanie:** Sprawdź czy `database_id` w `wrangler.toml` jest poprawny

### Problem: "R2 bucket not found in runtime"
**Rozwiązanie:** Upewnij się że `binding = "MEDIA_BUCKET"` zgadza się w kodzie i wrangler.toml

### Problem: "Cannot access DB in development"
**Rozwiązanie:** Użyj `--local` flag: `wrangler d1 execute ... --local`

---

## 📝 Następne kroki po setupie

1. ✅ Zaktualizować kod API routes (automatycznie zrobione)
2. ✅ Przetestować upload zdjęć do R2
3. ✅ Zmigrować dane z Supabase
4. ✅ Usunąć stare zmienne SUPABASE_* z .env
5. ✅ Zaktualizować dokumentację projektu
