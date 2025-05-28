import { MapPin, Github, Linkedin, Mail, Phone } from "lucide-react";
import { Logo } from "../common/Logo";
import { useTheme } from "../../contexts/ThemeContext";
export function Footer() {
    const darkMode = useTheme();
    return (
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex items-center space-x-2">
                            <Logo size="md" color={darkMode ? "blueDark" : "blueLight"} fontWeight="semibold" className="font-sans" />
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed">
                            Your comprehensive task management solution designed to streamline workflows and boost productivity.
                        </p>

                        <div className="flex items-start gap-3 bg-gray-800 bg-opacity-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <MapPin className="text-blue-400 mt-1 shrink-0" size={18} />
                            <div className="text-gray-300 text-sm">
                                <p className="font-medium text-white mb-1">University of Information Technology - VNUHCM</p>
                                <p>Han Thuyen Street, Quarter 6, Linh Trung Ward</p>
                                <p>Thu Duc City, Ho Chi Minh City, Vietnam</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold mb-4 text-white relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-1 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            {["Features", "About Project", "Testimonials", "Pricing", "FAQ"].map((item) => (
                                <li key={item} className="group">
                                    <a
                                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"
                                    >
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* University Links Column */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold mb-4 text-white relative inline-block">
                            University Links
                            <span className="absolute -bottom-1 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: "UIT Website", url: "https://www.uit.edu.vn/" },
                                { name: "Academic Programs", url: "https://www.uit.edu.vn/dao-tao" },
                                { name: "Student Resources", url: "https://www.uit.edu.vn/sinh-vien" },
                                { name: "Contact UIT", url: "https://www.uit.edu.vn/thong-tin-lien-he" }
                            ].map((link) => (
                                <li key={link.name} className="group">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"
                                    >
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold mb-4 text-white relative inline-block">
                            Connect With Us
                            <span className="absolute -bottom-1 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
                        </h4>

                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: Github, link: "#", label: "GitHub" },
                                { icon: Linkedin, link: "#", label: "LinkedIn" },
                                { icon: Mail, link: "mailto:contact@octaltask.com", label: "Email" },
                                { icon: Phone, link: "tel:+84123456789", label: "Phone" }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    aria-label={social.label}
                                    className="group w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>

                        <div className="pt-4">
                            <p className="text-gray-300 text-sm mb-4">
                                Subscribe to our newsletter
                            </p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow text-sm"
                                />
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors text-sm font-medium">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} OctalTask. All rights reserved. A project created for Web Development course at UIT.
                    </p>

                    <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-gray-400">
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <span className="text-gray-600">•</span>
                        <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
