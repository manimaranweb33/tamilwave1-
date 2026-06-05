import type { ReactNode } from "react";

export function ContentRail({
  children,
  ariaLabel,
  className = ""
}: {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div className={`rail-fade relative ${className}`}>
      <div
        aria-label={ariaLabel}
        className="rail-scroll -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 pt-0.5 scroll-smooth sm:-mx-6 sm:gap-4 sm:px-6 lg:-mx-8 lg:px-8"
        role="list"
      >
        {children}
      </div>
    </div>
  );
}
