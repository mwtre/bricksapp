import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Project, RoadmapStep } from '../types';
import { projectService } from '../services/database';
import { X } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  managerId: string;
  onProjectCreated?: (project: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  managerId, 
  onProjectCreated 
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'materials' | 'roadmap'>>({
    name: '',
    address: '',
    description: '',
    brickCountRequired: 0,
    brickCountUsed: 0,
    startDate: '',
    endDate: '',
    status: 'planning',
    assignedBricklayers: [],
    managerId: managerId,
    brickType: '',
    bricksPerSqm: 0,
    costPerBrick: 0,
    expectedCost: 0,
    expectedRevenue: 0,
  });
  const [roadmapPhases, setRoadmapPhases] = useState<string>('Planlægning, Fundament, Murværk, Taglægning, Færdiggørelse');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const roadmap: RoadmapStep[] = roadmapPhases.split(',').map((phase, index) => ({
        phase: phase.trim(),
        status: index === 0 ? 'active' : 'pending',
      }));
      
      console.log('Creating project with data:', { ...newProject, materials: [], roadmap });
      
      const createdProject = await projectService.createProject({ 
        ...newProject, 
        materials: [], 
        roadmap 
      });
      
      console.log('Project created successfully:', createdProject);
      
      // Reset form
      setNewProject({
        name: '',
        address: '',
        description: '',
        brickCountRequired: 0,
        brickCountUsed: 0,
        startDate: '',
        endDate: '',
        status: 'planning',
        assignedBricklayers: [],
        managerId: managerId,
        brickType: '',
        bricksPerSqm: 0,
        costPerBrick: 0,
        expectedCost: 0,
        expectedRevenue: 0,
      });
      setRoadmapPhases('Planlægning, Fundament, Murværk, Taglægning, Færdiggørelse');
      
      // Notify parent component
      if (onProjectCreated) {
        onProjectCreated(createdProject);
      }
      
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('projects.newProject')}</h2>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Projektnan</label>
              <input 
                name="name" 
                value={newProject.name} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
              <input 
                name="address" 
                value={newProject.address} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beskrivelse</label>
            <textarea 
              name="description" 
              value={newProject.description} 
              onChange={handleChange} 
              rows={3} 
              disabled={isLoading}
              className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Dato</label>
              <input 
                type="date" 
                name="startDate" 
                value={newProject.startDate} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slut Dato</label>
              <input 
                type="date" 
                name="endDate" 
                value={newProject.endDate} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
          </div>
          <hr className="dark:border-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Murstensdetaljer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Murstenstype</label>
              <input 
                name="brickType" 
                value={newProject.brickType} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Antal mursten (total)</label>
              <input 
                type="number" 
                name="brickCountRequired" 
                value={newProject.brickCountRequired} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mursten pr. m²</label>
              <input 
                type="number" 
                name="bricksPerSqm" 
                value={newProject.bricksPerSqm} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
          </div>
          <hr className="dark:border-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Økonomi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pris pr. mursten (DKK)</label>
              <input 
                type="number" 
                step="0.01" 
                name="costPerBrick" 
                value={newProject.costPerBrick} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Forventede omkostninger (DKK)</label>
              <input 
                type="number" 
                name="expectedCost" 
                value={newProject.expectedCost} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Forventet indtægt (DKK)</label>
              <input 
                type="number" 
                name="expectedRevenue" 
                value={newProject.expectedRevenue} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
              />
            </div>
          </div>
          <hr className="dark:border-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Roadmap Faser</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Faser (kommasepareret)</label>
            <input 
              name="roadmapPhases" 
              value={roadmapPhases} 
              onChange={(e) => setRoadmapPhases(e.target.value)} 
              required 
              disabled={isLoading}
              className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-md disabled:opacity-50" 
            />
            <p className="text-xs text-gray-500 mt-1">Indtast faserne for projektet, adskilt af kommaer.</p>
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Opretter projekt...' : t('dashboard.createProject')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 