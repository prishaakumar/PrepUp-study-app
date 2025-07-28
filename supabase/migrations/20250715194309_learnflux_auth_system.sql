-- Location: supabase/migrations/20250715194309_learnflux_auth_system.sql
-- LearnFlux Authentication and User Management System

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('student', 'tutor', 'admin');
CREATE TYPE public.study_session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.quiz_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE public.mood_type AS ENUM ('excellent', 'good', 'neutral', 'stressed', 'overwhelmed');
CREATE TYPE public.subject_category AS ENUM ('mathematics', 'physics', 'chemistry', 'biology', 'english', 'history', 'computer_science', 'other');

-- 2. User Profiles Table (Critical intermediary for PostgREST)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role,
    grade_level INTEGER,
    school_name TEXT,
    timezone TEXT DEFAULT 'UTC',
    study_goal_minutes INTEGER DEFAULT 240,
    current_streak INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    profile_picture_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Study Sessions Table
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject public.subject_category NOT NULL,
    topic TEXT NOT NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status public.study_session_status DEFAULT 'scheduled'::public.study_session_status,
    progress_percentage INTEGER DEFAULT 0,
    actual_duration_minutes INTEGER,
    xp_earned INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Quiz Results Table
CREATE TABLE public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject public.subject_category NOT NULL,
    topic TEXT NOT NULL,
    difficulty public.quiz_difficulty NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_taken_seconds INTEGER,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. User Progress Table
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject public.subject_category NOT NULL,
    total_study_minutes INTEGER DEFAULT 0,
    total_quizzes_completed INTEGER DEFAULT 0,
    average_quiz_score DECIMAL(5,2) DEFAULT 0.00,
    progress_percentage INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subject)
);

-- 6. Wellness Tracking Table
CREATE TABLE public.wellness_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    mood public.mood_type NOT NULL,
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    focus_level INTEGER CHECK (focus_level >= 1 AND focus_level <= 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Achievements Table
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    xp_reward INTEGER DEFAULT 0,
    requirements JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. User Achievements Table
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- 9. Essential Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_study_sessions_scheduled_time ON public.study_sessions(scheduled_time);
CREATE INDEX idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX idx_quiz_results_subject ON public.quiz_results(subject);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_wellness_entries_user_id ON public.wellness_entries(user_id);
CREATE INDEX idx_wellness_entries_created_at ON public.wellness_entries(created_at);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);

