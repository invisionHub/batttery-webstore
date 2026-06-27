import dynamic from 'next/dynamic';
import React, { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
}

const sizeMap: Record<string, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

const iconComponents: Record<string, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  Heart: dynamic(() => import('@/assets/icons/Heart.svg'), { ssr: false }),
  Truck: dynamic(() => import('@/assets/icons/Truck.svg'), { ssr: false }),
  Vector: dynamic(() => import('@/assets/icons/Vector.svg'), { ssr: false }),
  Vector1: dynamic(() => import('@/assets/icons/Vector (1).svg'), { ssr: false }),
  Vector2: dynamic(() => import('@/assets/icons/Vector (2).svg'), { ssr: false }),
  Vector3: dynamic(() => import('@/assets/icons/Vector (3).svg'), { ssr: false }),
  Frame2147235204: dynamic(() => import('@/assets/icons/Frame 2147235204.svg'), { ssr: false }),
  Logo: dynamic(() => import('@/assets/icons/Group 27205.svg'), { ssr: false }),
};

const FallbackIcon: React.FC<SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
    <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
  </svg>
);

/**
 * Icon component that dynamically loads and displays SVG icons from assets/icons
 * @param name - The name of the icon (without .svg extension)
 * @param className - Optional CSS classes for styling
 * @param size - Icon size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number (default: 'md')
 * @param props - Additional SVG element props
 */
export const Icon: React.FC<IconProps> = ({ name, className = '', size = 'md', ...props }) => {
  const sizeValue = typeof size === 'number' ? size : sizeMap[size] || 24;
  const DynamicIcon = iconComponents[name] || FallbackIcon;

  return (
    <div className={`inline-block ${className}`} style={{ width: sizeValue, height: sizeValue }}>
      <DynamicIcon width={sizeValue} height={sizeValue} className="h-full w-full" {...props} />
    </div>
  );
};

export default Icon;
