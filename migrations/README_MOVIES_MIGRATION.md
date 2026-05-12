# Migracja Bazy Danych - Katalog Filmów

## Opis
Dodanie nowej tabeli `movies` do bazy danych D1 dla funkcjonalności katalogu filmów.

## Pliki migracji

1. **003_create_movies_table.sql** - Utworzenie tabeli movies (podstawowe pola)
2. **004_add_year_to_movies.sql** - Dodanie pola roku produkcji

## Instrukcje wykonania migracji

### Opcja 1: Przez Dashboard Cloudflare (Zalecane)

1. Zaloguj się do Cloudflare Dashboard
2. Przejdź do: **Workers & Pages** → **D1** → Twoja baza (ID: `8c588b46-6e4c-467b-b32e-ee6f6e52ddc5`)
3. Kliknij zakładkę **Console**
4. Skopiuj i wykonaj poniższe zapytania SQL **PO KOLEI**:

#### Krok 1: Utwórz tabelę (jeśli jeszcze nie istnieje)

```sql
CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  distributor TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_category ON movies(category);
```

#### Krok 2: Dodaj pole roku produkcji

```sql
ALTER TABLE movies ADD COLUMN year INTEGER;
CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(year);
```

5. Kliknij **Execute** po każdym kroku
6. Zweryfikuj utworzenie tabeli wykonując: `SELECT * FROM movies;`

### Opcja 2: Przez wrangler CLI (Lokalnie)

```powershell
# Z katalogu projektu wykonaj:
npx wrangler d1 execute hangar-filmowy-db --remote --file=migrations/003_create_movies_table.sql
```

## Weryfikacja

Po wykonaniu migracji, sprawdź czy tabela została utworzona:

```sql
-- W Cloudflare Dashboard Console:
SELECT name FROM sqlite_master WHERE type='table' AND name='movies';

-- Powinno zwrócić: movies
```

## Struktura tabeli

| Kolumna | Typ | Opis |
|---------|-----|------|
| id | TEXT | UUID, klucz główny |
| title | TEXT | Tytuł filmu (wymagane) |
| category | TEXT | Kategoria filmu (wymagane) |
| description | TEXT | Krótki opis filmu |
| distributor | TEXT | Nazwa dystrybutora |
| createdAt | TEXT | Data utworzenia (ISO 8601) |
| updatedAt | TEXT | Data ostatniej modyfikacji (ISO 8601) |

## Dodane funkcjonalności

### Panel Admina
- **URL:** `/admin/movies`
- **Funkcje:** Dodawanie, edycja, usuwanie filmów
- **Kategorie:** Dramat, Komedia, Akcja, Familijny, Animacja, Przygodowy, Sci-Fi, Horror, Thriller, Romans, Fantasy, Dokumentalny, Muzyczny, Western, Sensacyjny

### Strona Główna
- **Sekcja:** "Katalog Filmów" (przed sekcją "Proces")
- **Przycisk:** "Przeglądaj Katalog"
- **Modal:** Wyszukiwarka (min 3 znaki), lista filmów z tooltipem opisu

### API Endpoints
- `GET /api/admin/movies` - Lista filmów (admin)
- `POST /api/admin/movies` - Dodaj film (admin)
- `PUT /api/admin/movies/[id]` - Edytuj film (admin)
- `DELETE /api/admin/movies/[id]` - Usuń film (admin)
- `GET /api/movies?search=query` - Publiczne pobieranie filmów z wyszukiwaniem

## Po migracji

1. Zaloguj się do panelu admina: `https://hangarfilmowy.pl/admin/movies`
2. Dodaj przykładowe filmy do katalogu
3. Sprawdź czy modal działa na stronie głównej (sekcja "Katalog Filmów")

## Rollback (jeśli potrzebny)

W razie problemów, usuń tabelę:

```sql
DROP TABLE IF EXISTS movies;
DROP INDEX IF EXISTS idx_movies_title;
DROP INDEX IF EXISTS idx_movies_category;
```
