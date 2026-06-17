-- ============================================================
-- EduLivre — Schema SQL para Supabase (PostgreSQL)
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- ── Extensão UUID ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Tabela: users ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  avatar        TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabela: courses ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  category     TEXT DEFAULT 'Geral',
  thumbnail    TEXT DEFAULT '📚',
  color        TEXT DEFAULT '#8b5cf6',
  teacher_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  teacher_name TEXT,
  workload     TEXT DEFAULT '20h',
  level        TEXT DEFAULT 'Iniciante',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabela: lessons ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  duration    TEXT DEFAULT '',
  video_url   TEXT DEFAULT '',
  pdf_url     TEXT DEFAULT '',
  description TEXT DEFAULT '',
  position    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabela: progress ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id    UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id    UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- ── Tabela: certificates ────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id         TEXT PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id  UUID REFERENCES courses(id) ON DELETE CASCADE,
  issued_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ── Tabela: favorites ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id)
);

-- ── Tabela: quiz_results ────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_results (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  score       INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ── Tabela: password_reset_tokens ───────────────────────────
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security (desabilitado para acesso via service_role) ──
ALTER TABLE users                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses                DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons                DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress               DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates           DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites              DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results           DISABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens  DISABLE ROW LEVEL SECURITY;

-- ── Storage bucket para avatares ────────────────────────────
-- Execute via Dashboard: Storage > New Bucket > "avatars" > Public: true
-- OU via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ── Seed: contas demo ────────────────────────────────────────
-- Senha "123456" com bcrypt (custo 10) — gerar no backend ou usar:
-- INSERT INTO users (id, name, email, password_hash, role)
-- VALUES
--   ('00000000-0000-0000-0000-000000000001', 'Aluno Demo',     'aluno@edulivre.com', '<hash>', 'student'),
--   ('00000000-0000-0000-0000-000000000002', 'Professor Demo', 'prof@edulivre.com',  '<hash>', 'teacher');
-- O seed real é feito via: node backend/scripts/seed.js
