import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Footer } from '@/components/common/Footer';
import Feature from '@/components/layout/LandingPage/Feature';
import Hero from '@/components/layout/LandingPage/Hero';
import Navbar from '@/components/common/Navbar';

export default function LandingPage() {
  const navigate = useNavigate();
  const [visibleFAQ, setVisibleFAQ] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  const toggleFAQ = (index: number) => {
    setVisibleFAQ(visibleFAQ === index ? null : index);
  };

  // Animation on scroll logic
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');

      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight * 0.85) {
          element.classList.add('animate-visible');
        }
      });
    };

    // Run on initial load
    setTimeout(animateOnScroll, 100);

    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);

    // Clean up
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  // Section tracking for navbar
  useEffect(() => {
    // Define the sections to track
    const sections = ['hero', 'features', 'about', 'testimonials', 'faq'];

    // Create IntersectionObserver to track which section is in view
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-10% 0px -70% 0px', // trigger when section is approximately in the middle of viewport
      threshold: 0, // trigger as soon as even 1px is visible
    };

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach(sectionId => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionObserver.observe(sectionElement);
      }
    });

    // Clean up
    return () => {
      sections.forEach(sectionId => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          sectionObserver.unobserve(sectionElement);
        }
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <div className="sticky top-0 z-100">
        <Navbar activeSection={activeSection} />
      </div>
      {/* Hero Section */}
      <main className="flex-grow">
        <Hero />

        <Feature />

        {/* About the Project Section */}
        <section id="about" className="py-20 bg-white dark:bg-gray-800 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                University Project
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                About OctalTask
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                A collaborative web development project created at the University of Information
                Technology - VNUHCM
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="animate-on-scroll" style={{ transitionDelay: '100ms' }}>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-2xl shadow-xl">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Project Overview
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      OctalTask is a comprehensive task management web application developed as a
                      group project for our Web Development course at the University of Information
                      Technology - Vietnam National University, Ho Chi Minh City.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Our goal was to create a modern, user-friendly application that allows
                      individuals and teams to efficiently organize tasks, collaborate in real-time,
                      and boost productivity through intuitive design and powerful features.
                    </p>
                    <div className="text-gray-600 dark:text-gray-300">
                      <p className="font-medium text-blue-600 dark:text-blue-400">
                        Technologies used:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          React
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          TypeScript
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          Tailwind CSS
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          Node.js
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          Nest.js
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          MySQL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="animate-on-scroll" style={{ transitionDelay: '300ms' }}>
                <img
                  src="/project-screenshot.png"
                  alt="OctalTask Project Screenshot"
                  className="rounded-xl shadow-xl w-full h-auto object-cover"
                  onError={e => {
                    e.currentTarget.src =
                      'https://placehold.co/800x600/4f46e5/white?text=OctalTask+Screenshot';
                  }}
                />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10 animate-on-scroll">
              Meet Our Team
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div
                className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 animate-on-scroll"
                style={{ transitionDelay: '100ms' }}
              >
                <div className="aspect-square bg-gradient-to-tr from-blue-400 to-purple-500 relative overflow-hidden">
                  <img
                    src="/team-member1.jpg"
                    alt="Team Member"
                    className="w-full h-full object-cover opacity-90"
                    onError={e => {
                      e.currentTarget.src =
                        'https://placehold.co/400x400/4f46e5/white?text=Team+Member';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    Team Member Name
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 mb-2">Role / Student ID</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Short description or responsibility in the project.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="mailto:student@example.com"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Team Member 2 */}
              <div
                className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 animate-on-scroll"
                style={{ transitionDelay: '200ms' }}
              >
                <div className="aspect-square bg-gradient-to-tr from-green-400 to-blue-500 relative overflow-hidden">
                  <img
                    src="/team-member2.jpg"
                    alt="Team Member"
                    className="w-full h-full object-cover opacity-90"
                    onError={e => {
                      e.currentTarget.src =
                        'https://placehold.co/400x400/22c55e/white?text=Team+Member';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    Team Member Name
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 mb-2">Role / Student ID</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Short description or responsibility in the project.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="mailto:student@example.com"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Team Member 3 */}
              <div
                className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 animate-on-scroll"
                style={{ transitionDelay: '300ms' }}
              >
                <div className="aspect-square bg-gradient-to-tr from-purple-400 to-pink-500 relative overflow-hidden">
                  <img
                    src="/team-member3.jpg"
                    alt="Team Member"
                    className="w-full h-full object-cover opacity-90"
                    onError={e => {
                      e.currentTarget.src =
                        'https://placehold.co/400x400/a855f7/white?text=Team+Member';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    Team Member Name
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 mb-2">Role / Student ID</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Short description or responsibility in the project.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="mailto:student@example.com"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Team Member 4 */}
              <div
                className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 animate-on-scroll"
                style={{ transitionDelay: '400ms' }}
              >
                <div className="aspect-square bg-gradient-to-tr from-orange-400 to-red-500 relative overflow-hidden">
                  <img
                    src="/team-member4.jpg"
                    alt="Team Member"
                    className="w-full h-full object-cover opacity-90"
                    onError={e => {
                      e.currentTarget.src =
                        'https://placehold.co/400x400/f97316/white?text=Team+Member';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    Team Member Name
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 mb-2">Role / Student ID</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Short description or responsibility in the project.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="mailto:student@example.com"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-white dark:bg-gray-800 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                Testimonials
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What our users say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join thousands of satisfied users who have transformed their productivity with
                OctalTask.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div
                className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm animate-on-scroll"
                style={{ transitionDelay: '100ms' }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative mr-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      J
                    </div>
                    <div className="absolute -right-1 -bottom-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white dark:border-gray-700"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">John Doe</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Director</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "OctalTask completely transformed how our marketing team manages campaigns. The
                  collaboration features are fantastic, and the interface is so intuitive. Can't
                  imagine working without it now."
                </p>
              </div>

              <div
                className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm animate-on-scroll"
                style={{ transitionDelay: '200ms' }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative mr-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      S
                    </div>
                    <div className="absolute -right-1 -bottom-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white dark:border-gray-700"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Sarah Johnson</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Freelance Designer</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "As a freelancer juggling multiple clients, OctalTask keeps me organized and on
                  schedule. The ability to create custom lists for each project is a game-changer
                  for my workflow."
                </p>
              </div>

              <div
                className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm animate-on-scroll"
                style={{ transitionDelay: '300ms' }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative mr-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      M
                    </div>
                    <div className="absolute -right-1 -bottom-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white dark:border-gray-700"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Michael Chen</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Product Manager</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "OctalTask has been instrumental in our product development process. The ability
                  to share tasks with stakeholders and track progress has significantly improved our
                  delivery timelines."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white dark:bg-gray-800 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                FAQ
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Everything you need to know about OctalTask
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: 'How do I get started with OctalTask?',
                  answer:
                    'Getting started is easy! Simply sign up for a free account, create your first task list, and start adding tasks. Our intuitive interface makes it simple to organize and manage your tasks from day one.',
                },
                {
                  question: 'Can I use OctalTask on my mobile device?',
                  answer:
                    'Yes! OctalTask is fully responsive and works on all devices including smartphones and tablets. Our web app adapts to any screen size for a seamless experience wherever you are.',
                },
                {
                  question: 'How does task sharing and collaboration work?',
                  answer:
                    "You can share tasks or entire lists with team members by entering their email address and assigning permissions (viewer, editor, or admin). They'll receive an invitation and can immediately start collaborating with you.",
                },
                {
                  question: 'Is my data secure with OctalTask?',
                  answer:
                    'Absolutely. We use industry-standard encryption to protect your data. All information is transmitted over secure HTTPS connections, and we regularly back up all data to prevent any loss.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    className="flex items-center justify-between w-full p-5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        visibleFAQ === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      visibleFAQ === index
                        ? 'max-h-96 p-5 border-t border-gray-200 dark:border-gray-700'
                        : 'max-h-0 py-0 px-5 overflow-hidden'
                    }`}
                  >
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-blue-600 dark:bg-blue-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to boost your productivity?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who manage their tasks efficiently with OctalTask.
            </p>
            <Button
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
              size="lg"
            >
              Sign up for free
            </Button>
          </div>
        </section>
      </main>

      {/* Custom Footer */}
      <Footer />

      {/* Add CSS for animations directly in a style tag - fixed syntax */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                        .animate-on-scroll {
                            opacity: 0;
                            transform: translateY(30px);
                            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                        }

                        .animate-visible {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    `,
        }}
      />
    </div>
  );
}
