import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();

    return (
      <section
        id="hero"
        className="py-16 md:py-24 px-4 overflow-hidden relative bg-gradient-to-br from-gray-50 to-blue-300 dark:from-gray-900 dark:to-blue-900/20"
      >
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        ></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className="text-center md:text-left transition-all duration-700 transform"
              style={{ transitionDelay: '200ms' }}
            >
              <div className="inline-block px-3 py-1 mb-6 text-sm font-medium rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                Boost your productivity
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                Manage tasks efficiently with{' '}
                <span className="text-blue-600 dark:text-blue-400">OctalTask</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0 mb-8">
                Simplify task management, boost productivity, and collaborate seamlessly with your
                team. The all-in-one solution for personal and team productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-md hover:shadow-lg transition-all animate-bounce hover:animate-none"
                  size="lg"
                >
                  Get Started - It's Free
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-3xl"></div>
              <div className="relative shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/mockup.png"
                  alt="OctalTask Dashboard"
                  className="w-full h-auto"
                  onError={e => {
                    e.currentTarget.src =
                      'https://placehold.co/600x400/4f46e5/white?text=OctalTask+Dashboard';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );

}
