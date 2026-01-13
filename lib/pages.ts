// Client-safe page metadata
// This file can be imported in client components without server-side dependencies

export type PageKey = 
  | 'home'
  | 'membership'
  | 'camps'
  | 'centerUpJunior'
  | 'futureUp'
  | 'internationalUniversities'
  | 'cursesAndActivities'
  | 'conferences'
  | 'eventOrganization'
  | 'upcomingEvents'
  | 'marketing'
  | 'aboutUs'
  | 'ourTeam'
  | 'contactUs'
  | 'testimonials'
  | 'footer'
  | 'junior';

export interface PageMetadata {
  key: PageKey;
  name: string;
  route: string;
}

export const PAGES: PageMetadata[] = [
  { key: 'home', name: 'Homepage', route: '/' },
  { key: 'membership', name: 'Membership', route: '/programs/membership' },
  { key: 'camps', name: 'Camps', route: '/programs/camps' },
  { key: 'centerUpJunior', name: 'Center Up Junior', route: '/programs/centerUpJunior' },
  { key: 'futureUp', name: 'Future Up', route: '/programs/futureUp' },
  { key: 'internationalUniversities', name: 'International Universities', route: '/programs/internationalUniversities' },
  { key: 'cursesAndActivities', name: 'Courses & Activities', route: '/programs/cursesAndActivities' },
  { key: 'conferences', name: 'Conferences', route: '/programs/conferences' },
  { key: 'eventOrganization', name: 'Event Organization', route: '/programs/eventOrganization' },
  { key: 'upcomingEvents', name: 'Upcoming Events', route: '/programs/upcomingEvents' },
  { key: 'marketing', name: 'Marketing', route: '/programs/marketing' },
  { key: 'ourTeam', name: 'Our Team', route: '/ourTeam' },
  { key: 'contactUs', name: 'Contact Us', route: '/contactUs' },
];

// Pages that are allowed to have forms
export const FORM_ALLOWED_PAGES: PageKey[] = [
  'cursesAndActivities',
  'membership',
  'centerUpJunior',
  'internationalUniversities',
  'futureUp',
  'conferences',
  'camps',
  'eventOrganization',
  'upcomingEvents',
];

// Get pages that are allowed to have forms
export const getFormAllowedPages = (): PageMetadata[] => {
  return PAGES.filter(page => FORM_ALLOWED_PAGES.includes(page.key));
};

