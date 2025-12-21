// ISO 3166-1 alpha-3 country codes for countries to highlight in orange on the map
export const highlightedCountries = [
  // North America
  "CAN", // Canada
  "USA", // United States
  "MEX", // Mexico
  // South America
  "BRA", // Brazil
  // Europe
  "GBR", // United Kingdom
  "IRL", // Ireland
  "FRA", // France
  "ESP", // Spain
  "PRT", // Portugal
  "BEL", // Belgium
  "NLD", // Netherlands
  "LUX", // Luxembourg
  "DEU", // Germany
  "CHE", // Switzerland
  "AUT", // Austria
  "ITA", // Italy
  "DNK", // Denmark
  "NOR", // Norway
  "SWE", // Sweden
  "FIN", // Finland
  "EST", // Estonia
  "LVA", // Latvia
  "LTU", // Lithuania
  "POL", // Poland
  "CZE", // Czech Republic
  "SVK", // Slovakia
  "HUN", // Hungary
  "ROU", // Romania
  "BGR", // Bulgaria
  "GRC", // Greece
  "HRV", // Croatia
  "SVN", // Slovenia
  // Asia
  "CHN", // China
  "JPN", // Japan
  "KOR", // South Korea
  "TWN", // Taiwan
  "PHL", // Philippines
  "IDN", // Indonesia
  "MYS", // Malaysia
  "THA", // Thailand
  "VNM", // Vietnam
  "IND", // India
  "SGP", // Singapore
  "ISR", // Israel
  "ARE", // United Arab Emirates
  "SAU", // Saudi Arabia
  "TUR", // Turkey
  // Oceania
  "AUS", // Australia
  "NZL", // New Zealand
];

