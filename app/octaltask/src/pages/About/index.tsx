import { Footer } from '@/components/common/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Code, Rocket, User, Users, CodeXml } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const team = [
    { name: 'Truc Lam', role: 'Frontend Developer' },
    { name: 'Duy Linh', role: 'Backend Developer' },
    { name: 'Kieu Phuong', role: 'Frontend Dev & UI/UX' },
    { name: 'Tran Phi', role: 'Team Lead & Backend' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <header className="bg-transparent py-5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 flex items-center">
          {/* better logic here */}
          <Link
            to="/tasks"
            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4 tracking-tight">About OctalTask</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/20 mx-auto mb-4">
            <CodeXml className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            <span className="text-blue-600 dark:text-blue-400">Octal</span>
            <span className="text-gray-800 dark:text-white">Task</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A minimal, elegant task manager built by four students from NT208.P21.ANTT. We care
            about simplicity, clarity, and your productivity.
          </p>
        </section>

        {/* Meet the Team */}
        <section>
          <h3 className="text-2xl font-semibold text-center mb-10">Meet the Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-shadow p-6 text-center"
              >
                <div className="h-16 w-16 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
                <h4 className="text-lg font-semibold">{member.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-lg font-medium mb-2">Collaboration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built with shared effort, diverse skills, and a unified vision.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 w-12 h-12 flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-medium mb-2">Learning by Doing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A hands-on capstone project for NT208.P21.ANTT web development.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/20 w-12 h-12 flex items-center justify-center">
                  <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="text-lg font-medium mb-2">Open Source</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built with transparency and love for the dev community.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
