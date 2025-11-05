import { User, Project, Material, Application, RoadmapStep } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Lars Nielsen',
    email: 'lars@expatheros.nl',
    role: 'project_manager',
    phone: '+45 12 34 56 78',
    assignedProjects: ['1', '2']
  },
  {
    id: '2',
    name: 'Mette Hansen',
    email: 'mette@expatheros.nl',
    role: 'bricklayer',
    phone: '+45 87 65 43 21'
  },
  {
    id: '3',
    name: 'Thomas Andersen',
    email: 'thomas@expatheros.nl',
    role: 'bricklayer',
    phone: '+45 23 45 67 89',
    assignedProjects: ['1', '3']
  },
  {
    id: '4',
    name: 'Anne Petersen',
    email: 'anne@expatheros.nl',
    role: 'recruiter',
    phone: '+45 98 76 54 32'
  }
];

// User Management
const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('expatheros-users');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
  }
  return mockUsers;
};

const liveUsers: User[] = getStoredUsers();

const saveUsersToStorage = (users: User[]) => {
  try {
    localStorage.setItem('expatheros-users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

export const getUsers = (): User[] => {
  return [...liveUsers];
};

export const addUser = (user: Omit<User, 'id'>) => {
  const newUser: User = {
    ...user,
    id: (liveUsers.length + 1).toString(),
  };
  liveUsers.push(newUser);
  saveUsersToStorage(liveUsers);
  window.dispatchEvent(new CustomEvent('users-updated'));
  return newUser;
};

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Københavns Nye Boligkompleks',
    address: 'Vesterbrogade 123, 1620 København V',
    description: 'Moderne boligkompleks med 120 lejligheder, med fokus på bæredygtige materialer og grønne områder.',
    brickCountRequired: 50000,
    brickCountUsed: 32000,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    status: 'active',
    assignedBricklayers: ['1', '3'],
    managerId: '2',
    materials: [],
    roadmap: [
      { phase: 'Planlægning', status: 'completed' },
      { phase: 'Fundament', status: 'completed' },
      { phase: 'Murværk', status: 'active' },
      { phase: 'Taglægning', status: 'pending' },
      { phase: 'Færdiggørelse', status: 'pending' },
    ],
    brickType: 'Rød Blødstrøgen RT 215',
    bricksPerSqm: 64,
    costPerBrick: 4.5,
    expectedCost: 225000,
    expectedRevenue: 310000,
  },
  {
    id: '2',
    name: 'Aarhus Kontorhus',
    address: 'Åboulevarden 45, 8000 Aarhus C',
    description: 'Moderne kontorhus med 8 etager og fokus på åbne kontorlandskaber og innovative løsninger.',
    brickCountRequired: 35000,
    brickCountUsed: 8000,
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    status: 'active',
    assignedBricklayers: ['1'],
    managerId: '2',
    materials: [],
    roadmap: [
      { phase: 'Planlægning', status: 'completed' },
      { phase: 'Fundament', status: 'active' },
      { phase: 'Murværk', status: 'pending' },
      { phase: 'Vinduer & Facade', status: 'pending' },
      { phase: 'Indvendig', status: 'pending' },
    ],
    brickType: 'Gul Håndstrøgen B542',
    bricksPerSqm: 58,
    costPerBrick: 5.2,
    expectedCost: 182000,
    expectedRevenue: 250000,
  },
  {
    id: '3',
    name: 'Odense Skole Renovering',
    address: 'Skolegade 12, 5000 Odense C',
    description: 'Omfattende renovering af en historisk skolebygning for at bevare arkitekturen og modernisere faciliteterne.',
    brickCountRequired: 15000,
    brickCountUsed: 12000,
    startDate: '2024-01-01',
    endDate: '2024-04-30',
    status: 'delayed',
    assignedBricklayers: ['3'],
    managerId: '2',
    materials: [],
    roadmap: [
      { phase: 'Planlægning', status: 'completed' },
      { phase: 'Nedrivning', status: 'completed' },
      { phase: 'Genopbygning', status: 'active' },
      { phase: 'Restaurering', status: 'delayed' },
      { phase: 'Aflevering', status: 'pending' },
    ],
    brickType: 'Gammel Dansk Mursten',
    bricksPerSqm: 71,
    costPerBrick: 8.0,
    expectedCost: 120000,
    expectedRevenue: 165000,
  }
];

// Initialize projects from localStorage or use default mock data
const getStoredProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem('expatheros-projects');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
  }
  return mockProjects; // Return the hardcoded projects if nothing is stored
};

// A mutable copy of projects that the app will use
const liveProjects: Project[] = getStoredProjects();

