-- Run once in the Neon SQL Editor before deploying. Existing data is preserved.
BEGIN;

CREATE TABLE IF NOT EXISTS vanta_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vanta_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES vanta_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vanta_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES vanta_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  gradient TEXT NOT NULL,
  is_kids BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vanta_watchlist (
  profile_id TEXT NOT NULL REFERENCES vanta_profiles(id) ON DELETE CASCADE,
  media_key TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (profile_id, media_key)
);

CREATE TABLE IF NOT EXISTS vanta_preferences (
  profile_id TEXT PRIMARY KEY REFERENCES vanta_profiles(id) ON DELETE CASCADE,
  autoplay BOOLEAN NOT NULL DEFAULT TRUE,
  previews BOOLEAN NOT NULL DEFAULT TRUE,
  emails BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vanta_sessions_user_idx ON vanta_sessions(user_id);

CREATE INDEX IF NOT EXISTS vanta_profiles_user_idx ON vanta_profiles(user_id);

COMMIT;
