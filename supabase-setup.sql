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

-- Create workers table for recruitment portal
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    photo TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb,
    years_experience INTEGER NOT NULL,
    location TEXT NOT NULL,
    availability JSONB DEFAULT '{"status": "available", "availableFrom": null, "notes": ""}'::jsonb,
    portfolio JSONB DEFAULT '[]'::jsonb,
    rating DECIMAL(3,2) DEFAULT 0.0,
    completed_projects INTEGER DEFAULT 0,
    hourly_rate_min DECIMAL(10,2),
    hourly_rate_max DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON public.projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id ON public.project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_user_id ON public.project_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_date ON public.applications(submitted_date);
CREATE INDEX IF NOT EXISTS idx_workers_location ON public.workers(location);
CREATE INDEX IF NOT EXISTS idx_workers_availability ON public.workers USING GIN(availability);
CREATE INDEX IF NOT EXISTS idx_workers_skills ON public.workers USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_workers_is_active ON public.workers(is_active);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for workers table
CREATE POLICY "Anyone can view active workers" ON public.workers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Recruiters can view all workers" ON public.workers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'recruiter'
        )
    );

CREATE POLICY "Recruiters can create workers" ON public.workers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'recruiter'
        )
    );

CREATE POLICY "Recruiters can update workers" ON public.workers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'recruiter'
        )
    );

CREATE POLICY "Workers can update their own profile" ON public.workers
    FOR UPDATE USING (user_id = auth.uid());

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

-- Insert sample workers (approved applications converted to workers)
INSERT INTO public.workers (application_id, name, photo, phone, email, skills, years_experience, location, availability, portfolio, rating, completed_projects, hourly_rate_min, hourly_rate_max, is_verified) VALUES
    (
        (SELECT id FROM public.applications WHERE email = 'jens@email.dk'),
        'Jens Mortensen',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        '+45 12 34 56 78',
        'jens@email.dk',
        '[{"name": "Bricklaying", "level": 95, "icon": "Hammer"}, {"name": "Tiling", "level": 88, "icon": "Award"}, {"name": "Concrete", "level": 82, "icon": "Shield"}]',
        8,
        'København, Denmark',
        '{"status": "available", "availableFrom": "2024-01-15", "notes": "Available for immediate start"}',
        '[{"id": "1", "title": "Modern Office Complex", "description": "Complete brickwork for 12-story office building", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop", "completedDate": "2023-12-15", "client": "Nordic Construction", "skills": ["Bricklaying", "Tiling", "Concrete"]}]',
        4.9,
        45,
        45.00,
        65.00,
        true
    ),
    (
        (SELECT id FROM public.applications WHERE email = 'sofie@email.dk'),
        'Sofie Larsen',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        '+45 87 65 43 21',
        'sofie@email.dk',
        '[{"name": "Bricklaying", "level": 85, "icon": "Hammer"}, {"name": "Tiling", "level": 78, "icon": "Award"}, {"name": "Woodwork", "level": 72, "icon": "Ruler"}]',
        3,
        'Aarhus, Denmark',
        '{"status": "partially-available", "availableFrom": "2024-02-01", "notes": "Available for part-time work"}',
        '[{"id": "2", "title": "Residential Complex", "description": "Brickwork for 50-unit residential project", "image": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop", "completedDate": "2023-11-30", "client": "Housing Development Corp", "skills": ["Bricklaying", "Tiling"]}]',
        4.7,
        23,
        35.00,
        50.00,
        true
    )
ON CONFLICT DO NOTHING; 