// Function to save projects to localStorage
const saveProjectsToStorage = (projects: Project[]) => {
  try {
    localStorage.setItem('expatheros-projects', JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
  }
};

// Function to get fresh projects data
export const getProjects = (): Project[] => {
  return [...liveProjects];
};

// Function to add a new project
export const addProject = (project: Omit<Project, 'id'>) => {
  const newProject: Project = {
    ...project,
    id: (liveProjects.length + 1).toString(),
  };
  liveProjects.push(newProject);
  saveProjectsToStorage(liveProjects);
  window.dispatchEvent(new CustomEvent('projects-updated'));
  return newProject;
};

// Function to update assigned bricklayers for a project
export const assignBricklayersToProject = (projectId: string, assignedBricklayers: string[]) => {
  const project = liveProjects.find(p => p.id === projectId);
  if (project) {
    project.assignedBricklayers = assignedBricklayers;
    saveProjectsToStorage(liveProjects);
    window.dispatchEvent(new CustomEvent('projects-updated'));
  }
  return project;
};

export const mockMaterials: Material[] = [
  {
    id: '1',
    projectId: '1',
    type: 'Røde mursten',
    quantityAvailable: 18000,
    quantityUsed: 32000,
    unit: 'stk',
    lastUpdated: '2024-01-20'
  },
  {
    id: '2',
    projectId: '1',
    type: 'Cement',
    quantityAvailable: 50,
    quantityUsed: 120,
    unit: 'sække',
    lastUpdated: '2024-01-20'
  },
  {
    id: '3',
    projectId: '2',
    type: 'Gule mursten',
    quantityAvailable: 27000,
    quantityUsed: 8000,
    unit: 'stk',
    lastUpdated: '2024-01-19'
  }
];

// Initialize applications from localStorage or use default mock data
const getStoredApplications = (): Application[] => {
  try {
    const stored = localStorage.getItem('expatheros-applications');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading applications from localStorage:', error);
  }
  return [
    {
      id: '1',
      name: 'Jens Mortensen',
      email: 'jens@email.dk',
      phone: '+45 12 34 56 78',
      experience: 8,
      certifications: 'Faglig uddannelse som murer, AMU kurser',
      message: 'Jeg har stor erfaring med forskellige murprojekter og er interesseret i at blive en del af jeres team.',
      status: 'pending',
      submittedDate: '2024-01-18'
    },
    {
      id: '2',
      name: 'Sofie Larsen',
      email: 'sofie@email.dk',
      phone: '+45 87 65 43 21',
      experience: 3,
      certifications: 'Grundforløb bygge og anlæg, Hovedforløb murer',
      message: 'Nyuddannet murer søger spændende projekter i København området.',
      status: 'reviewed',
      submittedDate: '2024-01-15'
    }
  ];
};

export const mockApplications: Application[] = getStoredApplications();

// Function to save applications to localStorage
const saveApplicationsToStorage = (applications: Application[]) => {
  try {
    localStorage.setItem('expatheros-applications', JSON.stringify(applications));
  } catch (error) {
    console.error('Error saving applications to localStorage:', error);
  }
};

// Function to add new applications
export const addApplication = (application: Omit<Application, 'id' | 'submittedDate' | 'status'>) => {
  const newApplication: Application = {
    ...application,
    id: (mockApplications.length + 1).toString(),
    submittedDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  mockApplications.push(newApplication);
  
  // Save to localStorage
  saveApplicationsToStorage(mockApplications);
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('applications-updated'));
  
  return newApplication;
};

// Function to update application status
export const updateApplicationStatus = (applicationId: string, newStatus: Application['status']) => {
  const application = mockApplications.find(app => app.id === applicationId);
  if (application) {
    application.status = newStatus;
    
    // Save to localStorage
    saveApplicationsToStorage(mockApplications);
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('applications-updated'));
  }
  return application;
};

// Function to get fresh applications data
export const getApplications = (): Application[] => {
  return [...mockApplications];
};

// Function to clear all applications (for testing)
export const clearApplications = () => {
  mockApplications.length = 0;
  saveApplicationsToStorage(mockApplications);
  window.dispatchEvent(new CustomEvent('applications-updated'));
};

// Function to reset to default applications (for testing)
export const resetToDefaultApplications = () => {
  const defaultApps: Application[] = [
    {
      id: '1',
      name: 'Jens Mortensen',
      email: 'jens@email.dk',
      phone: '+45 12 34 56 78',
      experience: 8,
      certifications: 'Faglig uddannelse som murer, AMU kurser',
      message: 'Jeg har stor erfaring med forskellige murprojekter og er interesseret i at blive en del af jeres team.',
      status: 'pending',
      submittedDate: '2024-01-18'
    },
    {
      id: '2',
      name: 'Sofie Larsen',
      email: 'sofie@email.dk',
      phone: '+45 87 65 43 21',
      experience: 3,
      certifications: 'Grundforløb bygge og anlæg, Hovedforløb murer',
      message: 'Nyuddannet murer søger spændende projekter i København området.',
      status: 'reviewed',
      submittedDate: '2024-01-15'
    }
  ];
  
  mockApplications.length = 0;
  mockApplications.push(...defaultApps);
  saveApplicationsToStorage(mockApplications);
  window.dispatchEvent(new CustomEvent('applications-updated'));
};

export const deleteProject = (projectId: string) => {
  const index = liveProjects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    liveProjects.splice(index, 1);
    saveProjectsToStorage(liveProjects);
    window.dispatchEvent(new CustomEvent('projects-updated'));
    return true;
  }
  return false;
};

export const updateRoadmapStepStatus = (projectId: string, phase: string, newStatus: RoadmapStep['status']) => {
  const project = liveProjects.find(p => p.id === projectId);
  if (project) {
    const step = project.roadmap.find(s => s.phase === phase);
    if (step) {
      step.status = newStatus;
      saveProjectsToStorage(liveProjects);
      window.dispatchEvent(new CustomEvent('projects-updated'));
      return true;
    }
  }
  return false;
};