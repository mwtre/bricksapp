import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'da' | 'en' | 'it' | 'es' | 'lt';
export type Theme = 'light' | 'dark';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('da');
  const [theme, setTheme] = useState<Theme>('dark');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check for stored language preference
    const storedLanguage = localStorage.getItem('bricksapp_language') as Language;
    if (storedLanguage && ['da', 'en', 'it', 'es', 'lt'].includes(storedLanguage)) {
      setLanguage(storedLanguage);
    }

    // Check for stored theme preference
    const storedTheme = localStorage.getItem('bricksapp_theme') as Theme;
    if (storedTheme && ['light', 'dark'].includes(storedTheme)) {
      setTheme(storedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // Load translations for the selected language
    import(`../translations/${language}.ts`).then((module) => {
      setTranslations(module.default);
    });
    
    // Store language preference
    localStorage.setItem('bricksapp_language', language);
  }, [language]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('bricksapp_theme', theme);
  }, [theme]);

  const t = (key: string, variables?: Record<string, string | number>): string => {
    let translation = translations[key] || key;
    
    if (variables) {
      Object.entries(variables).forEach(([varName, value]) => {
        translation = translation.replace(new RegExp(`{${varName}}`, 'g'), String(value));
      });
    }
    
    return translation;
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, theme, setTheme, toggleTheme }}>
      {children}
    </LanguageContext.Provider>
  );
};