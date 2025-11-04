import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

interface LanguageSelectionModalProps {
  isOpen: boolean;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({ isOpen }) => {
  const { setLanguage, setHasSelectedLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string; nativeName: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  ];

  const handleLanguageSelect = (languageCode: Language) => {
    setLanguage(languageCode);
    setHasSelectedLanguage(true);
    // Store the selection in localStorage
    localStorage.setItem('expatheros-language', languageCode);
    // Remove the modal from localStorage to prevent it from showing again
    localStorage.setItem('expatheros-language-selected', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to expatheros.nl
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please select your preferred language to continue
          </p>
        </div>

        {/* Language Options */}
        <div className="space-y-3">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{language.flag}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {language.nativeName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {language.name}
                  </div>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You can change your language preference later in the app settings
          </p>
        </div>
      </div>
    </div>
  );
}; 