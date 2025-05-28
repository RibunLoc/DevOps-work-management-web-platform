import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  color?: 'blueLight' | 'blueDark' | 'white';
  className?: string;
  fontWeight?: 'semibold' | 'bold';
}

export function Logo({ size = 'md', showText = true, color = 'blue', className = '', fontWeight = 'bold' }: LogoProps) {
  // Size classes mapping
  const sizeClasses = {
    sm: 'h-3 w-5',
    md: 'h-6 w-8',
    lg: 'h-10 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const colorClasses = {
    blueLight: 'text-blue-600',
    blueDark: 'text-blue-400',
    white: 'text-white'
  };

  const fontClasses = {
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <img
          src="./logo.png"
          alt="OctalTask Logo"
          className={`${sizeClasses[size]}`}
        />
      </div>
      {showText && (
        <span className={`${fontClasses[fontWeight]} ${colorClasses[color]} ${textSizeClasses[size]}`}>
          OctalTask
        </span>
      )}
    </Link>
  );
}
