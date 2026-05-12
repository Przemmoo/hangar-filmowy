# 🔐 Security Setup - Cloudflare Secrets

## ⚠️ WAŻNE: Klucz API Resend został wykryty w historii Git!

**MUSISZ natychmiast zregenerować klucz API w Resend:**

1. Wejdź na: https://resend.com/api-keys
2. Usuń stary klucz (skompromitowany)
3. Wygeneruj nowy klucz API
4. Dodaj go do Cloudflare Secrets (instrukcja poniżej)

---

## Dodawanie sekretów w Cloudflare Pages

### Metoda 1: Dashboard (zalecane)

1. Wejdź na **dashboard.cloudflare.com**
2. **Workers & Pages** → **hangar-filmowy**
3. Zakładka **Settings**
4. Sekcja **Environment variables**
5. Kliknij **Add variable**
6. Dodaj:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_xxxxxxxxxx` (nowy klucz z Resend)
   - **Environment**: `Production` (zaznacz checkbox)
7. Kliknij **Save**
8. Redeploy projektu (nowy build pobierze secret)

### Metoda 2: wrangler CLI

```bash
# W katalogu projektu
npx wrangler pages secret put RESEND_API_KEY

# Wpisz nowy klucz gdy zostaniesz poproszony
# Enter the secret text you'd like assigned to the variable RESEND_API_KEY on the project hangar-filmowy:
```

---

## Weryfikacja

Po dodaniu sekretu i redeploymencie:

1. Wejdź na stronę i wyślij formularz kontaktowy
2. Sprawdź czy email przychodzi
3. Sprawdź w panelu admina czy wysyłanie odpowiedzi działa

---

## Lokalne testy (development)

Dla lokalnego serwera dev utwórz `.env.local`:

```bash
# .env.local (NIE COMMITUJ!)
RESEND_API_KEY=re_xxxxxxxxxx
NEXTAUTH_SECRET=your-secret-here
```

**WAŻNE**: `.env.local` jest w `.gitignore` i NIE powinien trafić do repozytorium!

---

## Dlaczego to było potrzebne?

Poprzednio klucz API był hardcoded w kodzie źródłowym:
```typescript
const resend = new Resend('re_9i3MUVze_FxtMHbXQEoXPc4zcw7m6bSfm'); // ❌ NIGDY TAK NIE RÓB!
```

Teraz używamy zmiennej środowiskowej:
```typescript
const resend = new Resend(process.env.RESEND_API_KEY!); // ✅ Prawidłowo
```

Dzięki `nodejs_compat_populate_process_env` w `wrangler.toml`, Cloudflare Pages automatycznie wstrzykuje sekrety do `process.env` w edge runtime.
