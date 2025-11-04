import { 
  Hammer,
  Home,
  TreePine,
  Brush,
  Building,
  Square
} from 'lucide-react';

export interface Skill {
  name: string;
  level: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  completedDate: string;
  client: string;
  skills: string[];
}

export interface Worker {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  skills: Skill[];
  yearsExperience: number;
  location: string;
  availability: {
    status: 'available' | 'busy' | 'partially-available';
    availableFrom?: string;
    notes?: string;
  };
  portfolio: PortfolioItem[];
  rating: number;
  completedProjects: number;
}

export const workers: Worker[] = [
  {
    id: '1',
    name: 'Marco Silva',
    photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+1 (555) 123-4567',
    email: 'marco.silva@email.com',
    yearsExperience: 12,
    location: 'New York, NY',
    rating: 4.9,
    completedProjects: 127,
    availability: {
      status: 'available',
      notes: 'Ready for new projects'
    },
    skills: [
      { name: 'Bricklaying', level: 95, icon: Building },
      { name: 'Tiling', level: 85, icon: Square },
      { name: 'Concrete', level: 90, icon: Home },
      { name: 'Woodwork', level: 70, icon: TreePine },
      { name: 'Roofing', level: 80, icon: Home },
      { name: 'Painting', level: 60, icon: Brush }
    ],
    portfolio: [
      {
        id: '1-1',
        title: 'Downtown Office Complex',
        description: 'Complete brick facade installation for 15-story commercial building',
        image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2024-01-15',
        client: 'Metro Construction Corp',
        skills: ['Bricklaying', 'Concrete']
      },
      {
        id: '1-2',
        title: 'Luxury Residential Villa',
        description: 'Custom stonework and tiling for high-end residential project',
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-11-20',
        client: 'Elite Homes LLC',
        skills: ['Bricklaying', 'Tiling', 'Concrete']
      },
      {
        id: '1-3',
        title: 'Historic Building Restoration',
        description: 'Restoration of century-old brick facade with period-appropriate techniques',
        image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-09-10',
        client: 'Heritage Restoration Inc',
        skills: ['Bricklaying', 'Roofing']
      }
    ]
  },
  {
    id: '2',
    name: 'James O\'Connor',
    photo: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+1 (555) 234-5678',
    email: 'james.oconnor@email.com',
    yearsExperience: 8,
    location: 'Boston, MA',
    rating: 4.7,
    completedProjects: 89,
    availability: {
      status: 'busy',
      availableFrom: '2024-02-15',
      notes: 'Currently on major commercial project'
    },
    skills: [
      { name: 'Bricklaying', level: 80, icon: Building },
      { name: 'Tiling', level: 90, icon: Square },
      { name: 'Concrete', level: 75, icon: Home },
      { name: 'Woodwork', level: 85, icon: TreePine },
      { name: 'Roofing', level: 70, icon: Home },
      { name: 'Painting', level: 95, icon: Brush }
    ],
    portfolio: [
      {
        id: '2-1',
        title: 'Modern Shopping Center',
        description: 'Interior and exterior tiling for 50,000 sq ft retail space',
        image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-12-05',
        client: 'Retail Spaces Inc',
        skills: ['Tiling', 'Painting']
      },
      {
        id: '2-2',
        title: 'Artisan Coffee Shop',
        description: 'Custom woodwork and decorative painting for boutique cafe',
        image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-10-22',
        client: 'Bean & Brew Co',
        skills: ['Woodwork', 'Painting', 'Tiling']
      }
    ]
  },
  {
    id: '3',
    name: 'Carlos Rodriguez',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+1 (555) 345-6789',
    email: 'carlos.rodriguez@email.com',
    yearsExperience: 15,
    location: 'Miami, FL',
    rating: 4.8,
    completedProjects: 156,
    availability: {
      status: 'partially-available',
      availableFrom: '2024-01-20',
      notes: 'Available for weekend projects'
    },
    skills: [
      { name: 'Bricklaying', level: 85, icon: Building },
      { name: 'Tiling', level: 75, icon: Square },
      { name: 'Concrete', level: 95, icon: Home },
      { name: 'Woodwork', level: 60, icon: TreePine },
      { name: 'Roofing', level: 90, icon: Home },
      { name: 'Painting', level: 70, icon: Brush }
    ],
    portfolio: [
      {
        id: '3-1',
        title: 'Waterfront Condominiums',
        description: 'Concrete foundation and structural work for luxury condos',
        image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2024-01-08',
        client: 'Oceanview Developers',
        skills: ['Concrete', 'Roofing']
      },
      {
        id: '3-2',
        title: 'Industrial Warehouse',
        description: 'Large-scale concrete flooring and roofing installation',
        image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-11-30',
        client: 'LogiCorp Industries',
        skills: ['Concrete', 'Roofing', 'Bricklaying']
      }
    ]
  },
  {
    id: '4',
    name: 'David Thompson',
    photo: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+1 (555) 456-7890',
    email: 'david.thompson@email.com',
    yearsExperience: 6,
    location: 'Chicago, IL',
    rating: 4.6,
    completedProjects: 67,
    availability: {
      status: 'available',
      notes: 'Specializing in residential projects'
    },
    skills: [
      { name: 'Bricklaying', level: 70, icon: Building },
      { name: 'Tiling', level: 80, icon: Square },
      { name: 'Concrete', level: 65, icon: Home },
      { name: 'Woodwork', level: 90, icon: TreePine },
      { name: 'Roofing', level: 85, icon: Home },
      { name: 'Painting', level: 75, icon: Brush }
    ],
    portfolio: [
      {
        id: '4-1',
        title: 'Custom Kitchen Renovation',
        description: 'Complete kitchen remodel with custom cabinetry and tiling',
        image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-12-18',
        client: 'Johnson Family',
        skills: ['Woodwork', 'Tiling', 'Painting']
      },
      {
        id: '4-2',
        title: 'Deck & Pergola Installation',
        description: 'Outdoor living space with custom woodwork and roofing',
        image: 'https://images.pexels.com/photos/1396118/pexels-photo-1396118.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-09-25',
        client: 'Miller Residence',
        skills: ['Woodwork', 'Roofing']
      }
    ]
  },
  {
    id: '5',
    name: 'Michael Johnson',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+1 (555) 567-8901',
    email: 'michael.johnson@email.com',
    yearsExperience: 10,
    location: 'Phoenix, AZ',
    rating: 4.9,
    completedProjects: 112,
    availability: {
      status: 'available',
      notes: 'Experienced in desert climate construction'
    },
    skills: [
      { name: 'Bricklaying', level: 90, icon: Building },
      { name: 'Tiling', level: 70, icon: Square },
      { name: 'Concrete', level: 80, icon: Home },
      { name: 'Woodwork', level: 75, icon: TreePine },
      { name: 'Roofing', level: 95, icon: Home },
      { name: 'Painting', level: 65, icon: Brush }
    ],
    portfolio: [
      {
        id: '5-1',
        title: 'Desert Resort Complex',
        description: 'Roofing and masonry work for luxury desert resort',
        image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-12-10',
        client: 'Desert Oasis Resorts',
        skills: ['Roofing', 'Bricklaying', 'Concrete']
      },
      {
        id: '5-2',
        title: 'Solar Panel Installation',
        description: 'Roofing modifications and structural support for solar arrays',
        image: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-10-15',
        client: 'SunPower Solutions',
        skills: ['Roofing', 'Concrete']
      }
    ]
  },
  {
    id: '6',
    name: 'Robert Wilson',
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+1 (555) 678-9012',
    email: 'robert.wilson@email.com',
    yearsExperience: 20,
    location: 'San Francisco, CA',
    rating: 5.0,
    completedProjects: 203,
    availability: {
      status: 'busy',
      availableFrom: '2024-03-01',
      notes: 'Booked through February 2024'
    },
    skills: [
      { name: 'Bricklaying', level: 95, icon: Building },
      { name: 'Tiling', level: 85, icon: Square },
      { name: 'Concrete', level: 90, icon: Home },
      { name: 'Woodwork', level: 95, icon: TreePine },
      { name: 'Roofing', level: 80, icon: Home },
      { name: 'Painting', level: 90, icon: Brush }
    ],
    portfolio: [
      {
        id: '6-1',
        title: 'Victorian Home Restoration',
        description: 'Complete restoration of historic Victorian mansion',
        image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-11-28',
        client: 'SF Heritage Foundation',
        skills: ['Bricklaying', 'Woodwork', 'Painting', 'Roofing']
      },
      {
        id: '6-2',
        title: 'Tech Campus Expansion',
        description: 'Modern office building with sustainable materials',
        image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-09-12',
        client: 'TechFlow Inc',
        skills: ['Concrete', 'Bricklaying', 'Tiling']
      },
      {
        id: '6-3',
        title: 'Luxury Penthouse',
        description: 'High-end residential project with custom finishes',
        image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600',
        completedDate: '2023-08-05',
        client: 'Elite Properties SF',
        skills: ['Woodwork', 'Tiling', 'Painting']
      }
    ]
  }
];