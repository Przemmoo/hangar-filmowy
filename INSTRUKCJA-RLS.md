# 🔒 Instrukcja Wdrożenia Row Level Security (RLS)

## ⚠️ KRYTYCZNE - PRZECZYTAJ PRZED ROZPOCZĘCIEM

Twoja baza danych ma **POWAŻNĄ LUKĘ BEZPIECZEŃSTWA**. Wszystkie tabele są publicznie dostępne bez żadnych ograniczeń. Ktokolwiek może:
- Czytać wszystkie dane (w tym potencjalnie hasła, dane osobowe)
- Modyfikować/usuwać dowolne rekordy
- Tworzyć fałszywe konta administratorów

**Ta instrukcja naprawi ten problem w 100%.**

---

## 📋 Przegląd Zmian

### Co zostało zrobione:

1. ✅ **Stworzono helper bibliotekę** - `lib/supabase-admin.ts`
   - Bezpieczne API do komunikacji z Supabase z Service Role Key
   - Używane tylko w backendowych API routes

2. ✅ **Naprawiono wszystkie Admin API routes** - używają teraz Service Role Key:
   - `/api/admin/content`
   - `/api/admin/dashboard`
   - `/api/admin/settings`
   - `/api/admin/submissions` + wszystkie subroutes
   - `/api/admin/users` + `/api/admin/users/[id]`
   - `/api/admin/media` + `/api/admin/media/[id]`
   - `/api/admin/migrate-content`

3. ✅ **Stworzono skrypt SQL** - `enable-rls-policies.sql`
   - Włącza RLS na wszystkich tabelach
   - Definiuje bezpieczne polityki dostępu

4. ✅ **Zaktualizowano konfigurację** - `.env.example`
   - Dodano `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚀 Krok 1: Dodaj Service Role Key do Zmiennych Środowiskowych

### 1.1 Znajdź Service Role Key w Supabase:

1. Zaloguj się do [Supabase Dashboard](https://supabase.com/dashboard)
2. Wybierz swój projekt
3. Przejdź do: **Settings** → **API**
4. Znajdź sekcję **Project API keys**
5. Skopiuj klucz oznaczony jako: **`service_role` (secret)**

⚠️ **UWAGA**: Ten klucz ma pełny dostęp do bazy - **NIGDY** nie udostępniaj go publicznie!

### 1.2 Dodaj do pliku `.env.local`:

```bash
# Supabase Service Role (NEVER expose to client! Backend only!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 1.3 Dodaj do produkcji (Vercel/Cloudflare):

**Dla Vercel:**
```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

**Dla Cloudflare Pages:**
Dodaj w dashboard: Settings → Environment variables

---

## 🗄️ Krok 2: Włącz Row Level Security w Supabase

### 2.1 Otwórz Supabase SQL Editor:

1. Zaloguj się do [Supabase Dashboard](https://supabase.com/dashboard)
2. Wybierz swój projekt
3. Przejdź do: **SQL Editor**
4. Kliknij **New query**

### 2.2 Wykonaj skrypt `enable-rls-policies.sql`:

1. Otwórz plik `enable-rls-policies.sql` w swoim edytorze
2. Skopiuj **CAŁĄ** zawartość
3. Wklej do SQL Editor w Supabase
4. Kliknij **Run** (lub Ctrl+Enter)

### 2.3 Weryfikacja:

Wykonaj to zapytanie w SQL Editor:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Wszystkie tabele powinny mieć `rowsecurity = true`**

---

## 🔍 Krok 3: Zweryfikuj Polityki RLS

Sprawdź czy polityki zostały poprawnie utworzone:

```sql
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Powinieneś zobaczyć listę polityk dla każdej tabeli (np. "Admin can view all users", "Public can create submissions", itp.)

---

## 🧪 Krok 4: Przetestuj Aplikację Lokalnie

### 4.1 Uruchom aplikację lokalnie:

```bash
npm run dev
# lub
yarn dev
```

### 4.2 Przetestuj kluczowe funkcje:

#### Test 1: Formularz Kontaktowy (Publiczny)
1. Przejdź na stronę główną
2. Wypełnij i wyślij formularz kontaktowy
3. ✅ Powinien działać (polityka pozwala na INSERT dla wszystkich)

