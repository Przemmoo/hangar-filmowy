-- Cloudflare D1 Schema (SQLite)
-- Migration from Supabase PostgreSQL

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Table: form_submissions
CREATE TABLE IF NOT EXISTS form_submissions (
    id TEXT PRIMARY KEY NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    eventType TEXT NOT NULL,
    audienceSize INTEGER NOT NULL,
    extras TEXT NOT NULL, -- JSON as TEXT in SQLite
    estimatedLevel TEXT NOT NULL,
    preferredDate TEXT, -- DATE as TEXT in SQLite (ISO 8601 format)
    status TEXT NOT NULL DEFAULT 'NEW',
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Table: media
CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY NOT NULL,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    alt TEXT,
    size INTEGER NOT NULL,
    mimeType TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    uploadedBy TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Table: content
CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY NOT NULL,
    section TEXT NOT NULL UNIQUE,
    data TEXT NOT NULL, -- JSON as TEXT in SQLite
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedBy TEXT NOT NULL
);

-- Table: settings
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL, -- JSON as TEXT in SQLite
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedBy TEXT NOT NULL
);

-- Table: submission_replies
CREATE TABLE IF NOT EXISTS submission_replies (
    id TEXT PRIMARY KEY NOT NULL,
    submissionId TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    sentBy TEXT NOT NULL,
    sentByName TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_submission_replies_submissionId 
    ON submission_replies(submissionId);

CREATE INDEX IF NOT EXISTS idx_form_submissions_status 
    ON form_submissions(status);

CREATE INDEX IF NOT EXISTS idx_form_submissions_createdAt 
    ON form_submissions(createdAt DESC);

CREATE INDEX IF NOT EXISTS idx_media_createdAt 
    ON media(createdAt DESC);
