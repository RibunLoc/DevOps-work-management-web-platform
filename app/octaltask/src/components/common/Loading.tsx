import React from 'react';

type LoadingProps = {
size?: 'sm' | 'md' | 'lg';
text?: string;
};

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text = 'Loading...' }) => {
// Map size to actual pixel values
const sizeMap = {
sm: {
    container: 'h-24',
    dot: 'w-2 h-2',
    wrapper: 'gap-1',
},
md: {
    container: 'h-32',
    dot: 'w-3 h-3',
    wrapper: 'gap-2',
},
lg: {
    container: 'h-40',
    dot: 'w-4 h-4',
    wrapper: 'gap-3',
},
};

return (
    <div
        className={`flex flex-col items-center justify-center ${sizeMap[size].container} w-full`}
    >
        <div className={`flex items-center ${sizeMap[size].wrapper} mb-4`}>
        {/* Google colored dots with staggered animation */}
        <div
            className={`${sizeMap[size].dot} rounded-full bg-blue-600 animate-bounce`}
            style={{ animationDelay: '0ms' }}
        />
        <div
            className={`${sizeMap[size].dot} rounded-full bg-red-500 animate-bounce`}
            style={{ animationDelay: '150ms' }}
        />
        <div
            className={`${sizeMap[size].dot} rounded-full bg-yellow-500 animate-bounce`}
            style={{ animationDelay: '300ms' }}
        />
        <div
            className={`${sizeMap[size].dot} rounded-full bg-green-500 animate-bounce`}
            style={{ animationDelay: '450ms' }}
        />
        </div>
        {text && <span className="text-gray-600 dark:text-gray-300 font-medium">{text}</span>}
    </div>
    );
};
