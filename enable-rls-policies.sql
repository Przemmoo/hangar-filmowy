-- ==============================================
-- WŁĄCZENIE ROW LEVEL SECURITY (RLS)
-- ==============================================
-- Ten skrypt zabezpiecza wszystkie publiczne tabele
-- przed nieautoryzowanym dostępem
-- ==============================================

-- Włącz RLS na wszystkich tabelach
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_replies ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- POLITYKI DLA TABELI: users
-- ==============================================
-- Tylko admini mogą zarządzać użytkownikami

-- Usuń istniejące polityki (jeśli istnieją)
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin can update users" ON public.users;
DROP POLICY IF EXISTS "Admin can delete users" ON public.users;

-- Admini mogą wszystko
CREATE POLICY "Admin can view all users" ON public.users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can insert users" ON public.users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can update users" ON public.users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can delete users" ON public.users
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

-- ==============================================
-- POLITYKI DLA TABELI: form_submissions
-- ==============================================
-- Tylko admini mogą zarządzać zgłoszeniami

DROP POLICY IF EXISTS "Admin can view submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Admin can update submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Admin can delete submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Public can create submissions" ON public.form_submissions;

-- Admini mogą wszystko
CREATE POLICY "Admin can view submissions" ON public.form_submissions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can update submissions" ON public.form_submissions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can delete submissions" ON public.form_submissions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

-- Publiczny dostęp do tworzenia zgłoszeń (formularz kontaktowy)
CREATE POLICY "Public can create submissions" ON public.form_submissions
    FOR INSERT
    WITH CHECK (true);

-- ==============================================
-- POLITYKI DLA TABELI: submission_replies
-- ==============================================
-- Tylko admini mogą zarządzać odpowiedziami

DROP POLICY IF EXISTS "Admin can view replies" ON public.submission_replies;
DROP POLICY IF EXISTS "Admin can create replies" ON public.submission_replies;
DROP POLICY IF EXISTS "Admin can delete replies" ON public.submission_replies;

CREATE POLICY "Admin can view replies" ON public.submission_replies
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can create replies" ON public.submission_replies
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can delete replies" ON public.submission_replies
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

-- ==============================================
-- POLITYKI DLA TABELI: media
-- ==============================================
-- Tylko admini mogą zarządzać mediami

DROP POLICY IF EXISTS "Admin can view media" ON public.media;
DROP POLICY IF EXISTS "Admin can insert media" ON public.media;
DROP POLICY IF EXISTS "Admin can update media" ON public.media;
DROP POLICY IF EXISTS "Admin can delete media" ON public.media;
DROP POLICY IF EXISTS "Public can view media" ON public.media;

-- Publiczny dostęp do odczytu mediów (dla frontendu)
CREATE POLICY "Public can view media" ON public.media
    FOR SELECT
    USING (true);

-- Admini mogą zarządzać mediami
CREATE POLICY "Admin can insert media" ON public.media
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can update media" ON public.media
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can delete media" ON public.media
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

-- ==============================================
-- POLITYKI DLA TABELI: content
-- ==============================================
-- Tylko admini mogą edytować, wszyscy mogą czytać

DROP POLICY IF EXISTS "Admin can manage content" ON public.content;
DROP POLICY IF EXISTS "Admin can update content" ON public.content;
DROP POLICY IF EXISTS "Admin can delete content" ON public.content;
DROP POLICY IF EXISTS "Public can view content" ON public.content;

-- Publiczny dostęp do odczytu treści
CREATE POLICY "Public can view content" ON public.content
    FOR SELECT
    USING (true);

-- Admini mogą zarządzać treścią
CREATE POLICY "Admin can manage content" ON public.content
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can update content" ON public.content
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can delete content" ON public.content
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

-- ==============================================
-- POLITYKI DLA TABELI: settings
-- ==============================================
-- Tylko admini mogą zarządzać ustawieniami

DROP POLICY IF EXISTS "Admin can view settings" ON public.settings;
DROP POLICY IF EXISTS "Admin can manage settings" ON public.settings;
DROP POLICY IF EXISTS "Admin can update settings" ON public.settings;
DROP POLICY IF EXISTS "Admin can delete settings" ON public.settings;
DROP POLICY IF EXISTS "Public can view settings" ON public.settings;

-- Publiczny dostęp do odczytu ustawień (jeśli potrzebne na frontendzie)
CREATE POLICY "Public can view settings" ON public.settings
    FOR SELECT
    USING (true);

-- Admini mogą zarządzać ustawieniami
CREATE POLICY "Admin can manage settings" ON public.settings
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can update settings" ON public.settings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can delete settings" ON public.settings
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text
            AND role = 'admin'
        )
    );

-- ==============================================
-- WERYFIKACJA
-- ==============================================
-- Sprawdź czy RLS jest włączony na wszystkich tabelach:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- 
-- Zobacz listę polityk:
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
