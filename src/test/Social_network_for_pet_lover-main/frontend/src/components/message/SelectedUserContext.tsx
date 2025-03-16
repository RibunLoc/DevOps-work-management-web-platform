// SelectedUserContext.tsx
import React, { createContext, useContext, useState, ReactNode, SetStateAction } from 'react';

interface SelectedUserContextType {
  selectedUserEmail: string | null;
  setSelectedUserEmail: React.Dispatch<SetStateAction<string|null>>;
  selectedUserAvatar: string | undefined;
  setSelectedUserAvatar: React.Dispatch<SetStateAction<string|undefined>>;
  selectedUserName: string | undefined;
  setSelectedUserName: React.Dispatch<SetStateAction<string|undefined>>;
}

// Create the context
const SelectedUserContext = createContext<SelectedUserContextType | undefined>(undefined);

export const SelectedUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | undefined>(undefined);
  const [selectedUserAvatar, setSelectedUserAvatar] = useState<string | undefined>(undefined)

  return (
    <SelectedUserContext.Provider value={{ selectedUserEmail, setSelectedUserEmail, selectedUserAvatar, setSelectedUserAvatar, selectedUserName, setSelectedUserName}}>
      {children}
    </SelectedUserContext.Provider>
  );
};

// Hook to use the context
export const useSelectedUser = () => {
  const context = useContext(SelectedUserContext);
  if (!context) {
    throw new Error('useSelectedUser must be used within a SelectedUserProvider');
  }
  return context;
};
