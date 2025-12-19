import React from "react";
import { cn } from "@/lib/utils";
import { icons } from "@/public/svg/icon";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof icons;
  size?: number | string;
  className?: string;
  alt?: string;
  color?: string;
  auto?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size,
  width = 20,
  height = 20,
  className,
  alt,
  color = "currentColor",
  style,
  auto = true,
  ...svgProps
}) => {
  const IconComponent = icons[name as keyof typeof icons];

  if (!IconComponent) {
    return null;
  }

  // Handle React component (function)
  if (typeof IconComponent === 'function') {
    const Component = IconComponent as React.ComponentType<React.SVGProps<SVGSVGElement>>;
    return (
      <Component
        width={auto ? (size ?? width) : undefined}
        height={auto ? (size ?? height) : undefined}
        {...svgProps}
        className={cn("shrink-0", className)}
        role={alt ? "img" : svgProps.role}
        aria-label={alt}
        style={{ color, ...(style ?? {}) }}
      />
    );
  }

  return null;
};

