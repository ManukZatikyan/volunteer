import { CampTabItem } from "@/components/molecule/CampTab";

export const campTabs: CampTabItem[] = [
  {
    id: "armenian",
    label: "Armenian Camp",
    imageSrc: "/image.png",
    imageAlt: "Armenian Camp",
  },
  {
    id: "international",
    label: "International Camp",
    imageSrc: "/image.png",
    imageAlt: "International Camp",
  },
];

export const armenianCampContent = {
  title: "Winter Camp",
  description:
    "Are you interested in our 5-day Winter Camp? Let us tell you about the unforgettable and wonderful holiday that awaits you. Center Up's camp programs offer a unique opportunity for personal growth, confidence building, communication skills enhancement, and creating international friendships.",
  buttonText: "Registration",
};

export const internationalCampContent = {
  title: "International Camps",
  description:
    "International Winter Camp with Center Up January 3 - January 12! Get ready for the most unforgettable 10 days of winter in Europe!",
  buttonText: "Registration",
};

export const descriptionItemsArmenianCamp = [
  {
    imageSrc: "/image.png",
    heading: "Program Goals",
    text: `<ul className="space-y-4 pl-6 text-white text-lg leading-relaxed">
    <li>Two delicious and healthy meals per day</li>
    <li>24/7 supervision and safety</li>
    <li>Perfect cleanliness throughout the camp area</li>
    <li>Experienced and caring group leaders</li>
    <li>Fun and interactive programs - quests, games, and team challenges</li>
    <li>Academic certificates awarded at the end of the program</li>
  </ul>`,
  },
  {
    imageSrc: "/image.png",
    heading: "What Awaits You in This Exclusive Camp",
    text: `<p>Expert Talks – Over 20 speakers, including current students, alumni, and educational system representativesUniversity Showcases – Student councils from local, regional, and international universities share real insights about academic life, faculties, campus environment, and opportunitiesQ&A Sessions – Direct opportunities to ask your questions to university representativesNon-formal Education Booths – Explore exchange programs, scholarships, and personal development opportunities presented by leading educational organizations</p>`,
  },
  {
    heading: "Duration and Cost",
    text: `
    <ul style="list-style-type: none!important;padding-left: 0!important;">
      <li>Location: Tsaghkadzor, Multi Rest House</li>
      <li>Program Duration: December 22–27</li>
      <li>Total fee: 69,000 AMD</li>
    </ul>`,
    contentFontSize: "body-xs",
  },
];
export const descriptionItemsInternationalCamp = [
  {
    imageSrc: "/image.png",
    heading: "What Awaits You?",
    text: `<ul style="list-style-type: disc; padding-left: 24px; color: #FFFFFF; font-size: 18px; line-height: 28px;">
  <li>10 days full of new opportunities</li>
  <li>English language courses to boost your skills</li>
  <li>Exciting adventures, cultural visits &amp; lifelong friendships</li>
  <li>International certificate – valuable for applications to American &amp; international universities!</li>
  <li>
    Explore 5 amazing European countries
    <ul style="list-style-type: disc; padding-left: 24px; margin-top: 8px;">
      <li style="margin-bottom: 8px;">Czech Republic – Prague</li>
      <li style="margin-bottom: 8px;">Austria – Vienna</li>
      <li style="margin-bottom: 8px;">Germany – Dresden</li>
      <li style="margin-bottom: 8px;">Slovakia – Bratislava</li>
      <li style="margin-bottom: 8px;">Hungary – Budapest</li>
    </ul>
  </li>
</ul>`,
  },
  {
    imageSrc: "/image.png",
    heading: "Competition & Big Discounts!",
    text: `<p>We’re launching a competition where the winners can receive up to 50% OFF! The exact discount will be determined based on your application test results and interview performance. This means the more effort and creativity you put into your application, the higher your chances of receiving a bigger discount!</p>`,
  },
  {
    heading: "Competition Process",
    text: `<ul style="list-style-type: disc; padding-left: 24px; color: #FFFFFF; font-size: 18px; line-height: 28px;">
  <li>Application Phase – Submit your application and answer all required questions.</li>
  <li>Test Phase – Complete the English language test.</li>
  <li>Interview Phase – If you're invited to the interview, it means you've successfully passed the first two stages!</li>
</ul>`,
  },
  {
    imageSrc: "/image.png",
    heading: "What’s Included?",
    text: `<ul style="list-style-type: disc; padding-left: 24px; color: #FFFFFF; font-size: 18px; line-height: 28px;">
  <li>Comfortable 10-day accommodation in Europe</li>
  <li>Guided city tours &amp; cultural programs</li>
  <li>Two meals per day</li>
  <li>Books &amp; all study materials</li>
  <li>Airport transfers (to and from the camp)</li>
  <li>Official international certificate</li>
</ul>`,
  },
  {
    heading: "Duration and Cost",
    text: `<div style="color: #FFFFFF; font-size: 18px; line-height: 28px;">
  <div>
    <strong>Program Duration:</strong> January 10-20
  </div>
  <div>
    <strong>Regular Price:</strong> €3200
  </div>
  <div>
    <div style="font-weight: bold; margin-bottom: 8px;">Discounted Prices:</div>
    <ul style="list-style-type: disc; padding-left: 24px;">
      <li style="margin-bottom: 8px;">25% OFF → €2400</li>
      <li style="margin-bottom: 8px;">35% OFF → €2080</li>
      <li style="margin-bottom: 8px;">50% OFF → €1600</li>
    </ul>
  </div>
</div>`,
  },
];
