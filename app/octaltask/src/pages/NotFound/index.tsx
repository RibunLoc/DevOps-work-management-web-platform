import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common/Logo'
import { useTheme } from '@/contexts/ThemeContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <header className="sticky top-0 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-3 ">
            <Logo
                size="md"
                color={darkMode ? 'blueDark' : 'blueLight'}
                className="font-sans"
            />
          </div>


        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 min-h-screen">
        <div className="text-center space-y-6">
          {/* 404 Graphic */}
          <div className="inline-flex items-center text-6xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            <span>4</span>
            <div className="mx-2 relative">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-md">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <span>4</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-white">
            Oops! That page isn’t here.
          </h1>

          {/* Description */}
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-base">
            We looked everywhere but couldn’t find what you’re looking for. Maybe try heading back
            home?
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Go Back
            </Button>

            {/* need to fix logic here */}
            <Link to="/" className="w-full sm:w-auto">
              <Button className="flex items-center gap-2 w-full justify-center bg-blue-600 hover:bg-blue-700 text-white">
                <Home className="h-4 w-4" />
                Home Page
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
