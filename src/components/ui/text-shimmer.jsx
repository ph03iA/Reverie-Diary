'use client';
import React from 'react';

// Simple utility function to replace cn
const cn = (...classes) => classes.filter(Boolean).join(' ');

const TextShimmer = ({ 
  children, 
  as: Component = 'p', 
  className, 
  duration = 2, 
  spread = 2 
}) => {
  const dynamicSpread = React.useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <Component
      className={cn(
        'relative inline-block bg-gradient-to-r from-transparent via-white to-transparent bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer',
        className
      )}
      style={{
        '--spread': `${dynamicSpread}px`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </Component>
  );
};

export default TextShimmer; 