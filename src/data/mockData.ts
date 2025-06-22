import { User, Project, Material, Application } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Lars Nielsen',
    email: 'lars@bricksapp.dk',
    role: 'bricklayer',
    phone: '+45 12 34 56 78',
    assignedProjects: ['1', '2']
  },
  {
    id: '2',
    name: 'Mette Hansen',
    email: 'mette@bricksapp.dk',
    role: 'project_manager',
    phone: '+45 87 65 43 21'
  },
  {
    id: '3',
    name: 'Thomas Andersen',
    email: 'thomas@bricksapp.dk',
    role: 'bricklayer',
    phone: '+45 23 45 67 89',
    assignedProjects: ['1', '3']
  },
  {
    id: '4',
    name: 'Anne Petersen',
    email: 'anne@bricksapp.dk',
    role: 'recruiter',
    phone: '+45 98 76 54 32'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Københavns Nye Boligkompleks',
    address: 'Vesterbrogade 123, 1620 København V',
    description: 'Moderne boligkompleks med 120 lejligheder',
    brickCountRequired: 50000,
    brickCountUsed: 32000,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    status: 'active',
    assignedBricklayers: ['1', '3'],
    managerId: '2',
    materials: []
  },
  {
    id: '2',
    name: 'Aarhus Kontorhus',
    address: 'Åboulevarden 45, 8000 Aarhus C',
    description: 'Moderne kontorhus med 8 etager',
    brickCountRequired: 35000,
    brickCountUsed: 8000,
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    status: 'active',
    assignedBricklayers: ['1'],
    managerId: '2',
    materials: []
  },
  {
    id: '3',
    name: 'Odense Skole Renovering',
    address: 'Skolegade 12, 5000 Odense C',
    description: 'Renovering af historisk skolebygning',
    brickCountRequired: 15000,
    brickCountUsed: 12000,
    startDate: '2024-01-01',
    endDate: '2024-04-30',
    status: 'delayed',
    assignedBricklayers: ['3'],
    managerId: '2',
    materials: []
  }
];

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

export const mockApplications: Application[] = [
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