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