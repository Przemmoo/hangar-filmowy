-- Aktualizacja URL-i obrazków z Supabase na Cloudflare R2

-- 1. Aktualizacja tabeli media - zamiana URL-i Supabase na R2
UPDATE media 
SET url = 'https://media.hangarfilmowy.pl/' || 
  SUBSTR(url, INSTR(url, 'hangar-media/') + 13)
WHERE url LIKE '%supabase.co%';

-- 2. Naprawa nieprawidłowych URL-i (bez domeny)
UPDATE media
SET url = 'https://media.hangarfilmowy.pl' || url
WHERE url LIKE '/%';

-- 3. Aktualizacja backgroundImage w tabeli content (sekcja hero)
UPDATE content
SET data = REPLACE(data, 'supabase.co/storage/v1/object/public/hangar-media/', 'media.hangarfilmowy.pl/')
WHERE data LIKE '%supabase.co%';

-- Weryfikacja - pokaż zaktualizowane URL-e
SELECT 'Media URLs:' as info;
SELECT id, url FROM media;

SELECT 'Content with images:' as info;
SELECT section, data FROM content WHERE data LIKE '%backgroundImage%';
