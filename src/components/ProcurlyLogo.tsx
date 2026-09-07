import React from "react";

interface ProcurlyLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark";
  showSubtitle?: boolean;
  subtitle?: string;
  variant?: "titlecase" | "styled";
}

export const ProcurlyLogo: React.FC<ProcurlyLogoProps> = ({
  className = "",
  size = "md",
  theme = "light",
  showSubtitle = true,
  subtitle = "BY AUTOHUB",
  variant = "titlecase",
}) => {
  const iconSizeClasses = {
    sm: "w-7 h-7 rounded-xl",
    md: "w-9 h-9 rounded-xl",
    lg: "w-10 h-10 rounded-2xl",
    xl: "w-12 h-12 rounded-2xl",
  }[size];

  const svgSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-5.5 h-5.5",
    xl: "w-6 h-6",
  }[size];

  const titleSizeClasses = {
    sm: "text-base",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl",
  }[size];

  const subtitleSizeClasses = {
    sm: "text-[7px]",
    md: "text-[8px] sm:text-[8.5px]",
    lg: "text-[9.5px]",
    xl: "text-xs",
  }[size];

  const procurColor = theme === "dark" ? "text-white" : "text-slate-900";
  const lyColor = "text-autohub-red";
  const subColor = theme === "dark" ? "text-slate-400" : "text-[#1e3a8a]/75";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Red Squircle with 3D Isometric Cube */}
      <div
        className={`${iconSizeClasses} bg-gradient-to-tr from-red-600 via-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-600/20 flex-shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${svgSizeClasses} text-white`}
        >
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className={`${titleSizeClasses} font-black tracking-tight leading-none`}>
          {variant === "styled" ? (
            <>
              <span className={procurColor}>PROCUR</span>
              <span className={lyColor}>ly</span>
            </>
          ) : (
            <span className={procurColor}>Procurly</span>
          )}
        </div>
        {showSubtitle && (
          <div
            className={`${subtitleSizeClasses} font-extrabold uppercase tracking-[0.16em] ${subColor} mt-1 leading-none`}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