export const heroSection = {
    title: "International Universities",
    imageSrc: "/image.png",
    imageAlt: "International Universities",
  };
  export const description = {
    text: "Center Up provides comprehensive guidance for students pursuing higher education abroad. From selecting the right university to securing a student visa, we support every step of the journey. Our personalized approach includes strategic planning, document preparation, application submission, interview training, and visa assistance. With expert support and a proven process, we help students gain admission to top universities in over 40 countries worldwide.",
  };

  export const phases = [
    {
      number: 1,
      title: "Research & University Selection Phase",
      description:
        "During this phase, we conduct an in-depth analysis based on the student's academic goals, professional interests and financial capabilities.",
      svgPath:
        "M4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2H2H4ZM145 51.9303L144.474 50.0008L145 51.9303ZM299.411 96.9113C300.467 97.2366 301.586 96.6444 301.911 95.5888L307.211 78.3867C307.536 77.3311 306.944 76.2117 305.888 75.8865C304.833 75.5613 303.713 76.1534 303.388 77.209L298.677 92.4998L283.387 87.7891C282.331 87.4639 281.212 88.056 280.886 89.1116C280.561 90.1672 281.153 91.2866 282.209 91.6118L299.411 96.9113ZM2 2H0C0 26.2032 20.4404 43.6445 48.2431 52.7356C76.1754 61.8691 112.325 62.9134 145.526 53.8599L145 51.9303L144.474 50.0008C111.98 58.8615 76.6303 57.8095 49.4862 48.9337C22.2125 40.0155 4 23.5345 4 2H2ZM145 51.9303L145.526 53.8599C175.994 45.5516 208.144 44.5315 235.704 51.3936C263.263 58.2553 286.071 72.9453 298.232 95.9352L300 95L301.768 94.0648C288.929 69.7924 264.987 54.5623 236.671 47.5121C208.356 40.4623 175.506 41.5386 144.474 50.0008L145 51.9303Z",
      svgWidth: 308,
      svgHeight: 97,
      svgViewBox: "0 0 308 97",
      position: "left" as const,
      topPosition: "top-21",
      rightPosition: "right-16.5",
    },
    {
      number: 2,
      title: "Document Preparation Phase",
      description:
        "Center Up provides a comprehensive checklist tailored to the specific requirements of each university and assists in the accurate preparation of all required documents, including:",
      svgPath:
        "M284.005 1.86475C284.079 0.762713 285.033 -0.070116 286.135 0.00457811C287.237 0.0792723 288.07 1.0332 287.995 2.13525L286 2L284.005 1.86475ZM140.265 54.1591L140.677 52.2021L140.265 54.1591ZM1.8642 93.4954C0.762177 93.4204 -0.0703735 92.4662 0.00460815 91.3642L1.2269 73.4057C1.30191 72.3037 2.25607 71.4712 3.35809 71.5462C4.46011 71.6212 5.29266 72.5753 5.21765 73.6774L4.1312 89.6404L20.0943 90.7269C21.1963 90.8019 22.0288 91.7561 21.9538 92.8581C21.8788 93.9601 20.9247 94.7927 19.8226 94.7177L1.8642 93.4954ZM286 2L287.995 2.13525C286.172 29.033 266.835 46.3654 239.372 54.9964C211.935 63.619 176.008 63.7353 139.853 56.1161L140.265 54.1591L140.677 52.2021C176.389 59.7277 211.582 59.5371 238.173 51.1804C264.737 42.832 282.334 26.5124 284.005 1.86475L286 2ZM140.265 54.1591L139.853 56.1161C109.926 49.8096 80.9018 54.5622 56.7525 63.1617C32.5902 71.7658 13.4351 84.1766 3.31491 93.007L2 91.5L0.685089 89.993C11.1941 80.8234 30.789 68.1611 55.4106 59.3934C80.0453 50.6211 109.839 45.7033 140.677 52.2021L140.265 54.1591Z",
      svgWidth: 288,
      svgHeight: 95,
      svgViewBox: "0 0 288 95",
      position: "right" as const,
      topPosition: "top-23",
      rightPosition: "right-16.5",
    },
    {
      number: 3,
      title: "Application Submission Phase",
      description:
        "In this stage, we launch the official submission of applications. Our specialists oversee the entire process, including:",
      svgPath:
        "M4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2H2H4ZM145 42.2664L145.607 44.1721L145 42.2664ZM290.593 74.9582C291.675 75.1829 292.733 74.4884 292.958 73.4069L296.62 55.7833C296.845 54.7019 296.15 53.643 295.069 53.4183C293.987 53.1936 292.929 53.8881 292.704 54.9696L289.449 70.6349L273.783 67.3798C272.702 67.1551 271.643 67.8496 271.418 68.9311C271.194 70.0125 271.888 71.0714 272.97 71.2961L290.593 74.9582ZM2 2H0C0 11.9984 5.35814 20.913 14.0397 28.2503C22.7173 35.5843 34.8644 41.4859 48.9106 45.5406C77.0027 53.65 113.158 54.5055 145.607 44.1721L145 42.2664L144.393 40.3607C112.749 50.4377 77.4047 49.6027 50.02 41.6975C36.3277 37.745 24.7422 32.0584 16.6217 25.1953C8.50529 18.3356 4 10.4443 4 2H2ZM145 42.2664L145.607 44.1721C205.728 25.0262 265.049 37.0814 289.328 74.0969L291 73L292.672 71.9031C266.951 32.6891 205.272 20.9738 144.393 40.3607L145 42.2664Z",
      svgWidth: 297,
      svgHeight: 75,
      svgViewBox: "0 0 297 75",
      position: "left" as const,
      topPosition: "top-17.5",
      rightPosition: "right-19",
    },
    {
      number: 4,
      title: "Interview Preparation Phase",
      description:
        "If the student is invited to an interview, a targeted preparation process begins, which includes:",
      svgPath:
        "M287.508 1.82488C287.604 0.724549 288.575 -0.0890367 289.675 0.00768185C290.775 0.104401 291.589 1.0748 291.492 2.17512L289.5 2L287.508 1.82488ZM133.166 45.1439L133.487 43.1698L133.166 45.1439ZM1.61609 75.9628C0.532043 75.7508 -0.174835 74.7001 0.0372009 73.6161L3.4924 55.9508C3.70444 54.8668 4.7551 54.1599 5.83914 54.3719C6.92316 54.584 7.63007 55.6346 7.41803 56.7187L4.34671 72.4211L20.0492 75.4924C21.1332 75.7044 21.8401 76.7551 21.6281 77.8391C21.416 78.9232 20.3654 79.6301 19.2813 79.418L1.61609 75.9628ZM289.5 2L291.492 2.17512C290.519 13.2464 286.445 22.7341 279.197 30.4165C271.971 38.0752 261.697 43.83 248.484 47.6565C222.108 55.2951 183.61 55.367 132.845 47.118L133.166 45.1439L133.487 43.1698C184.056 51.3871 221.851 51.2052 247.372 43.8144C260.107 40.1261 269.682 34.6723 276.287 27.6715C282.87 20.6945 286.607 12.0718 287.508 1.82488L289.5 2ZM133.166 45.1439L132.845 47.118C68.3674 36.6408 25.0354 60.9121 3.11646 75.6594L2 74L0.883545 72.3406C23.2235 57.3101 67.5962 32.463 133.487 43.1698L133.166 45.1439Z",
      svgWidth: 292,
      svgHeight: 80,
      svgViewBox: "0 0 292 80",
      position: "right" as const,
      topPosition: "top-17",
      rightPosition: "right-16.5",
    },
    {
      number: 5,
      title: "Visa Support",
      description:
        "The final stage of the process includes full assistance with student visa applications, such as:",
      svgPath: "",
      svgWidth: 0,
      svgHeight: 0,
      svgViewBox: "0 0 0 0",
      position: "left" as const,
      topPosition: "",
      rightPosition: "",
    },
  ];
  