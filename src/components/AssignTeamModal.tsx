import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Project, User } from '../types';
import { getUsers } from '../data/mockData';
import { X } from 'lucide-react';

interface AssignTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (projectId: string, assignedBricklayers: string[]) => void;
}

export const AssignTeamModal: React.FC<AssignTeamModalProps> = ({ isOpen, onClose, project, onSave }) => {
  const { t } = useLanguage();
  const [bricklayers, setBricklayers] = useState<User[]>([]);
  const [selectedBricklayers, setSelectedBricklayers] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      const allUsers = getUsers();
      setBricklayers(allUsers.filter(u => u.role === 'bricklayer'));
      setSelectedBricklayers(project.assignedBricklayers);
    }
  }, [project]);

  const handleToggleBricklayer = (id: string) => {
    setSelectedBricklayers(prev =>
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (project) {
      onSave(project.id, selectedBricklayers);
      onClose();
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tildel Team til {project.name}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {bricklayers.map(b => (
            <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200">{b.name}</p>
              <input
                type="checkbox"
                checked={selectedBricklayers.includes(b.id)}
                onChange={() => handleToggleBricklayer(b.id)}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Gem</button>
        </div>
      </div>
    </div>
  );
}; 