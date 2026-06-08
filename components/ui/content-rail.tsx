"use client";

import type { ReactNode, WheelEvent } from "react";

function onRailWheel(event: WheelEvent<HTMLDivElement>) {
  const target = event.currentTarget;
  const horizontalDelta = Math.abs(event.deltaX);
  const verticalDelta = Math.abs(event.deltaY);
  const canScroll = target.scrollWidth > target.clientWidth;

  if (!canScroll || horizontalDelta >= verticalDelta || verticalDelta === 0) return;

  event.preventDefault();
  target.scrollLeft += event.deltaY;
}

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
        onWheel={onRailWheel}
        role="list"
      >
        {children}
      </div>
    </div>
  );
}