-- 10. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 11. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = profile_id AND up.id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_study_session(session_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.study_sessions ss
    WHERE ss.id = session_id AND ss.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_quiz_result(result_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.quiz_results qr
    WHERE qr.id = result_id AND qr.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_user_data(data_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT data_user_id = auth.uid()
$$;

-- 12. Automatic Profile Creation Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- 13. Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 14. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles
FOR ALL TO authenticated
USING (public.is_profile_owner(id))
WITH CHECK (public.is_profile_owner(id));

CREATE POLICY "users_own_study_sessions" ON public.study_sessions
FOR ALL TO authenticated
USING (public.owns_user_data(user_id))
WITH CHECK (public.owns_user_data(user_id));

CREATE POLICY "users_own_quiz_results" ON public.quiz_results
FOR ALL TO authenticated
USING (public.owns_user_data(user_id))
WITH CHECK (public.owns_user_data(user_id));

CREATE POLICY "users_own_progress" ON public.user_progress
FOR ALL TO authenticated
USING (public.owns_user_data(user_id))
WITH CHECK (public.owns_user_data(user_id));

CREATE POLICY "users_own_wellness_entries" ON public.wellness_entries
FOR ALL TO authenticated
USING (public.owns_user_data(user_id))
WITH CHECK (public.owns_user_data(user_id));

CREATE POLICY "achievements_public_read" ON public.achievements
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "users_own_achievements" ON public.user_achievements
FOR ALL TO authenticated
USING (public.owns_user_data(user_id))
WITH CHECK (public.owns_user_data(user_id));

-- 15. Utility Functions
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.user_profiles
    SET current_streak = current_streak + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.award_xp(user_uuid UUID, xp_amount INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.user_profiles
    SET total_xp = total_xp + xp_amount,
        level = CASE 
            WHEN (total_xp + xp_amount) >= 1500 THEN level + 1
            ELSE level
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = user_uuid;
END;
$$;

-- 16. Mock Data with Complete Auth Users
DO $$
DECLARE
    student1_id UUID := gen_random_uuid();
    student2_id UUID := gen_random_uuid();
    tutor1_id UUID := gen_random_uuid();
    achievement1_id UUID := gen_random_uuid();
    achievement2_id UUID := gen_random_uuid();
    achievement3_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (student1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'john@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Smith", "role": "student", "grade_level": "12"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sarah@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "student", "grade_level": "11"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (tutor1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'tutor@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Emily Davis", "role": "tutor"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles with additional data
    UPDATE public.user_profiles
    SET grade_level = 12,
        school_name = 'Lincoln High School',
        current_streak = 7,
        total_xp = 1250,
        level = 8,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = student1_id;

    UPDATE public.user_profiles
    SET grade_level = 11,
        school_name = 'Roosevelt High School',
        current_streak = 3,
        total_xp = 850,
        level = 5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = student2_id;

    -- Create achievements
    INSERT INTO public.achievements (id, name, description, icon, tier, xp_reward, requirements) VALUES
        (achievement1_id, 'Quiz Master', 'Scored 90% or higher on 5 quizzes', 'Brain', 'gold', 100, '{"quiz_count": 5, "min_score": 90}'::jsonb),
        (achievement2_id, 'Consistent Learner', 'Maintained a 7-day study streak', 'Flame', 'silver', 75, '{"streak_days": 7}'::jsonb),
        (achievement3_id, 'Subject Explorer', 'Completed quizzes in 3 different subjects', 'Compass', 'bronze', 50, '{"subjects_count": 3}'::jsonb);

    -- Create study sessions
    INSERT INTO public.study_sessions (user_id, subject, topic, scheduled_time, duration_minutes, status, progress_percentage, actual_duration_minutes, xp_earned) VALUES
        (student1_id, 'mathematics'::public.subject_category, 'Calculus - Derivatives', 
         CURRENT_TIMESTAMP + INTERVAL '1 hour', 45, 'scheduled'::public.study_session_status, 0, NULL, 0),
        (student1_id, 'physics'::public.subject_category, 'Quantum Mechanics', 
         CURRENT_TIMESTAMP + INTERVAL '2 hours', 60, 'scheduled'::public.study_session_status, 0, NULL, 0),
        (student1_id, 'mathematics'::public.subject_category, 'Algebra - Linear Equations', 
         CURRENT_TIMESTAMP - INTERVAL '1 day', 45, 'completed'::public.study_session_status, 100, 42, 30),
        (student2_id, 'chemistry'::public.subject_category, 'Organic Chemistry', 
         CURRENT_TIMESTAMP + INTERVAL '3 hours', 45, 'scheduled'::public.study_session_status, 0, NULL, 0);

    -- Create quiz results
    INSERT INTO public.quiz_results (user_id, subject, topic, difficulty, score, total_questions, time_taken_seconds, xp_earned) VALUES
        (student1_id, 'mathematics'::public.subject_category, 'Algebra', 'medium'::public.quiz_difficulty, 85, 10, 600, 50),
        (student1_id, 'physics'::public.subject_category, 'Mechanics', 'hard'::public.quiz_difficulty, 92, 15, 900, 75),
        (student1_id, 'chemistry'::public.subject_category, 'Acids and Bases', 'medium'::public.quiz_difficulty, 78, 10, 550, 40),
        (student2_id, 'biology'::public.subject_category, 'Cell Structure', 'easy'::public.quiz_difficulty, 88, 12, 480, 35);

    -- Create user progress
    INSERT INTO public.user_progress (user_id, subject, total_study_minutes, total_quizzes_completed, average_quiz_score, progress_percentage) VALUES
        (student1_id, 'mathematics'::public.subject_category, 180, 5, 85.60, 75),
        (student1_id, 'physics'::public.subject_category, 120, 3, 89.33, 60),
        (student1_id, 'chemistry'::public.subject_category, 90, 2, 82.50, 45),
        (student2_id, 'biology'::public.subject_category, 150, 4, 86.75, 70);

    -- Create wellness entries
    INSERT INTO public.wellness_entries (user_id, mood, stress_level, energy_level, focus_level, notes) VALUES
        (student1_id, 'good'::public.mood_type, 4, 7, 8, 'Feeling productive today'),
        (student1_id, 'excellent'::public.mood_type, 2, 9, 9, 'Great study session this morning'),
        (student2_id, 'neutral'::public.mood_type, 6, 5, 6, 'Feeling okay, could use a break');

    -- Create user achievements
    INSERT INTO public.user_achievements (user_id, achievement_id) VALUES
        (student1_id, achievement1_id),
        (student1_id, achievement2_id),
        (student2_id, achievement3_id);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 17. Cleanup Function
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs to delete
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@example.com';

    -- Delete in dependency order
    DELETE FROM public.user_achievements WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.wellness_entries WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_progress WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.quiz_results WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.study_sessions WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.achievements WHERE name IN ('Quiz Master', 'Consistent Learner', 'Subject Explorer');
    
    -- Delete auth.users last
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
    
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;