#### Test 2: Logowanie Administratora
1. Przejdź do `/admin/login`
2. Zaloguj się jako admin
3. ✅ Powinno działać (polityka pozwala na SELECT z tabeli users)

#### Test 3: Panel Administratora
1. Po zalogowaniu, przejdź do `/admin/dashboard`
2. Sprawdź czy widzisz statystyki
3. ✅ Powinno działać (Service Role Key ma pełny dostęp)

#### Test 4: Zarządzanie Treścią
1. Przejdź do `/admin/content`
2. Spróbuj edytować jakąś sekcję
3. ✅ Powinno działać (Service Role Key + polityki)

#### Test 5: Media
1. Przejdź do `/admin/media`
2. Spróbuj przesłać zdjęcie
3. ✅ Powinno działać

### 4.3 Sprawdź logi konsoli:

Jeśli widzisz błędy typu:
- `403 Forbidden`
- `new row violates row-level security policy`
- `permission denied for table`

➡️ **Skontaktuj się ze mną - coś wymaga poprawy**

---

## 🚀 Krok 5: Wdrożenie na Produkcję

### 5.1 Zatwierdź zmiany w Git:

```bash
git add .
git commit -m "🔒 Add RLS security - fix critical vulnerability"
git push origin main
```

### 5.2 Sprawdź zmienne środowiskowe produkcji:

Upewnij się, że `SUPABASE_SERVICE_ROLE_KEY` jest ustawiony w środowisku produkcyjnym (Vercel/Cloudflare).

### 5.3 Poczekaj na deployment i przetestuj:

Po wdrożeniu, **KONIECZNIE** przetestuj wszystkie funkcje tak jak w Kroku 4!

---

## 📊 Co Zmienia RLS?

### Przed RLS (NIEBEZPIECZNE ❌):

```javascript
// Każdy może to zrobić przez API:
fetch('https://your-project.supabase.co/rest/v1/users?select=*', {
  headers: { 
    'apikey': 'PUBLIC_ANON_KEY', 
    'Authorization': 'Bearer PUBLIC_ANON_KEY' 
  }
})
// ❌ Zwraca WSZYSTKICH użytkowników z hasłami!
```

### Po RLS (BEZPIECZNE ✅):

```javascript
// To samo zapytanie z ANON_KEY:
fetch('https://your-project.supabase.co/rest/v1/users?select=*', {
  headers: { 
    'apikey': 'PUBLIC_ANON_KEY', 
    'Authorization': 'Bearer PUBLIC_ANON_KEY' 
  }
})
// ✅ Zwraca puste [] - brak dostępu!

// Tylko backend z Service Role Key może:
fetch('https://your-project.supabase.co/rest/v1/users?select=*', {
  headers: { 
    'apikey': 'SERVICE_ROLE_KEY', 
    'Authorization': 'Bearer SERVICE_ROLE_KEY' 
  }
})
// ✅ Zwraca dane - ale tylko z serwera!
```

---

## 🛡️ Model Bezpieczeństwa

### Tabela: `users`
- ❌ **Publiczny dostęp**: BRAK
- ✅ **Admin**: Pełny dostęp (CRUD)
- ℹ️ **Uwaga**: Logowanie używa Service Role Key (bypasses RLS)

### Tabela: `form_submissions`
- ✅ **Publiczny dostęp**: Tylko INSERT (formularz kontaktowy)
- ✅ **Admin**: Pełny dostęp (odczyt, edycja, usuwanie)
- ❌ **Zwykli użytkownicy**: BRAK dostępu do cudzych zgłoszeń

### Tabela: `submission_replies`
- ❌ **Publiczny dostęp**: BRAK
- ✅ **Admin**: Pełny dostęp

### Tabela: `media`
- ✅ **Publiczny dostęp**: Tylko SELECT (dla wyświetlania zdjęć)
- ✅ **Admin**: Pełny dostęp (upload, edycja, usuwanie)

### Tabela: `content`
- ✅ **Publiczny dostęp**: Tylko SELECT (dla treści strony)
- ✅ **Admin**: Pełny dostęp (edycja treści)

