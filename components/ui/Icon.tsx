import React from 'react';
import Image, { type ImageProps } from 'next/image';
import { ICONS } from '@/assets/icons';

interface IconProps extends Omit<ImageProps, 'src' | 'alt'> {
  name: keyof typeof ICONS | (string & {});
}

/**
 * Icon component that displays SVG icons from the assets/icons registry
 * @param name - The key name from ICONS object (e.g., 'HEART', 'TRUCK')
 * @param className - Optional CSS classes for styling
 * @param width - Width of the icon (default: 24)
 * @param height - Height of the icon (default: 24)
 * @param props - Additional Next.js Image props
 */
export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  width = 24,
  height = 24,
  ...props
}) => {
  const iconKey = name as keyof typeof ICONS;
  const iconModule = ICONS[iconKey];

  if (!iconModule) {
    console.warn(`Icon not found: ${name}`);
    // Fallback to a placeholder
    return (
      <svg
        width={width}
        height={height}
        className={`${className} text-red-500`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          className="pointer-events-none"
        >
          ?
        </text>
      </svg>
    );
  }

  // Use Next.js Image component with the imported SVG
  return (
    <Image
      src={iconModule}
      alt={String(name)}
      width={typeof width === 'string' ? 24 : width}
      height={typeof height === 'string' ? 24 : height}
      className={className}
      {...props}
    />
  );
};

export default Icon;
