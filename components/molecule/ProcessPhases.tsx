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

const PhaseItem: React.FC<{ 
  phase: ProcessPhase;
  index: number;
  totalPhases: number;
  phases: ProcessPhase[];
}> = ({ phase, index, totalPhases, phases }) => {
  const isLeftPosition = phase.position === "left";
  const isLastPhase = index === totalPhases - 1;
  const nextPhase = !isLastPhase ? phases[index + 1] : null;
  const nextIsLeft = nextPhase?.position === "left";
  const showConnector = !isLastPhase && ((isLeftPosition && !nextIsLeft) || (!isLeftPosition && nextIsLeft));
  const connectorDirection = showConnector ? (isLeftPosition ? "down-right" : "down-left") : null;

  return (
    <div className={`relative flex gap-4 px-6 max-w-[830px] md:max-w-none md:px-0 ${isLeftPosition ? 'md:mr-auto md:max-w-[45%]' : 'md:ml-auto md:max-w-[45%]'}`}>
      {/* Mobile: Icon always on left, Desktop: Icon on left for left phases */}
      {isLeftPosition && (
        <div className="w-[86px]! flex items-center justify-center shrink-0">
          <div className="w-[86px]! h-[86px]! bg-secondary-orange-bright rounded-full flex items-center justify-center">
            <p className="text-white text-hero-sm leading-hero-sm">
              {phase.number}
            </p>
          </div>
        </div>
      )}
      <div className="flex-1">
        <h4 className="text-white body-sm-mobile md:text-base md:font-bold mb-1.5">{phase.title}</h4>
        <p className="text-white body-xs md:text-sm md:leading-relaxed">{phase.description}</p>
      </div>
      {/* Mobile: Icon on right for right phases, Desktop: Icon on right for right phases */}
      {!isLeftPosition && (
        <div className="w-[86px]! flex items-center justify-center shrink-0">
          <div className="w-[86px]! h-[86px]! bg-secondary-orange-bright rounded-full flex items-center justify-center">
            <p className="text-white text-hero-sm leading-hero-sm">
              {phase.number}
            </p>
          </div>
        </div>
      )}
      
      {/* Mobile connector lines - using original svgPath from data */}
      {phase.svgPath && (
        <div className={`absolute md:hidden ${phase.topPosition} ${phase.rightPosition}`}>
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
      
      {/* Desktop connector lines - responsive */}
      {showConnector && connectorDirection && (
        <div className={`absolute hidden md:block ${isLeftPosition && connectorDirection === "down-right" ? "top-[86px] left-[86px]" : !isLeftPosition && connectorDirection === "down-left" ? "top-[86px] right-[86px]" : ""} pointer-events-none z-0 overflow-hidden`} style={{ width: connectorDirection === "down-right" ? "calc(50vw - 43px)" : "calc(50vw - 43px)", maxWidth: connectorDirection === "down-right" ? "1071px" : "1255px", height: connectorDirection === "down-right" ? "128px" : "124px" }}>
          <svg width="100%" height="100%" viewBox={connectorDirection === "down-right" ? "0 0 1071 128" : "0 0 1255 124"} fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            {connectorDirection === "down-right" ? (
              <path d="M4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2H2H4ZM514.017 66.4262L513.612 64.4676L514.017 66.4262ZM1069.37 123.965C1070.46 123.759 1071.17 122.713 1070.96 121.627L1067.61 103.942C1067.41 102.857 1066.36 102.144 1065.27 102.35C1064.19 102.556 1063.48 103.602 1063.68 104.687L1066.66 120.408L1050.94 123.388C1049.86 123.593 1049.14 124.64 1049.35 125.725C1049.56 126.81 1050.6 127.523 1051.69 127.318L1069.37 123.965ZM2 2H0C0 10.1002 4.17287 17.9859 11.5557 25.4028C18.9445 32.8258 29.7078 39.9487 43.318 46.5773C70.5489 59.8394 109.55 71.3012 156.857 79.1574C251.496 94.8739 379.748 96.2217 514.422 68.3848L514.017 66.4262L513.612 64.4676C379.422 92.2045 251.666 90.8474 157.512 75.2114C110.423 67.3915 71.8319 56.0151 45.0695 42.9811C31.6831 36.4616 21.3495 29.572 14.3906 22.5809C7.42568 15.5838 4 8.65387 4 2H2ZM514.017 66.4262L514.422 68.3848C621.419 46.2685 737.568 44.9136 838.14 56.7054C938.794 68.507 1023.52 93.4387 1067.87 123.653L1069 122L1070.13 120.347C1024.96 89.5777 939.443 64.5556 838.606 52.7327C737.686 40.9001 621.1 42.25 513.612 64.4676L514.017 66.4262Z" fill="#FFA008"/>
            ) : (
              <path d="M1159.04 1.62456C1159.24 0.539681 1160.29 -0.171482 1161.38 0.0361359C1162.46 0.243754 1163.17 1.29153 1162.96 2.37641L1161 2.00049L1159.04 1.62456ZM566.626 46.7908L567.167 44.8654L566.626 46.7908ZM94.2257 123.988C93.1282 124.112 92.1375 123.324 92.0128 122.226L89.9811 104.341C89.8564 103.244 90.645 102.253 91.7426 102.128C92.8401 102.004 93.8308 102.792 93.9556 103.89L95.7615 119.788L111.659 117.982C112.757 117.857 113.748 118.646 113.872 119.743C113.997 120.841 113.208 121.831 112.111 121.956L94.2257 123.988ZM1161 2.00049L1162.96 2.37641C1156.19 37.7566 1131.89 62.983 1095.45 79.7216C1059.05 96.4369 1010.38 104.784 954.344 106.446C842.248 109.771 700.054 86.3522 566.085 48.7163L566.626 46.7908L567.167 44.8654C700.915 82.4391 842.679 105.756 954.225 102.448C1010.01 100.794 1058.08 92.4831 1093.78 76.0867C1129.43 59.7137 1152.58 35.3748 1159.04 1.62456L1161 2.00049ZM566.626 46.7908L566.085 48.7163C457.95 18.3379 355.082 18.3461 271.825 35.302C188.48 52.2758 125.08 86.1657 95.5648 123.246L94 122L92.4352 120.755C122.785 82.6256 187.25 48.4442 271.027 31.3824C354.892 14.3026 458.405 14.3109 567.167 44.8654L566.626 46.7908Z" fill="#FFA008"/>
            )}
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
    <div className={`flex flex-col gap-12 md:gap-[140px] py-12 ${className}`}>
      {phases.map((phase, index) => (
        <PhaseItem 
          key={phase.number} 
          phase={phase} 
          index={index}
          totalPhases={phases.length}
          phases={phases}
        />
      ))}
    </div>
  );
};

