import React, { ComponentType, SVGProps } from 'react';
import { ICONS } from '@/assets/icons';

interface IconProps extends SVGProps<SVGSVGElement> {
  icon: keyof typeof ICONS;
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * SVG Icon component - Renders SVG icons directly from the assets/icons registry
 * This component is optimized for SVG rendering and styling
 *
 * @param icon - The key name from ICONS object (e.g., 'HEART', 'TRUCK')
 * @param className - Optional CSS classes for styling (e.g., text-red-500)
 * @param width - Width of the icon in pixels or string (default: 24)
 * @param height - Height of the icon in pixels or string (default: 24)
 * @param props - Additional SVG element props
 *
 * @example
 * ```tsx
 * import { SvgIcon } from '@/components/ui';
 * import { ICONS } from '@/assets/icons';
 *
 * <SvgIcon icon={ICONS.HEART} className="text-red-500" width={32} height={32} />
 * ```
 */
export const SvgIcon: React.FC<IconProps> = ({
  icon,
  className = '',
  width = 24,
  height = 24,
  ...props
}) => {
  const SVGComponent = ICONS[icon] as unknown as ComponentType<
    SVGProps<SVGSVGElement> & { title?: string }
  >;

  if (!SVGComponent) {
    console.warn(`Icon not found: ${icon}`);
    return (
      <svg
        width={width}
        height={height}
        className={`${className} text-gray-400`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <SVGComponent
      width={width}
      height={height}
      className={className}
      {...(props as SVGProps<SVGSVGElement>)}
    />
  );
};

export default SvgIcon;
