// PreferencesContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface Preferences {
  backendUrl: string;
}

interface PreferencesContextProps {
  preferences: Preferences;
  setPreferences: (prefs: Preferences) => void;
}

export const PreferencesContext = createContext<PreferencesContextProps>({
  preferences: { backendUrl: 'http://localhost:9961/api' },
  setPreferences: () => {},
});

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>({
    backendUrl: 'http://localhost:9961/api',
  });

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};