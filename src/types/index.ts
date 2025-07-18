export interface User {
  id: string;
  name: string;
  email: string;
  role: 'bricklayer' | 'project_manager' | 'recruiter';
  phone?: string;
  assignedProjects?: string[];
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
  preferences?: {
    language: string;
    theme: string;
    notifications: boolean;
  };
}

export interface Project {
  id: string;
  name: string;
  address: string;
  description: string;
  brickCountRequired: number;
  brickCountUsed: number;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'delayed' | 'completed';
  assignedBricklayers: string[];
  managerId: string;
  materials: Material[];
  roadmap: RoadmapStep[];
  brickType: string;
  bricksPerSqm: number;
  costPerBrick: number;
  expectedCost: number;
  expectedRevenue: number;
}

export interface RoadmapStep {
  phase: string;
  status: 'completed' | 'active' | 'pending' | 'in_review' | 'delayed';
}

export interface Material {
  id: string;
  projectId: string;
  type: string;
  quantityAvailable: number;
  quantityUsed: number;
  unit: string;
  lastUpdated: string;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  certifications: string;
  message: string;
  cvUrl?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  submittedDate: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}