"use client";

interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: string;
  className?: string;
  forceLightLogo?: boolean;
}

export function Logo({ 
  size = 36, 
  showText = true, 
  textSize = "text-xl", 
  className = "", 
  forceLightLogo = false 
}: LogoProps) {
  
  const iconPrimaryClass = forceLightLogo ? "fill-white" : "fill-blue-600 dark:fill-blue-400";
  const iconSecondaryStrokeClass = forceLightLogo ? "stroke-white/80" : "stroke-blue-500 dark:stroke-blue-400";
  const iconSecondaryFillClass = forceLightLogo ? "fill-white/80" : "fill-blue-700 dark:fill-blue-500";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-label="College Connect Logo"
      >
        {/* Central hub */}
        <circle 
          cx="100" cy="100" r="12" 
          className={iconPrimaryClass}
        />
        <circle cx="100" cy="100" r="21"
          className={cn("fill-none", iconSecondaryStrokeClass)}
          strokeWidth="3"
          opacity="0.4"
        />

        {/* Top arm */}
        <line x1="100" y1="79" x2="100" y2="42"
          className={iconPrimaryClass.replace("fill-", "stroke-")}
          strokeWidth="3.5" strokeLinecap="round"
        />
        {/* Top node */}
        <circle cx="100" cy="34" r="9" className={iconSecondaryFillClass} />
        <circle cx="100" cy="34" r="17"
          className={cn("fill-none", iconSecondaryStrokeClass)}
          strokeWidth="3"
          opacity="0.4"
        />

        {/* Bottom-right arm */}
        <line x1="113" y1="109" x2="148" y2="133"
          className={iconPrimaryClass.replace("fill-", "stroke-")}
          strokeWidth="3.5" strokeLinecap="round"
        />
        {/* Bottom-right node */}
        <circle cx="156" cy="138" r="9" className={iconSecondaryFillClass} />
        <circle cx="156" cy="138" r="17"
          className={cn("fill-none", iconSecondaryStrokeClass)}
          strokeWidth="3"
          opacity="0.4"
        />

        {/* Bottom-left arm */}
        <line x1="87" y1="109" x2="52" y2="133"
          className={iconPrimaryClass.replace("fill-", "stroke-")}
          strokeWidth="3.5" strokeLinecap="round"
        />
        {/* Bottom-left node */}
        <circle cx="44" cy="138" r="9" className={iconSecondaryFillClass} />
        <circle cx="44" cy="138" r="17"
          className={cn("fill-none", iconSecondaryStrokeClass)}
          strokeWidth="3"
          opacity="0.4"
        />
      </svg>

      {showText && (
        <span className={cn(
          "font-extrabold tracking-tight",
          textSize,
          forceLightLogo ? "text-white" : "text-slate-900 dark:text-white"
        )}>
          College Connect
        </span>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
