import { supabase, TABLES, isSupabaseAvailable } from '../lib/supabase';
import { User, Project, Application, Material } from '../types';

// User Management
export const userService = {
  // Get all users
  async getUsers(): Promise<User[]> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning empty users array');
      return [];
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning null for getUserById');
      return null;
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning null for getUserByEmail');
      return null;
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new user
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, creating mock user');
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...user
      };
      return mockUser;
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning mock updated user');
      return { id, ...updates } as User;
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, skipping deleteUser');
      return;
    }

    const { error } = await supabase
      .from(TABLES.USERS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Subscribe to user changes
  subscribeToUsers(callback: (users: User[]) => void) {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, skipping subscription');
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('users')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: TABLES.USERS },
        () => {
          this.getUsers().then(callback);
        }
      )
      .subscribe();
  }
};

// Project Management
export const projectService = {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning empty projects array');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error getting projects:', error);
        throw error;
      }

      console.log('Raw projects data from Supabase:', data);

      // Transform snake_case to camelCase
      const transformedProjects: Project[] = (data || []).map((project: any) => ({
        id: project.id,
        name: project.name,
        address: project.address,
        description: project.description,
        brickCountRequired: project.brick_count_required,
        brickCountUsed: project.brick_count_used,
        startDate: project.start_date,
        endDate: project.end_date,
        status: project.status,
        managerId: project.manager_id,
        brickType: project.brick_type,
        bricksPerSqm: project.bricks_per_sqm,
        costPerBrick: project.cost_per_brick,
        expectedCost: project.expected_cost,
        expectedRevenue: project.expected_revenue,
        assignedBricklayers: [], // Will be populated separately
        roadmap: project.roadmap || [],
        materials: project.materials || []
      }));

      console.log('Transformed projects:', transformedProjects);
      return transformedProjects;
    } catch (error) {
      console.error('Error in getProjects:', error);
      throw error;
    }
  },

  // Get project by ID
  async getProjectById(id: string): Promise<Project | null> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning null for getProjectById');
      return null;
    }

    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select(`
        *,
        assigned_bricklayers:project_assignments(user_id)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        ...data,
        assignedBricklayers: data.assigned_bricklayers?.map((a: any) => a.user_id) || [],
        materials: data.materials || []
      };
    }
    
    return null;
  },

  // Create new project
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, creating mock project');
      const mockProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        ...project
      };
      return mockProject;
    }

    try {
      // Handle manager_id - if it's not a UUID, try to find a real user
      let managerId = project.managerId;
      
      // Check if managerId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(managerId)) {
        console.log('Manager ID is not a valid UUID, trying to find a real user');
        
        // Try to find a project manager in the database
        const { data: users, error: usersError } = await supabase
          .from(TABLES.USERS)
          .select('id')
          .eq('role', 'project_manager')
          .limit(1);
        
        if (usersError) {
          console.error('Error finding project manager:', usersError);
          throw new Error('Could not find a valid project manager');
        }
        
        if (users && users.length > 0) {
          managerId = users[0].id;
          console.log('Using found project manager ID:', managerId);
        } else {
          // If no project manager found, use a fallback UUID (this should not happen in production)
          managerId = '00000000-0000-0000-0000-000000000001';
          console.log('No project manager found, using fallback ID:', managerId);
        }
      }

      // Transform camelCase to snake_case for database
      const projectData = {
        name: project.name,
        address: project.address,
        description: project.description,
        brick_count_required: project.brickCountRequired,
        brick_count_used: project.brickCountUsed,
        start_date: project.startDate,
        end_date: project.endDate,
        status: project.status,
        manager_id: managerId,
        brick_type: project.brickType,
        bricks_per_sqm: project.bricksPerSqm,
        cost_per_brick: project.costPerBrick,
        expected_cost: project.expectedCost,
        expected_revenue: project.expectedRevenue,
        roadmap: project.roadmap,
        materials: project.materials
      };

      console.log('Inserting project data:', projectData);
      console.log('Manager ID being used:', managerId);

      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .insert([projectData])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error creating project:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Project created successfully:', data);
      
      // Transform back to camelCase for the frontend
      const transformedProject: Project = {
        id: data.id,
        name: data.name,
        address: data.address,
        description: data.description,
        brickCountRequired: data.brick_count_required,
        brickCountUsed: data.brick_count_used,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status,
        managerId: data.manager_id,
        brickType: data.brick_type,
        bricksPerSqm: data.bricks_per_sqm,
        costPerBrick: data.cost_per_brick,
        expectedCost: data.expected_cost,
        expectedRevenue: data.expected_revenue,
        assignedBricklayers: [], // Will be populated separately
        roadmap: data.roadmap || [],
        materials: data.materials || []
      };

      return transformedProject;
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  // Update project
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning mock updated project');
      return { id, ...updates } as Project;
    }

    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .update({
        ...updates,
        assignedBricklayers: undefined,
        materials: undefined
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update project assignments if provided
    if (updates.assignedBricklayers && supabase) {
      // Delete existing assignments
      await supabase
        .from(TABLES.PROJECT_ASSIGNMENTS)
        .delete()
        .eq('project_id', id);
      
      // Create new assignments
      if (updates.assignedBricklayers.length > 0) {
        const assignments = updates.assignedBricklayers.map(userId => ({
          project_id: id,
          user_id: userId
        }));
        
        await supabase
          .from(TABLES.PROJECT_ASSIGNMENTS)
          .insert(assignments);
      }
    }
    
    return {
      ...data,
      assignedBricklayers: updates.assignedBricklayers || [],
      materials: updates.materials || []
    };
  },

  // Delete project
  async deleteProject(id: string): Promise<void> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, skipping deleteProject');
      return;
    }

    // Delete project assignments first
    await supabase
      .from(TABLES.PROJECT_ASSIGNMENTS)
      .delete()
      .eq('project_id', id);
    
    // Delete project
    const { error } = await supabase
      .from(TABLES.PROJECTS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Subscribe to project changes
  subscribeToProjects(callback: (projects: Project[]) => void) {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, skipping project subscription');
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: TABLES.PROJECTS },
        () => {
          this.getProjects().then(callback);
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: TABLES.PROJECT_ASSIGNMENTS },
        () => {
          this.getProjects().then(callback);
        }
      )
      .subscribe();
  }
};

// Application Management
export const applicationService = {
  // Get all applications
  async getApplications(): Promise<Application[]> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning empty applications array');
      return [];
    }

    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .select('*')
      .order('submitted_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get application by ID
  async getApplicationById(id: string): Promise<Application | null> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning null for getApplicationById');
      return null;
    }

    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new application
  async createApplication(application: Omit<Application, 'id' | 'submittedDate' | 'status'>): Promise<Application> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, creating mock application');
      const mockApplication: Application = {
        id: Math.random().toString(36).substr(2, 9),
        ...application,
        submittedDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      return mockApplication;
    }

    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .insert([{
        ...application,
        submitted_date: new Date().toISOString().split('T')[0],
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update application status
  async updateApplicationStatus(id: string, status: Application['status']): Promise<Application> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning mock updated application');
      return { id, status } as Application;
    }

    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete application
  async deleteApplication(id: string): Promise<void> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, skipping deleteApplication');
      return;
    }

    const { error } = await supabase
      .from(TABLES.APPLICATIONS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Subscribe to application changes
  subscribeToApplications(callback: (applications: Application[]) => void) {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, skipping application subscription');
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('applications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: TABLES.APPLICATIONS },
        () => {
          this.getApplications().then(callback);
        }
      )
      .subscribe();
  }
};

// Worker Management
export const workerService = {
  // Get all active workers
  async getWorkers(): Promise<any[]> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning empty workers array');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.WORKERS)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error getting workers:', error);
        throw error;
      }

      console.log('Raw workers data from Supabase:', data);

      // Transform snake_case to camelCase and parse JSON fields
      const transformedWorkers = (data || []).map((worker: any) => ({
        id: worker.id,
        applicationId: worker.application_id,
        userId: worker.user_id,
        name: worker.name,
        photo: worker.photo,
        phone: worker.phone,
        email: worker.email,
        skills: worker.skills || [],
        yearsExperience: worker.years_experience,
        location: worker.location,
        availability: worker.availability || { status: 'available' },
        portfolio: worker.portfolio || [],
        rating: worker.rating || 0,
        completedProjects: worker.completed_projects || 0,
        hourlyRateMin: worker.hourly_rate_min,
        hourlyRateMax: worker.hourly_rate_max,
        isActive: worker.is_active,
        isVerified: worker.is_verified,
        createdAt: worker.created_at,
        updatedAt: worker.updated_at
      }));

      console.log('Transformed workers:', transformedWorkers);
      return transformedWorkers;
    } catch (error) {
      console.error('Error in getWorkers:', error);
      throw error;
    }
  },

  // Get worker by ID
  async getWorkerById(id: string): Promise<any | null> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning null for getWorkerById');
      return null;
    }

    const { data, error } = await supabase
      .from(TABLES.WORKERS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        id: data.id,
        applicationId: data.application_id,
        userId: data.user_id,
        name: data.name,
        photo: data.photo,
        phone: data.phone,
        email: data.email,
        skills: data.skills || [],
        yearsExperience: data.years_experience,
        location: data.location,
        availability: data.availability || { status: 'available' },
        portfolio: data.portfolio || [],
        rating: data.rating || 0,
        completedProjects: data.completed_projects || 0,
        hourlyRateMin: data.hourly_rate_min,
        hourlyRateMax: data.hourly_rate_max,
        isActive: data.is_active,
        isVerified: data.is_verified,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    }
    
    return null;
  },

  // Create worker from approved application
  async createWorkerFromApplication(applicationId: string, workerData: any): Promise<any> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, creating mock worker');
      return { id: Math.random().toString(36).substr(2, 9), ...workerData };
    }

    const { data, error } = await supabase
      .from(TABLES.WORKERS)
      .insert([{
        application_id: applicationId,
        name: workerData.name,
        photo: workerData.photo,
        phone: workerData.phone,
        email: workerData.email,
        skills: workerData.skills,
        years_experience: workerData.yearsExperience,
        location: workerData.location,
        availability: workerData.availability,
        portfolio: workerData.portfolio,
        rating: workerData.rating,
        completed_projects: workerData.completedProjects,
        hourly_rate_min: workerData.hourlyRateMin,
        hourly_rate_max: workerData.hourlyRateMax,
        is_verified: workerData.isVerified
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update worker
  async updateWorker(id: string, updates: any): Promise<any> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, returning mock updated worker');
      return { id, ...updates };
    }

    const { data, error } = await supabase
      .from(TABLES.WORKERS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete worker (soft delete by setting is_active to false)
  async deleteWorker(id: string): Promise<void> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, skipping deleteWorker');
      return;
    }

    const { error } = await supabase
      .from(TABLES.WORKERS)
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Subscribe to worker changes
  subscribeToWorkers(callback: (workers: any[]) => void) {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, skipping subscription');
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('workers')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: TABLES.WORKERS },
        () => {
          this.getWorkers().then(callback);
        }
      )
      .subscribe();
  }
};

// Company Candidate Request Service
export const companyRequestService = {
  // Create a request from company to recruiter
  async createRequest(companyId: string, workerId: string, companyNotes?: string): Promise<any> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, creating mock request');
      return { id: Math.random().toString(36).substr(2, 9), companyId, workerId, status: 'pending' };
    }

    const { data, error } = await supabase
      .from(TABLES.COMPANY_CANDIDATE_REQUESTS)
      .insert([{
        company_id: companyId,
        worker_id: workerId,
        status: 'pending',
        company_notes: companyNotes
      }])
      .select()
      .single();
    
    if (error) throw error;
    return this.transformRequest(data);
  },

  // Get all requests
  async getRequests(status?: string): Promise<any[]> {
    if (!isSupabaseAvailable() || !supabase) {
      return [];
    }

    let query = supabase.from(TABLES.COMPANY_CANDIDATE_REQUESTS).select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(this.transformRequest);
  },

  // Update request status
  async updateRequestStatus(requestId: string, status: string, notes?: string): Promise<any> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, mock update');
      return { id: requestId, status };
    }

    const updateData: any = { status };
    
    if (status === 'sent_to_candidate') {
      updateData.sent_to_candidate_at = new Date().toISOString();
      updateData.recruiter_notes = notes;
    } else if (status === 'candidate_confirmed' || status === 'candidate_rejected') {
      updateData.candidate_responded_at = new Date().toISOString();
      updateData.candidate_notes = notes;
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from(TABLES.COMPANY_CANDIDATE_REQUESTS)
      .update(updateData)
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) throw error;
    return this.transformRequest(data);
  },

  // Transform snake_case to camelCase
  transformRequest(data: any): any {
    return {
      id: data.id,
      companyId: data.company_id,
      workerId: data.worker_id,
      status: data.status,
      recruiterNotes: data.recruiter_notes,
      candidateNotes: data.candidate_notes,
      companyNotes: data.company_notes,
      requestedAt: data.requested_at,
      sentToCandidateAt: data.sent_to_candidate_at,
      candidateRespondedAt: data.candidate_responded_at,
      completedAt: data.completed_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Subscribe to real-time updates
  subscribeToRequests(callback: (requests: any[]) => void) {
    if (!isSupabaseAvailable() || !supabase) {
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('company_requests')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: TABLES.COMPANY_CANDIDATE_REQUESTS },
        () => {
          this.getRequests().then(callback);
        }
      )
      .subscribe();
  }
};

// Job Offer Submission Service
export const jobOfferSubmissionService = {
  // Create a job offer submission from company
  async createSubmission(companyId: string, jobData: {
    title: string;
    category: string;
    location: string;
    description?: string;
    requirements?: string;
  }): Promise<any> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, creating mock submission');
      return { id: Math.random().toString(36).substr(2, 9), companyId, ...jobData, status: 'pending' };
    }

    const { data, error } = await supabase
      .from(TABLES.JOB_OFFER_SUBMISSIONS)
      .insert([{
        company_id: companyId,
        ...jobData,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return this.transformSubmission(data);
  },

  // Get all submissions
  async getSubmissions(status?: string): Promise<any[]> {
    if (!isSupabaseAvailable() || !supabase) {
      return [];
    }

    let query = supabase.from(TABLES.JOB_OFFER_SUBMISSIONS).select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(this.transformSubmission);
  },

  // Update submission status (approve/reject/publish)
  async updateSubmissionStatus(submissionId: string, status: string, notes?: string): Promise<any> {
    if (!isSupabaseAvailable() || !supabase) {
      console.log('Supabase not available, mock update');
      return { id: submissionId, status };
    }

    const updateData: any = { status, recruiter_notes: notes };
    
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString();
    } else if (status === 'rejected') {
      updateData.rejected_at = new Date().toISOString();
    } else if (status === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from(TABLES.JOB_OFFER_SUBMISSIONS)
      .update(updateData)
      .eq('id', submissionId)
      .select()
      .single();
    
    if (error) throw error;
    return this.transformSubmission(data);
  },

  // Transform snake_case to camelCase
  transformSubmission(data: any): any {
    return {
      id: data.id,
      companyId: data.company_id,
      title: data.title,
      category: data.category,
      location: data.location,
      description: data.description,
      requirements: data.requirements,
      status: data.status,
      recruiterNotes: data.recruiter_notes,
      createdAt: data.created_at,
      approvedAt: data.approved_at,
      rejectedAt: data.rejected_at,
      publishedAt: data.published_at,
      updatedAt: data.updated_at
    };
  },

  // Subscribe to real-time updates
  subscribeToSubmissions(callback: (submissions: any[]) => void) {
    if (!isSupabaseAvailable() || !supabase) {
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('job_offer_submissions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: TABLES.JOB_OFFER_SUBMISSIONS },
        () => {
          this.getSubmissions().then(callback);
        }
      )
      .subscribe();
  }
};

// Email Service (Mock for now - can be replaced with Supabase Edge Function)
export const emailService = {
  async sendLoginCredentials(name: string, email: string): Promise<{ email: string; password: string }> {
    // Generate email from name
    const nameParts = name.toLowerCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1] || firstName;
    const generatedEmail = `${firstName}.${lastName}@expatheros.nl`;
    
    // Generate random password
    const password = `ExpatHero${Math.floor(Math.random() * 10000)}!`;
    
    // In production, this would call Supabase Edge Function to send email
    console.log(`📧 Email would be sent to ${email} with login credentials:`);
    console.log(`   Email: ${generatedEmail}`);
    console.log(`   Password: ${password}`);
    
    // TODO: Create user in Supabase auth with these credentials
    
    return { email: generatedEmail, password };
  }
}; 