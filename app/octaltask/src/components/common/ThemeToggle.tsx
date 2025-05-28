import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '../ui/button';

export function ThemeToggle() {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full transition-transform hover:scale-110 focus:scale-110"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {darkMode ? (
                <Sun className="h-5 w-5 text-[#fbbc04]" />
            ) : (
                <Moon className="h-5 w-5 text-[#5f6368]" />
            )}
        </Button>
    );
}
