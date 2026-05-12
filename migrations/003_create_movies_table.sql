-- Migration: Create movies catalog table
-- Date: 2026-05-12
-- Description: Table for storing movie catalog with title, category, description, and distributor

CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  distributor TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Index for searching by title
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_movies_category ON movies(category);
