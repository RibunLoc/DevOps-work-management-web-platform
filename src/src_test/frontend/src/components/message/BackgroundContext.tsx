// BackgroundContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface BackgroundContextType {
    backgroundImageOver: string,
    setBackgroundImageOver: React.Dispatch<React.SetStateAction<string>>,
    isPaletteOpen: boolean,
    setIsPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>,
    palette: number[][],
    setPalette: React.Dispatch<React.SetStateAction<number[][]>>
    selectedTheme: number[][],
    setSelectedTheme: React.Dispatch<React.SetStateAction<number[][]>>
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [backgroundImageOver, setBackgroundImageOver] = useState<string>(""); 
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false)
  const [palette, setPalette] = useState<number[][]>([[]])
  const [selectedTheme, setSelectedTheme] = useState<number[][]>([])


  return (
    <BackgroundContext.Provider value={{ backgroundImageOver,setBackgroundImageOver, isPaletteOpen, setIsPaletteOpen, palette, setPalette, selectedTheme, setSelectedTheme }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = (): BackgroundContextType => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('background must be used within a BackgroundProvider');
  }
  return context;
};