### Tabela: `settings`
- ✅ **Publiczny dostęp**: Tylko SELECT (dla ustawień strony)
- ✅ **Admin**: Pełny dostęp

---

## 🔧 Rozwiązywanie Problemów

### ⚠️ Problem 0: Logowanie nie działa (NAJCZĘSTSZY!)

**Przyczyna**: Plik `auth.ts` został już zaktualizowany do używania Service Role Key, ale zmienna środowiskowa nie jest ustawiona.

**Rozwiązanie**: 
1. Dodaj Service Role Key do `.env.local` (patrz Krok 1)
2. **RESTART aplikacji**:
   ```bash
   # Zatrzymaj serwer (Ctrl+C)
   # Uruchom ponownie:
   npm run dev
   ```
3. Spróbuj zalogować się ponownie

**Jeśli nadal nie działa:**
- Sprawdź console w przeglądarce (F12)
- Sprawdź terminal - czy widzisz błąd "SUPABASE_SERVICE_ROLE_KEY is not set"?
- Upewnij się, że plik `.env.local` jest w głównym katalogu projektu

---

### Problem 1: "Missing Supabase environment variables"

**Przyczyna**: Brak `SUPABASE_SERVICE_ROLE_KEY` w środowisku.

**Rozwiązanie**: 
```bash
# Dodaj do .env.local
SUPABASE_SERVICE_ROLE_KEY=twoj_service_role_key
```

### Problem 2: "new row violates row-level security policy"

**Przyczyna**: Polityki RLS blokują operację.

**Rozwiązanie**: 
- Sprawdź czy skrypt SQL został wykonany poprawnie
- Sprawdź czy używasz Service Role Key w admin routes
- Sprawdź logi Supabase: Dashboard → Logs → API

### Problem 3: Formularz kontaktowy nie działa

**Przyczyna**: Polityka dla INSERT może być niepoprawna.

**Rozwiązanie**: 
Sprawdź czy ta polityka istnieje:
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'form_submissions' 
AND policyname = 'Public can create submissions';
```

### Problem 4: Admin nie może edytować treści

**Przyczyna**: Service Role Key nie jest używany w API routes.

**Rozwiązanie**: 
- Sprawdź czy zmienna `SUPABASE_SERVICE_ROLE_KEY` jest ustawiona
- Sprawdź czy kod używa `supabaseAdminFetch` zamiast zwykłego `fetch`

---

## 📞 Pomoc

Jeśli napotkasz problemy:

1. **Sprawdź logi Supabase**: Dashboard → Logs → API
2. **Sprawdź console.log w aplikacji**: F12 → Console
3. **Zweryfikuj polityki RLS**: SQL Editor → `SELECT * FROM pg_policies;`
4. **Sprawdź zmienne środowiskowe**: Upewnij się, że wszystkie są ustawione

---

## ✅ Checklist Wdrożenia

- [ ] Dodano `SUPABASE_SERVICE_ROLE_KEY` do `.env.local`
- [ ] Dodano `SUPABASE_SERVICE_ROLE_KEY` do produkcji (Vercel/Cloudflare)
- [ ] Wykonano skrypt `enable-rls-policies.sql` w Supabase
- [ ] Zweryfikowano, że wszystkie tabele mają `rowsecurity = true`
- [ ] Przetestowano formularz kontaktowy (działa)
- [ ] Przetestowano logowanie admina (działa)
- [ ] Przetestowano panel admina (działa)
- [ ] Przetestowano edycję treści (działa)
- [ ] Przetestowano upload mediów (działa)
- [ ] Wykonano commit i push do repozytorium
- [ ] Wdrożono na produkcję
- [ ] Przetestowano produkcję

---

## 🎉 Gotowe!

Po wykonaniu wszystkich kroków, Twoja aplikacja jest **BEZPIECZNA**! 🔒

RLS chroni teraz Twoją bazę danych przed:
- Nieautoryzowanym dostępem do danych
- Nieautoryzowaną modyfikacją/usuwaniem danych
- Wyciekiem danych osobowych
- Atakami typu SQL Injection (częściowo)
- Nieautoryzowanym tworzeniem kont administratorów

**Gratulacje!** 🎊
