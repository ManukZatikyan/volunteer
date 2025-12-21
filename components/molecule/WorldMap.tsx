"use client";

import { useState, useMemo } from "react";
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
  AUS: "AU", NZL: "NZ",
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

  // Convert ISO_A3 codes to ISO_A2 codes for checking
  const highlightedCountriesA2 = useMemo(() => {
    return highlightedCountries
      .map(code => ISO_A3_TO_A2[code])
      .filter(Boolean);
  }, [highlightedCountries]);

  const handleCountryClick = (context: CountryContext<number> & { event: React.MouseEvent<SVGElement, Event> }) => {
    const countryCode = context.countryCode.toUpperCase();
    const countryName = context.countryName;
    
    setSelectedCountry({
      name: countryName,
      code: countryCode,
    });
    
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
      fill: isHighlighted ? "#FFA008" : "#050927", // Orange for highlighted, dark blue for others
      stroke: "#ffffff",
      strokeWidth: 1,
      strokeOpacity: 1, // Remove opacity, make borders fully visible
      cursor: "pointer",
    };
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-full h-full">
        <WorldMapComponent
          color="#050927" // Default color (will be overridden by styleFunction)
          size="responsive"
          data={[]} // Empty data - we use styleFunction to control colors
          onClickFunction={handleCountryClick}
          styleFunction={styleFunction}
          strokeOpacity={1} // Remove default opacity
          tooltipBgColor="#ffffff"
          tooltipTextColor="#FFA008"
          borderColor="#ffffff"
          backgroundColor="#050927"
          richInteraction
        />
      </div>
      {selectedCountry && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 text-secondary-orange-bright px-4 py-2 rounded-lg shadow-lg font-semibold z-10 pointer-events-none">
          {selectedCountry.name}
        </div>
      )}
    </div>
  );
}
