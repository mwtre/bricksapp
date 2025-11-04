import React from 'react';

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 120, className = '' }) => {
  // Wall and trowel are in the same SVG. Trowel is animated across the first row.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brick Wall */}
      <g className="animate-[fadeInUp_1.5s_ease-out]">
        {/* Top Row */}
        <rect x="10" y="55" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_0.1s_both]" />
        <rect x="37" y="55" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_0.2s_both]" />
        <rect x="64" y="55" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_0.3s_both]" />
        <rect x="91" y="55" width="19" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_0.4s_both]" />
        {/* Second Row - Offset */}
        <rect x="10" y="69" width="12" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_0.5s_both]" />
        <rect x="24" y="69" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_0.6s_both]" />
        <rect x="51" y="69" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_0.7s_both]" />
        <rect x="78" y="69" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_0.8s_both]" />
        <rect x="105" y="69" width="5" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_0.9s_both]" />
        {/* Third Row */}
        <rect x="10" y="83" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_1s_both]" />
        <rect x="37" y="83" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_1.1s_both]" />
        <rect x="64" y="83" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_1.2s_both]" />
        <rect x="91" y="83" width="19" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_1.3s_both]" />
        {/* Fourth Row - Offset */}
        <rect x="10" y="97" width="12" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_1.4s_both]" />
        <rect x="24" y="97" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_1.5s_both]" />
        <rect x="51" y="97" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_1.6s_both]" />
        <rect x="78" y="97" width="25" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_1.7s_both]" />
        <rect x="105" y="97" width="5" height="12" rx="1" fill="white" className="animate-[slideIn_0.8s_ease-out_1.8s_both]" />
      </g>
      {/* Mortar lines */}
      <g className="opacity-80 animate-[fadeIn_2s_ease-out_1s_both]">
        <line x1="10" y1="67" x2="110" y2="67" stroke="white" strokeWidth="0.5" opacity="0.6" />
        <line x1="10" y1="81" x2="110" y2="81" stroke="white" strokeWidth="0.5" opacity="0.6" />
        <line x1="10" y1="95" x2="110" y2="95" stroke="white" strokeWidth="0.5" opacity="0.6" />
      </g>
      {/* Animated Trowel - falls, bounces, and slides right */}
      <g className="animate-trowelBounceSlide" style={{ pointerEvents: 'none', animationDelay: '0.7s' }}>
        <g transform="translate(10,61) rotate(-30 0 0)" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Blade */}
          <path d="M 0 0 L 18 22 L 36 0 Z" />
          {/* Neck */}
          <line x1="18" y1="0" x2="1cd brick8" y2="-20" />
          {/* Handle */}
          <g transform="rotate(80 18 -20)">
            <rect x="3" y="-26" width="20" height="13" rx="6.5" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default AnimatedLogo; 