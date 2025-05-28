import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function Feature() {
    const [animatedElements, setAnimatedElements] = useState({
        header: false,
        cards: [false, false, false]
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;

                        if (id === "features-header") {
                            setAnimatedElements(prev => ({
                                ...prev,
                                header: true
                            }));
                        } else if (id.startsWith("feature-card-")) {
                            const index = parseInt(id.split("-")[2]);
                            setAnimatedElements(prev => ({
                                ...prev,
                                cards: prev.cards.map((animated, i) =>
                                    i === index ? true : animated
                                )
                            }));
                        }
                    }
                });
            },
            { threshold: 0.2 }
        );

        // Observe elements
        const headerElement = document.getElementById("features-header");
        if (headerElement) observer.observe(headerElement);

        for (let i = 0; i < 3; i++) {
            const cardElement = document.getElementById(`feature-card-${i}`);
            if (cardElement) observer.observe(cardElement);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const cardIcons = [
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
    ];

    const featureCards = [
        {
            title: "Smart Task Lists",
            description: "Create multiple lists to organize your tasks by project, priority, or category. Customize with colors and icons.",
            bgColor: "bg-blue-100 dark:bg-blue-900",
            textColor: "text-blue-600 dark:text-blue-400",
            features: [
                "Custom list categories",
                "Color coding system",
                "Drag and drop organization"
            ]
        },
        {
            title: "Team Collaboration",
            description: "Share tasks and lists with team members, control permissions, and work together in real-time.",
            bgColor: "bg-purple-100 dark:bg-purple-900",
            textColor: "text-purple-600 dark:text-purple-400",
            features: [
                "Role-based permissions",
                "Task assignment",
                "Seamless sharing"
            ]
        },
        {
            title: "Rich Task Context",
            description: "Add comments, attach files, and include detailed descriptions to provide full context.",
            bgColor: "bg-green-100 dark:bg-green-900",
            textColor: "text-green-600 dark:text-green-400",
            features: [
                "File attachments",
                "Comment threads",
                "Rich text formatting"
            ]
        }
    ];

    return (
        <section id="features" className="py-20 bg-white dark:bg-gray-800 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div
                    id="features-header"
                    className={`text-center mb-16 transition-all duration-1000 transform ${animatedElements.header
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                        }`}
                >
                    <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        Powerful Features
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Everything you need to stay organized
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        OctalTask combines powerful features with a simple interface to help you manage tasks efficiently.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {featureCards.map((card, index) => (
                        <div
                            id={`feature-card-${index}`}
                            key={index}
                            className={`bg-gray-50 dark:bg-gray-700 p-8 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-lg transition-all duration-700 transform ${animatedElements.cards[index]
                                    ? "opacity-100 translate-y-0 scale-100"
                                    : "opacity-0 translate-y-16 scale-95"
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className={`w-14 h-14 ${card.bgColor} rounded-xl flex items-center justify-center mb-6 transform transition-transform hover:scale-110 duration-300`}>
                                {cardIcons[index]}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                {card.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                {card.description}
                            </p>
                            <ul className="space-y-2">
                                {card.features.map((feature, fIndex) => (
                                    <li
                                        key={fIndex}
                                        className={`flex items-start gap-2 transition-all duration-500 transform ${animatedElements.cards[index]
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 -translate-x-4"
                                            }`}
                                        style={{ transitionDelay: `${(index * 150) + (fIndex * 100) + 300}ms` }}
                                    >
                                        <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
