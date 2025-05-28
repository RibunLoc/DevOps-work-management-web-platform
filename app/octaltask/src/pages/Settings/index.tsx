import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Bell, EyeOff, Globe, Moon, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    language: 'English',
    privacy: {
      showCompleted: true,
      showTaskDetails: true,
    },
  });

  const toggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings({ ...settings, [key]: !settings[key] });
    }
  };

  const togglePrivacySetting = (key: keyof typeof settings.privacy) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key],
      },
    });
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 py-4 bg-white border-b border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center max-w-5xl px-6 mx-auto">
          {/* better logic here */}
          <Link
            to="/tasks"
            className="p-1 mr-4 text-gray-500 transition-colors rounded-full hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-normal tracking-tight text-gray-800 dark:text-gray-200">
            Settings
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl px-6 py-16 mx-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="overflow-hidden bg-white border-none shadow-sm dark:bg-gray-800">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="flex items-center text-lg font-normal text-gray-800 dark:text-gray-200">
                <Moon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Use dark theme</div>
                </div>
                <div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={toggleDarkMode}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-white border-none shadow-sm dark:bg-gray-800">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="flex items-center text-lg font-normal text-gray-800 dark:text-gray-200">
                <Bell className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    Push Notifications
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications for task reminders
                  </div>
                </div>
                <div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      settings.notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={() => toggleSetting('notifications')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    Email Notifications
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Receive task reminders via email
                  </div>
                </div>
                <div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={() => toggleSetting('emailNotifications')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-white border-none shadow-sm dark:bg-gray-800">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="flex items-center text-lg font-normal text-gray-800 dark:text-gray-200">
                <Globe className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">Language</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Select your preferred language
                  </div>
                </div>
                <div>
                  <select
                    className="px-3 py-2 border border-gray-200 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={settings.language}
                    onChange={e => setSettings({ ...settings, language: e.target.value })}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-white border-none shadow-sm dark:bg-gray-800">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="flex items-center text-lg font-normal text-gray-800 dark:text-gray-200">
                <EyeOff className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    Show Completed Tasks
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Show completed tasks in lists
                  </div>
                </div>
                <div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      settings.privacy.showCompleted
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={() => togglePrivacySetting('showCompleted')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy.showCompleted ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    Show Task Details
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Show task details in task lists
                  </div>
                </div>
                <div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      settings.privacy.showTaskDetails
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={() => togglePrivacySetting('showTaskDetails')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy.showTaskDetails ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-white border-none shadow-sm dark:bg-gray-800">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="flex items-center text-lg font-normal text-gray-800 dark:text-gray-200">
                <Smartphone className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                Connected Devices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="py-2">
                <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                  No devices connected
                </div>
                <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                  Connect your mobile devices to sync tasks
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
                  Connect Device
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
