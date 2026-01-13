"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import WorldMapComponent, { CountryContext } from "react-svg-worldmap";

// Mapping from ISO_A3 (3-letter) to ISO_A2 (2-letter) codes
const ISO_A3_TO_A2: Record<string, string> = {
  CAN: "CA", USA: "US", MEX: "MX", BRA: "BR",
  GBR: "GB", IRL: "IE", FRA: "FR", ESP: "ES", PRT: "PT",
  BEL: "BE", NLD: "NL", LUX: "LU", DEU: "DE", CHE: "CH",
  AUT: "AT", ITA: "IT", DNK: "DK", NOR: "NO", SWE: "SE",
  FIN: "FI", EST: "EE", LVA: "LV", LTU: "LT", POL: "PL",
  CZE: "CZ", SVK: "SK", HUN: "HU", ROU: "RO", BGR: "BG",
  GRC: "GR", HRV: "HR", SVN: "SI", TUR: "TR",
  CHN: "CN", JPN: "JP", KOR: "KR", TWN: "TW", PHL: "PH",
  IDN: "ID", MYS: "MY", THA: "TH", VNM: "VN", IND: "IN",
  SGP: "SG", ISR: "IL", ARE: "AE", SAU: "SA",
  AUS: "AU", NZL: "NZ", MLT: "MT", SRB: "RS", MDA: "MD",
  CYP: "CY",
};

export interface WorldMapProps {
  highlightedCountries?: string[]; // ISO 3166-1 alpha-3 codes
  onCountryClick?: (countryName: string, countryCode: string) => void;
}

export function WorldMap({
  highlightedCountries = [],
  onCountryClick,
}: WorldMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [mapSize, setMapSize] = useState(1200);
  const [minHeight, setMinHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, []);

  // Set responsive minHeight
  useEffect(() => {
    const updateMinHeight = () => {
      const isMobile = window.innerWidth < 768;
      setMinHeight(isMobile ? 400 : 600);
    };

    updateMinHeight();
    window.addEventListener('resize', updateMinHeight);
    
    return () => window.removeEventListener('resize', updateMinHeight);
  }, []);

  // Calculate responsive map size based on container width
  useEffect(() => {
    const updateMapSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const windowWidth = window.innerWidth;
        // Calculate size based on container width
        // For mobile: ensure map fits within viewport (account for padding)
        // For tablet: use container width
        // For desktop: cap at 1200
        let calculatedSize;
        if (windowWidth < 480) {
          // On mobile, use window width minus padding to ensure full visibility
          const availableWidth = Math.min(containerWidth, windowWidth) - 48; // Account for padding (24px each side)
          calculatedSize = Math.max(300, availableWidth);
        } else if (windowWidth < 768) {
          const availableWidth = Math.min(containerWidth, windowWidth) - 40;
          calculatedSize = Math.max(400, availableWidth);
        } else {
          calculatedSize = Math.max(600, Math.min(containerWidth * 1.2, 1200));
        }
        setMapSize(calculatedSize);
      }
    };

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateMapSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      updateMapSize(); // Initial calculation
    }
    
    // Fallback to window resize for older browsers
    window.addEventListener('resize', updateMapSize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateMapSize);
    };
  }, []);

  // Convert ISO_A3 codes to ISO_A2 codes for checking
  const highlightedCountriesA2 = useMemo(() => {
    return highlightedCountries
      .map(code => ISO_A3_TO_A2[code])
      .filter(Boolean);
  }, [highlightedCountries]);

  const handleCountryClick = (context: CountryContext<number> & { event: React.MouseEvent<SVGElement, Event> }) => {
    const countryCode = context.countryCode.toUpperCase();
    const countryName = context.countryName;
    const event = context.event;
    
    // Check if the clicked country is in the highlighted list
    const isHighlighted = highlightedCountriesA2.includes(countryCode);
    
    // Only show tooltip for highlighted countries
    if (isHighlighted) {
      // Get click position relative to the map container
      const mapContainer = event.currentTarget.closest('.worldmap-container') as HTMLElement;
      if (mapContainer) {
        const rect = mapContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        setClickPosition({ x, y });
      }
      
      setSelectedCountry({
        name: countryName,
        code: countryCode,
      });
    } else {
      // Clear tooltip if clicking on non-highlighted country
      setSelectedCountry(null);
      setClickPosition(null);
    }
    
    if (onCountryClick) {
      // Convert back to ISO_A3 if we have it
      const isoA3 = Object.entries(ISO_A3_TO_A2).find(([_, a2]) => a2 === countryCode)?.[0] || countryCode;
      onCountryClick(countryName, isoA3);
    }
  };

  // Style function to color highlighted countries orange
  const styleFunction = (context: CountryContext<number>) => {
    const countryCode = context.countryCode.toUpperCase();
    const isHighlighted = highlightedCountriesA2.includes(countryCode);
    
    return {
      fill: isHighlighted ? "#FFA008" : (isDark ? "#050927" : "#FFFFFF"), // Orange for highlighted, theme-aware for others
      stroke: isDark ? "#ffffff" : "#050927",
      strokeWidth: 1,
      strokeOpacity: 1, // Remove opacity, make borders fully visible
      cursor: "pointer",
      width: "100%",
    };
  };

  return (
    <div className="relative w-full flex justify-center" style={{ minHeight: `${minHeight}px`, height: 'auto', overflow: 'hidden' }}>
      <div 
        ref={containerRef}
        className="w-full worldmap-container" 
        style={{ 
          width: '100%', 
          minHeight: `${minHeight}px`,
          maxWidth: '100%',
        }}
      >
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="px-6 md:px-0">
          <div style={{ width: '100%', maxWidth: '100%', display: 'flex', justifyContent: 'center' }}>
            <WorldMapComponent
              color={isDark ? "#050927" : "#FFFFFF"}
              size={mapSize}
              data={[]}
              onClickFunction={handleCountryClick}
              styleFunction={styleFunction}
              strokeOpacity={1}
              tooltipBgColor={isDark ? "#ffffff" : "#050927"}
              tooltipTextColor="#FFA008"
              borderColor={isDark ? "#ffffff" : "#050927"}
              backgroundColor={isDark ? "#050927" : "#FFFFFF"}
              richInteraction
            />
          </div>
        </div>
      </div>
      {selectedCountry && clickPosition && (
        <div 
          className="absolute z-50 pointer-events-none worldmap-tooltip"
          style={{
            left: `${clickPosition.x}px`,
            top: `${clickPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
          }}
        >
          <div 
            className={`relative ${isDark ? "bg-white" : "bg-primary-default"} text-secondary-orange-bright px-3 py-1.5 rounded-lg shadow-xl font-medium border border-secondary-orange-bright/30 backdrop-blur-sm`}
            style={{
              fontSize: '0.8rem',
              letterSpacing: '0.01em',
              boxShadow: isDark 
                ? '0 6px 16px -4px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 160, 8, 0.1)' 
                : '0 6px 16px -4px rgba(5, 9, 39, 0.25), 0 0 0 1px rgba(255, 160, 8, 0.1)',
            }}
          >
            <span className="relative z-10">{selectedCountry.name}</span>
            {/* Arrow pointer */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 ${isDark ? "border-t-white" : "border-t-primary-default"}`}
              style={{
                borderLeftWidth: '6px',
                borderRightWidth: '6px',
                borderTopWidth: '6px',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                filter: isDark 
                  ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))' 
                  : 'drop-shadow(0 2px 4px rgba(5, 9, 39, 0.15))',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
