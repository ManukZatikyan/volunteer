"use client";

import React from "react";

export interface ProcessPhase {
  number: number;
  title: string;
  description: string;
  svgPath: string;
  svgWidth: number;
  svgHeight: number;
  svgViewBox: string;
  position: "left" | "right";
  topPosition: string;
  rightPosition: string;
}

export interface ProcessPhasesProps {
  phases: ProcessPhase[];
  className?: string;
}

const PhaseItem: React.FC<{ phase: ProcessPhase }> = ({ phase }) => {
  const isLeftPosition = phase.position === "left";

  return (
    <div className="relative flex gap-4 px-6">
      {isLeftPosition && (
        <div className="w-[86px]! flex items-center justify-center">
          <div className="w-[86px]! h-[86px]! bg-secondary-orange-bright rounded-full flex items-center justify-center">
            <p className="text-white text-hero-sm leading-hero-sm">
              {phase.number}
            </p>
          </div>
        </div>
      )}
      <div>
        <h4 className="text-white body-sm-mobile mb-1.5">{phase.title}</h4>
        <p className="text-white body-xs">{phase.description}</p>
      </div>
      {!isLeftPosition && (
        <div className="w-[86px]! flex items-center justify-center">
          <div className="w-[86px]! h-[86px]! bg-secondary-orange-bright rounded-full flex items-center justify-center">
            <p className="text-white text-hero-sm leading-hero-sm">
              {phase.number}
            </p>
          </div>
        </div>
      )}
      {phase.svgPath && (
        <div
          className={`absolute ${phase.topPosition} ${phase.rightPosition}`}
        >
          <svg
            width={phase.svgWidth}
            height={phase.svgHeight}
            viewBox={phase.svgViewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={phase.svgPath} fill="#FFA008" />
          </svg>
        </div>
      )}
    </div>
  );
};

export const ProcessPhases: React.FC<ProcessPhasesProps> = ({
  phases,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-12 py-12 ${className}`}>
      {phases.map((phase) => (
        <PhaseItem key={phase.number} phase={phase} />
      ))}
    </div>
  );
};

