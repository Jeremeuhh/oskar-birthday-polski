-- ============================================================
-- Supabase SQL Migration — oskar-birthday-polski
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── AUTH CONFIGURATION ──
-- Dans Dashboard → Authentication → Providers :
--   • Activer "Email" provider (activé par défaut)
--   • Désactiver "Confirm email" si tu veux tester rapidement sans email
--   • Ou configurer un SMTP pour les emails de confirmation
-- Pour dev/test rapide : Authentication → Settings → Email Auth → "Disable email confirmation"

-- 1. Enable RLS on all tables
-- (Supabase enables it by default on new tables)

-- ── Accommodations ──

CREATE TABLE IF NOT EXISTS public.accommodations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image_url TEXT,
  price_per_night NUMERIC(10,2),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  city TEXT,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read
CREATE POLICY "accommodations_select"
  ON public.accommodations FOR SELECT
  TO authenticated
  USING (true);

-- Anyone authenticated can insert
CREATE POLICY "accommodations_insert"
  ON public.accommodations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = added_by);

-- Only the creator can delete
CREATE POLICY "accommodations_delete"
  ON public.accommodations FOR DELETE
  TO authenticated
  USING (auth.uid() = added_by);

-- Only the creator can update
CREATE POLICY "accommodations_update"
  ON public.accommodations FOR UPDATE
  TO authenticated
  USING (auth.uid() = added_by)
  WITH CHECK (auth.uid() = added_by);

-- ── Rankings ──

CREATE TABLE IF NOT EXISTS public.rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  accommodation_id UUID REFERENCES public.accommodations(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, accommodation_id)
);

ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read all rankings (needed for aggregation)
CREATE POLICY "rankings_select"
  ON public.rankings FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own rankings
CREATE POLICY "rankings_insert"
  ON public.rankings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own rankings
CREATE POLICY "rankings_update"
  ON public.rankings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own rankings
CREATE POLICY "rankings_delete"
  ON public.rankings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── Comments ──

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  accommodation_id UUID REFERENCES public.accommodations(id) ON DELETE CASCADE NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read comments
CREATE POLICY "comments_select"
  ON public.comments FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own comments
CREATE POLICY "comments_insert"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "comments_delete"
  ON public.comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── (Optional) Database function to get user display name for comments ──

CREATE OR REPLACE FUNCTION public.get_user_name(uid UUID)
RETURNS TEXT AS $$
  SELECT COALESCE(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    email,
    'Anonyme'
  )
  FROM auth.users
  WHERE id = uid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ── View for comments with user info ──

CREATE OR REPLACE VIEW public.comments_with_user AS
SELECT
  c.*,
  public.get_user_name(c.user_id) AS user_name
FROM public.comments c;
