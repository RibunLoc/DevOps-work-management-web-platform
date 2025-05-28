import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Info, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
    user: {
        name: string;
        email: string;
        photoUrl?: string;
    };
    onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                className={cn(
                    'flex items-center gap-2 focus:outline-none rounded-full transition-all duration-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer',
                    isOpen ? 'bg-gray-100 dark:bg-gray-700' : 'bg-transparent'
                )}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {user.photoUrl ? (
                    <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="object-cover rounded-full w-9 h-9 md:w-10 md:h-10 ring-2 ring-white dark:ring-gray-800"
                    />
                ) : (
                    <div className="flex items-center justify-center text-blue-600 bg-blue-100 rounded-full w-9 h-9 md:w-10 md:h-10 dark:bg-blue-900 dark:text-blue-300 ring-2 ring-white dark:ring-gray-800">
                        {user.name.substring(0, 1).toUpperCase()}
                    </div>
                )}
            </button>

            <div
                className={cn(
                    'absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-150 transform origin-top-right z-50',
                    isOpen
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-95 opacity-0 translate-y-1 pointer-events-none'
                )}
            >
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 cursor-pointer">
                        {user.photoUrl ? (
                            <img
                                src={user.photoUrl}
                                alt={user.name}
                                className="object-cover w-12 h-12 rounded-full ring-2 ring-white dark:ring-gray-800"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-12 h-12 text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 ring-2 ring-white dark:ring-gray-800">
                                {user.name.substring(0, 1).toUpperCase()}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="py-1">
                    <button
                        onClick={() => handleNavigation('/profile')}
                        className="flex items-center w-full px-6 py-3 text-sm text-left text-gray-700 cursor-pointer dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                        <User className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <span>Your Profile</span>
                    </button>
                    <button
                        onClick={() => handleNavigation('/settings')}
                        className="flex items-center w-full px-6 py-3 text-sm text-left text-gray-700 cursor-pointer dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                        <Settings className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={() => handleNavigation('/about')}
                        className="flex items-center w-full px-6 py-3 text-sm text-left text-gray-700 cursor-pointer dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                        <Info className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <span>About OctalTask</span>
                    </button>
                    <button
                        className="flex items-center w-full px-6 py-3 text-sm text-left text-gray-700 cursor-pointer dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 "
                        onClick={() => {
                            toggleDarkMode();
                            setIsOpen(false);
                        }}
                    >
                        {darkMode ? (
                            <Sun className="w-5 h-5 mr-3 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        )}
                        <span className="flex items-center justify-between w-full">
                            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            <div
                                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-1'
                                        }`}
                                />
                            </div>
                        </span>
                    </button>
                </div>

                <div className="py-1 border-t border-gray-100 dark:border-gray-700">
                    <button
                        className="flex items-center w-full px-6 py-3 text-sm text-left text-gray-700 cursor-pointer dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        onClick={() => {
                            setIsOpen(false);
                            onLogout();
                        }}
                    >
                        <LogOut className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
