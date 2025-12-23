# Instrukcja konfiguracji Supabase Storage dla biblioteki mediów

## Krok 1: Utwórz bucket w Supabase

1. Zaloguj się do swojego projektu Supabase: https://supabase.com/dashboard
2. Przejdź do **Storage** w menu bocznym
3. Kliknij **New bucket**
4. Ustaw nazwę bucket: `hangar-media`
5. Zaznacz **Public bucket** (aby pliki były publicznie dostępne)
6. Kliknij **Create bucket**

## Krok 2: Ustaw polityki dostępu

### Metoda 1: Przez interfejs Supabase (zalecana)

1. W Supabase Dashboard przejdź do **Storage** → `hangar-media` bucket
2. Kliknij na **Configuration** lub ikonę ustawień bucket'a
3. Sprawdź czy **Public bucket** jest zaznaczone - jeśli nie, zaznacz
4. Kliknij **Policies** w menu bocznym lub przycisk **New Policy**
5. Wybierz szablon polityki:
   - Dla INSERT/UPLOAD: wybierz **"Enable insert for authenticated users only"**
   - Dla DELETE: wybierz **"Enable delete for authenticated users only"**
   - Dla SELECT (jeśli bucket nie jest publiczny): wybierz **"Enable read access for all users"**

### Metoda 2: Przez SQL Editor (jeśli wolisz SQL)

1. Przejdź do **SQL Editor** w menu Supabase
2. Kliknij **New query**
3. Wklej i wykonaj następujący SQL:

```sql
-- Polityka odczytu (publiczna)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'hangar-media' );

-- Polityka zapisu (tylko dla uwierzytelnionych)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'hangar-media' );

-- Polityka usuwania (tylko dla uwierzytelnionych)
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'hangar-media' );
```

4. Kliknij **Run** aby wykonać

### Metoda 3: Uproszczona (jeśli bucket jest publiczny)

Jeśli zaznaczyłeś **Public bucket** podczas tworzenia:
- ✅ Odczyt jest automatycznie publiczny
- ✅ Musisz tylko dodać politykę INSERT i DELETE dla zalogowanych użytkowników

W zakładce **Policies** bucket'a `hangar-media`:
1. Kliknij **New Policy**
2. Wybierz **For full customization** lub gotowy szablon
3. Dla INSERT: 
   - Policy name: `Authenticated upload`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
4. Dla DELETE:
   - Policy name: `Authenticated delete`
   - Allowed operation: `DELETE`  
   - Target roles: `authenticated`

## Krok 3: Sprawdź konfigurację

Po utworzeniu bucketa, URL do plików będzie wyglądał tak:
```
https://[TWOJ-PROJEKT].supabase.co/storage/v1/object/public/hangar-media/[NAZWA-PLIKU]
```

## Gotowe!

Teraz biblioteka mediów w panelu administracji będzie w pełni funkcjonalna:
- ✅ Upload zdjęć do Supabase Storage
- ✅ Automatyczne zapisywanie metadanych do bazy
- ✅ Wyszukiwanie po nazwie pliku i tekście ALT
- ✅ Edycja tekstu ALT
- ✅ Usuwanie plików (zarówno z bazy jak i storage)
- ✅ Kopiowanie URL do schowka
- ✅ Podgląd wymiarów i rozmiaru pliku

## Limity

- Maksymalny rozmiar pliku: **10 MB**
- Dozwolone typy: tylko **obrazy** (image/*)
- Limity Supabase Free Tier: **1 GB storage**
