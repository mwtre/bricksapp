-- BricksApp Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('bricklayer', 'project_manager', 'recruiter')) NOT NULL,
    phone TEXT,
    avatar TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{"language": "en", "theme": "light", "notifications": true}'::jsonb
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    brick_count_required INTEGER NOT NULL,
    brick_count_used INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT CHECK (status IN ('planning', 'active', 'delayed', 'completed')) DEFAULT 'planning',
    manager_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    brick_type TEXT,
    bricks_per_sqm INTEGER,
    cost_per_brick DECIMAL(10,2),
    expected_cost DECIMAL(12,2),
    expected_revenue DECIMAL(12,2),
    roadmap JSONB DEFAULT '[]'::jsonb,
    materials JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project assignments table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.project_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience INTEGER NOT NULL,
    certifications TEXT,
    message TEXT,
    cv_url TEXT,
    status TEXT CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')) DEFAULT 'pending',
    submitted_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON public.projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id ON public.project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_user_id ON public.project_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_date ON public.applications(submitted_date);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Project managers can create users" ON public.users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'project_manager'
        )
    );

-- Create RLS policies for projects table
CREATE POLICY "Users can view all projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Project managers can create projects" ON public.projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'project_manager'
        )
    );

CREATE POLICY "Project managers can update their projects" ON public.projects
    FOR UPDATE USING (
        manager_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'project_manager'
        )
    );

CREATE POLICY "Project managers can delete their projects" ON public.projects
    FOR DELETE USING (
        manager_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'project_manager'
        )
    );

-- Create RLS policies for project assignments table
CREATE POLICY "Users can view project assignments" ON public.project_assignments
    FOR SELECT USING (true);

CREATE POLICY "Project managers can manage assignments" ON public.project_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'project_manager'
        )
    );

-- Create RLS policies for applications table
CREATE POLICY "Recruiters can view all applications" ON public.applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'recruiter'
        )
    );

CREATE POLICY "Anyone can create applications" ON public.applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Recruiters can update applications" ON public.applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'recruiter'
        )
    );

-- Insert sample data
INSERT INTO public.users (email, name, role, phone) VALUES
    ('lars@bricksapp.dk', 'Lars Nielsen', 'bricklayer', '+45 12 34 56 78'),
    ('mette@bricksapp.dk', 'Mette Hansen', 'project_manager', '+45 87 65 43 21'),
    ('thomas@bricksapp.dk', 'Thomas Andersen', 'bricklayer', '+45 23 45 67 89'),
    ('anne@bricksapp.dk', 'Anne Petersen', 'recruiter', '+45 98 76 54 32')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO public.projects (name, address, description, brick_count_required, brick_count_used, start_date, end_date, status, manager_id, brick_type, bricks_per_sqm, cost_per_brick, expected_cost, expected_revenue) VALUES
    ('Københavns Nye Boligkompleks', 'Vesterbrogade 123, 1620 København V', 'Moderne boligkompleks med 120 lejligheder', 50000, 32000, '2024-01-15', '2024-06-30', 'active', (SELECT id FROM public.users WHERE email = 'mette@bricksapp.dk'), 'Rød Blødstrøgen RT 215', 64, 4.50, 225000, 310000),
    ('Aarhus Kontorhus', 'Åboulevarden 45, 8000 Aarhus C', 'Moderne kontorhus med 8 etager', 35000, 8000, '2024-02-01', '2024-08-15', 'active', (SELECT id FROM public.users WHERE email = 'mette@bricksapp.dk'), 'Gul Håndstrøgen B542', 58, 5.20, 182000, 250000),
    ('Odense Skole Renovering', 'Skolegade 12, 5000 Odense C', 'Omfattende renovering af historisk skolebygning', 15000, 12000, '2024-01-01', '2024-04-30', 'delayed', (SELECT id FROM public.users WHERE email = 'mette@bricksapp.dk'), 'Gammel Dansk Mursten', 71, 8.00, 120000, 165000)
ON CONFLICT DO NOTHING;

-- Insert sample applications
INSERT INTO public.applications (name, email, phone, experience, certifications, message, status, submitted_date) VALUES
    ('Jens Mortensen', 'jens@email.dk', '+45 12 34 56 78', 8, 'Faglig uddannelse som murer, AMU kurser', 'Jeg har stor erfaring med forskellige murprojekter og er interesseret i at blive en del af jeres team.', 'pending', '2024-01-18'),
    ('Sofie Larsen', 'sofie@email.dk', '+45 87 65 43 21', 3, 'Grundforløb bygge og anlæg, Hovedforløb murer', 'Nyuddannet murer søger spændende projekter i København området.', 'reviewed', '2024-01-15')
ON CONFLICT DO NOTHING; 