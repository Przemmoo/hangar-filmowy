-- Migration: Add year field to movies table
-- Date: 2026-05-12
-- Description: Add production year to movie catalog

ALTER TABLE movies ADD COLUMN year INTEGER;

-- Optional: Add index for year-based filtering/sorting
CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(year);
