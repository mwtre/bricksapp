-- Migration: Workflow Management Tables
-- Run this in your Supabase SQL Editor after the base schema

-- 1. Company Candidate Requests (Company → Recruiter → Candidate → Company)
CREATE TABLE IF NOT EXISTS public.company_candidate_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'sent_to_candidate', 'candidate_confirmed', 'candidate_rejected', 'completed', 'cancelled')) DEFAULT 'pending',
  recruiter_notes TEXT,
  candidate_notes TEXT,
  company_notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_to_candidate_at TIMESTAMP WITH TIME ZONE,
  candidate_responded_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Job Offer Submissions (Company → Recruiter → Published)
CREATE TABLE IF NOT EXISTS public.job_offer_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'published')) DEFAULT 'pending',
  recruiter_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Update applications table to link to job offers
ALTER TABLE public.applications 
  ADD COLUMN IF NOT EXISTS job_offer_id UUID REFERENCES public.job_offer_submissions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source TEXT CHECK (source IN ('direct', 'job_offer', 'header_apply')) DEFAULT 'direct';

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_requests_company_id ON public.company_candidate_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_company_requests_worker_id ON public.company_candidate_requests(worker_id);
CREATE INDEX IF NOT EXISTS idx_company_requests_status ON public.company_candidate_requests(status);
CREATE INDEX IF NOT EXISTS idx_job_offer_submissions_company_id ON public.job_offer_submissions(company_id);
CREATE INDEX IF NOT EXISTS idx_job_offer_submissions_status ON public.job_offer_submissions(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_offer_id ON public.applications(job_offer_id);

-- 5. Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create triggers for updated_at
CREATE TRIGGER update_company_requests_updated_at
  BEFORE UPDATE ON public.company_candidate_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_offer_submissions_updated_at
  BEFORE UPDATE ON public.job_offer_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Row Level Security Policies
-- Company requests: Companies can see their own, Recruiters can see all
ALTER TABLE public.company_candidate_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view their own requests"
  ON public.company_candidate_requests
  FOR SELECT
  USING (
    auth.uid()::text = company_id::text OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'recruiter')
  );

CREATE POLICY "Companies can create requests"
  ON public.company_candidate_requests
  FOR INSERT
  WITH CHECK (
    auth.uid()::text = company_id::text OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'recruiter')
  );

CREATE POLICY "Recruiters can update requests"
  ON public.company_candidate_requests
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'recruiter')
  );

-- Job offer submissions: Companies can see their own, Recruiters can see all
ALTER TABLE public.job_offer_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view their own job offers"
  ON public.job_offer_submissions
  FOR SELECT
  USING (
    auth.uid()::text = company_id::text OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'recruiter')
  );

CREATE POLICY "Companies can create job offers"
  ON public.job_offer_submissions
  FOR INSERT
  WITH CHECK (
    auth.uid()::text = company_id::text OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'recruiter')
  );

CREATE POLICY "Recruiters can update job offers"
  ON public.job_offer_submissions
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()::uuid AND role = 'recruiter')
  );

