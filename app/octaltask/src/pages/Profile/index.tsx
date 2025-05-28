import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Camera, Mail, UserRoundCog, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { authInformation } from '@/lib/api/auth'; 

export default function Profile() {
  const navigate = useNavigate();

  // Placeholder user data - would come from auth context in a real app
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    photoUrl: '',
  });

  // Placeholder state for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authInformation();
        const { name, email, role } = data.user;

        setUser({
          name,
          email,
          role,
          photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        });
        setEditedUser({
          name,
          email,
          role,
          photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        });
      } catch (err) {
        console.error('Error fetching user info:', err);
        // Redirect to login if needed
      }
    };

    fetchUser();
  }, []);
  
  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    // In a real app, you would call an API to update the user profile
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
            Profile
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl px-6 py-16 mx-auto">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden bg-white border-none shadow-sm dark:bg-gray-800">
            <CardHeader className="p-8 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700 ring-4 ring-white dark:ring-gray-800">
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-0 right-0 p-2 rounded-full shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-normal text-gray-800 dark:text-gray-200">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="flex">
                      <span className="flex items-center p-2 border border-r-0 border-gray-200 bg-gray-50 dark:bg-gray-700 rounded-l-md dark:border-gray-600">
                        <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      </span>
                      <Input
                        value={editedUser.name}
                        onChange={e => setEditedUser({ ...editedUser, name: e.target.value })}
                        className="bg-white border-gray-200 rounded-l-none dark:border-gray-600 dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <div className="flex">
                      <span className="flex items-center p-2 border border-r-0 border-gray-200 bg-gray-50 dark:bg-gray-700 rounded-l-md dark:border-gray-600">
                        <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      </span>
                      <Input
                        value={editedUser.email}
                        onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="bg-white border-gray-200 rounded-l-none dark:border-gray-600 dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <div className="flex">
                      <span className="flex items-center p-2 border border-r-0 border-gray-200 bg-gray-50 dark:bg-gray-700 rounded-l-md dark:border-gray-600">
                        <UserRoundCog className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      </span>
                      <Input
                        value={editedUser.role}
                        onChange={e => setEditedUser({ ...editedUser, role: e.target.value })}
                        className="bg-white border-gray-200 rounded-l-none dark:border-gray-600 dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="text-white bg-blue-600 hover:bg-blue-700"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center px-4 py-4 -mx-4 transition-colors border-b border-gray-100 rounded group dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <User className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                    <div className="flex-1">
                      <div className="mb-1 text-xs tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        Full Name
                      </div>
                      <div className="text-gray-900 dark:text-gray-200">{user.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center px-4 py-4 -mx-4 transition-colors border-b border-gray-100 rounded group dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <Mail className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                    <div className="flex-1">
                      <div className="mb-1 text-xs tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        Email
                      </div>
                      <div className="text-gray-900 dark:text-gray-200">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center px-4 py-4 -mx-4 transition-colors border-b border-gray-100 rounded group dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <UserRoundCog className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                    <div className="flex-1">
                      <div className="mb-1 text-xs tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        Role
                      </div>
                      <div className="text-gray-900 dark:text-gray-200">{user.role}</div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      className="text-white bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
