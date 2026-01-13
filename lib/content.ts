// Content management utilities
// Uses MongoDB for storage
import connectDB from './db';
import PageContent from './models/PageContent';
import { PAGES, type PageKey, type PageMetadata } from './pages';

// Re-export for backward compatibility
export { PAGES, type PageKey, type PageMetadata };

// Helper function to get content from MongoDB
async function getContentFromDB(pageKey: PageKey, locale: string): Promise<any | null> {
  try {
    await connectDB();
    const doc = await PageContent.findOne({ pageKey, locale });
    return doc ? doc.content : null;
  } catch (error) {
    console.error(`Error loading content from DB for ${pageKey}_${locale}:`, error);
    return null;
  }
}

// Helper function to save content to MongoDB
async function saveContentToDB(pageKey: PageKey, locale: string, content: any): Promise<void> {
  try {
    await connectDB();
    await PageContent.findOneAndUpdate(
      { pageKey, locale },
      { pageKey, locale, content },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error(`Error saving content to DB for ${pageKey}_${locale}:`, error);
    throw error;
  }
}

// Helper function to merge images from another locale (prioritize non-empty images from saved content)
function mergeImages(baseContent: any, otherLocaleContent: any, pageKey: PageKey): any {
  if (!otherLocaleContent || !baseContent) return baseContent;
  
  // For home page, merge images in upcomingEvents and programs arrays
  if (pageKey === 'home') {
    const merged = { ...baseContent };
    
    // Merge upcomingEvents images - prioritize other locale's image if it's non-empty
    if (Array.isArray(merged.upcomingEvents) && Array.isArray(otherLocaleContent.upcomingEvents)) {
      merged.upcomingEvents = merged.upcomingEvents.map((item: any, index: number) => {
        const otherItem = otherLocaleContent.upcomingEvents[index];
        // Use other locale's image if it exists and is non-empty, otherwise keep current
        if (otherItem && otherItem.image && otherItem.image.trim() !== '') {
          return { ...item, image: otherItem.image };
        }
        // Keep current image (could be from messages or already set)
        return item;
      });
    }
    
    // Merge programs images - prioritize other locale's image if it's non-empty
    if (Array.isArray(merged.programs) && Array.isArray(otherLocaleContent.programs)) {
      merged.programs = merged.programs.map((item: any, index: number) => {
        const otherItem = otherLocaleContent.programs[index];
        // Use other locale's image if it exists and is non-empty, otherwise keep current
        if (otherItem && otherItem.image && otherItem.image.trim() !== '') {
          return { ...item, image: otherItem.image };
        }
        // Keep current image (could be from messages or already set)
        return item;
      });
    }
    
    return merged;
  }
  
  // For ourTeam page, merge images in departments.items array
  if (pageKey === 'ourTeam') {
    const merged = { ...baseContent };
    
    if (merged.departments?.items && otherLocaleContent.departments?.items) {
      merged.departments = {
        ...merged.departments,
        items: merged.departments.items.map((item: any, index: number) => {
          const otherItem = otherLocaleContent.departments.items[index];
          // Use other locale's image if it exists and is non-empty, otherwise keep current
          if (otherItem && otherItem.image && otherItem.image.trim() !== '') {
            return { ...item, image: otherItem.image };
          }
          // Keep current image (could be from messages or already set)
          return item;
        }),
      };
    }
    
    return merged;
  }
  
  // For membership, centerUpJunior, futureUp, cursesAndActivities, conferences, eventOrganization, and upcomingEvents pages, merge imageSrc in descriptionItems array
  if (pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents') {
    const merged = { ...baseContent };
    
    if (merged.descriptionItems && otherLocaleContent.descriptionItems && Array.isArray(merged.descriptionItems) && Array.isArray(otherLocaleContent.descriptionItems)) {
      merged.descriptionItems = merged.descriptionItems.map((item: any, index: number) => {
        const otherItem = otherLocaleContent.descriptionItems[index];
        // Use other locale's imageSrc if it exists and is non-empty, otherwise keep current
        if (otherItem && otherItem.imageSrc && otherItem.imageSrc.trim() !== '') {
          return { ...item, imageSrc: otherItem.imageSrc };
        }
        // Keep current imageSrc (could be from messages or already set)
        return item;
      });
    }
    
    return merged;
  }
  
  // For camps page, merge imageSrc in armenianCamp.descriptionItems and internationalCamp.descriptionItems arrays
  if (pageKey === 'camps') {
    const merged = { ...baseContent };
    
    // Merge armenianCamp.descriptionItems images
    if (merged.armenianCamp?.descriptionItems && otherLocaleContent.armenianCamp?.descriptionItems && 
        Array.isArray(merged.armenianCamp.descriptionItems) && Array.isArray(otherLocaleContent.armenianCamp.descriptionItems)) {
      merged.armenianCamp.descriptionItems = merged.armenianCamp.descriptionItems.map((item: any, index: number) => {
        const otherItem = otherLocaleContent.armenianCamp.descriptionItems[index];
        if (otherItem && otherItem.imageSrc && otherItem.imageSrc.trim() !== '') {
          return { ...item, imageSrc: otherItem.imageSrc };
        }
        return item;
      });
    }
    
    // Merge internationalCamp.descriptionItems images
    if (merged.internationalCamp?.descriptionItems && otherLocaleContent.internationalCamp?.descriptionItems && 
        Array.isArray(merged.internationalCamp.descriptionItems) && Array.isArray(otherLocaleContent.internationalCamp.descriptionItems)) {
      merged.internationalCamp.descriptionItems = merged.internationalCamp.descriptionItems.map((item: any, index: number) => {
        const otherItem = otherLocaleContent.internationalCamp.descriptionItems[index];
        if (otherItem && otherItem.imageSrc && otherItem.imageSrc.trim() !== '') {
          return { ...item, imageSrc: otherItem.imageSrc };
        }
        return item;
      });
    }
    
    // Merge tabs images
    if (merged.tabs && otherLocaleContent.tabs && Array.isArray(merged.tabs) && Array.isArray(otherLocaleContent.tabs)) {
      merged.tabs = merged.tabs.map((item: any, index: number) => {
        const otherItem = otherLocaleContent.tabs[index];
        if (otherItem && otherItem.imageSrc && otherItem.imageSrc.trim() !== '') {
          return { ...item, imageSrc: otherItem.imageSrc };
        }
        return item;
      });
    }
    
    return merged;
  }
  
  return baseContent;
}

export async function getPageContent(pageKey: PageKey, locale: string = 'en'): Promise<any> {
  // Helper to load other locale content from MongoDB
  const loadOtherLocaleFromDB = async (pageKey: PageKey, otherLocale: string) => {
    return await getContentFromDB(pageKey, otherLocale);
  };
  
  // Try to load from MongoDB first (this is now the primary source)
  let baseContent = await getContentFromDB(pageKey, locale);
  
  // If not in MongoDB, try to load from messages JSON files (fallback for migration period)
  if (!baseContent) {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const messagesPath = path.join(process.cwd(), 'messages', `${locale}.json`);
      
      try {
        const messagesContentStr = await fs.readFile(messagesPath, 'utf-8');
        const messages = JSON.parse(messagesContentStr);
        
        // Map pageKey to messages key
        let messagesKey = pageKey;
        if (pageKey === 'centerUpJunior') {
          messagesKey = 'junior';
        } else if (pageKey === 'cursesAndActivities') {
          messagesKey = 'coursesAndActivities';
        } else if (pageKey === 'camps') {
          messagesKey = 'camp';
        }
        
        if (messages[messagesKey]) {
          const pageContent = messages[messagesKey];
          
          // Transform based on page type
          if (pageKey === 'home') {
            baseContent = {
              upcomingEvents: Array.isArray(pageContent.upcomingEvents?.events) 
                ? pageContent.upcomingEvents.events 
                : (Array.isArray(pageContent.upcomingEvents) ? pageContent.upcomingEvents : []),
              programs: Array.isArray(pageContent.programs?.items) 
                ? pageContent.programs.items 
                : (Array.isArray(pageContent.programs) ? pageContent.programs : []),
            };
          } else if (pageKey === 'ourTeam') {
            baseContent = {
              departments: {
                title: pageContent.departments?.title || 'Departments',
                items: Array.isArray(pageContent.departments?.items) 
                  ? pageContent.departments.items 
                  : [],
              },
            };
          } else if (pageKey === 'marketing') {
            // Transform socialLinks to linkedin field for easier editing
            baseContent = {
              headOfMarketing: pageContent.headOfMarketing ? {
                ...pageContent.headOfMarketing,
                linkedin: pageContent.headOfMarketing.socialLinks?.find((link: any) => link.name === 'linkedin')?.href || '',
                image: pageContent.headOfMarketing.imageSrc || pageContent.headOfMarketing.image || '',
              } : null,
              members: {
                title: pageContent.members?.title || 'Members',
                items: Array.isArray(pageContent.members?.items)
                  ? pageContent.members.items.map((item: any) => ({
                      ...item,
                      linkedin: item.socialLinks?.find((link: any) => link.name === 'linkedin')?.href || '',
                      image: item.imageSrc || item.image || '',
                    }))
                  : [],
              },
            };
          } else {
            baseContent = pageContent;
          }
        }
      } catch (fileError) {
        // Messages file doesn't exist, continue to data files
      }
    } catch (error) {
      // Directory doesn't exist, continue to data files
    }
  }
  
  // Fallback to data files if not in MongoDB or messages
  if (!baseContent) {
    try {
      const module = await import(`@/data/${pageKey}`);
      const content: any = {};
      for (const key in module) {
        if (key !== 'default' && typeof module[key] !== 'function') {
          content[key] = module[key];
        }
      }
      
      baseContent = Object.keys(content).length > 0 ? content : module;
    } catch (error) {
      console.error(`Error loading content for ${pageKey}:`, error);
      return null;
    }
  }
  
  // Transform marketing content to editing format if needed (for content from MongoDB)
  if (baseContent && pageKey === 'marketing') {
    // Check if it's in storage format (has socialLinks) or editing format (has linkedin)
    if (baseContent.headOfMarketing && baseContent.headOfMarketing.socialLinks && !baseContent.headOfMarketing.linkedin) {
      // Transform from storage format to editing format
      baseContent = {
        headOfMarketing: baseContent.headOfMarketing ? {
          ...baseContent.headOfMarketing,
          linkedin: baseContent.headOfMarketing.socialLinks?.find((link: any) => link.name === 'linkedin')?.href || '',
          image: baseContent.headOfMarketing.imageSrc || baseContent.headOfMarketing.image || '',
        } : null,
        members: {
          title: baseContent.members?.title || 'Members',
          items: Array.isArray(baseContent.members?.items)
            ? baseContent.members.items.map((item: any) => ({
                ...item,
                linkedin: item.socialLinks?.find((link: any) => link.name === 'linkedin')?.href || '',
                image: item.imageSrc || item.image || '',
              }))
            : [],
        },
      };
    }
  }
  
  // Merge images from other locale
  if (baseContent) {
    const otherLocale = locale === 'en' ? 'hy' : 'en';
    let otherLocaleContent = await loadOtherLocaleFromDB(pageKey, otherLocale);
    
    // Transform other locale content to editing format if marketing
    if (otherLocaleContent && pageKey === 'marketing') {
      if (otherLocaleContent.headOfMarketing && otherLocaleContent.headOfMarketing.socialLinks && !otherLocaleContent.headOfMarketing.linkedin) {
        otherLocaleContent = {
          headOfMarketing: otherLocaleContent.headOfMarketing ? {
            ...otherLocaleContent.headOfMarketing,
            linkedin: otherLocaleContent.headOfMarketing.socialLinks?.find((link: any) => link.name === 'linkedin')?.href || '',
            image: otherLocaleContent.headOfMarketing.imageSrc || otherLocaleContent.headOfMarketing.image || '',
          } : null,
          members: {
            title: otherLocaleContent.members?.title || 'Members',
            items: Array.isArray(otherLocaleContent.members?.items)
              ? otherLocaleContent.members.items.map((item: any) => ({
                  ...item,
                  linkedin: item.socialLinks?.find((link: any) => link.name === 'linkedin')?.href || '',
                  image: item.imageSrc || item.image || '',
                }))
              : [],
          },
        };
      }
    }
    
    // Merge images from other locale
    if (otherLocaleContent) {
      baseContent = mergeImages(baseContent, otherLocaleContent, pageKey);
    }
    
    return baseContent;
  }
  
  return null;
}

// Helper function to extract images from content
function extractImages(content: any, pageKey: PageKey): any {
  if (pageKey === 'home') {
    const images: any = {};
    
    if (Array.isArray(content.upcomingEvents)) {
      images.upcomingEvents = content.upcomingEvents.map((item: any) => ({
        image: item.image || null
      }));
    }
    
    if (Array.isArray(content.programs)) {
      images.programs = content.programs.map((item: any) => ({
        image: item.image || null
      }));
    }
    
    return images;
  }
  
  if (pageKey === 'ourTeam') {
    const images: any = {};
    
    if (content.departments?.items && Array.isArray(content.departments.items)) {
      images.departments = content.departments.items.map((item: any) => ({
        image: item.image || null
      }));
    }
    
    return images;
  }
  
  if (pageKey === 'marketing') {
    const images: any = {};
    
    if (content.headOfMarketing?.image) {
      images.headOfMarketing = { image: content.headOfMarketing.image };
    }
    
    if (content.members?.items && Array.isArray(content.members.items)) {
      images.members = content.members.items.map((item: any) => ({
        image: item.image || null
      }));
    }
    
    return images;
  }
  
  if (pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents') {
    const images: any = {};
    
    if (content.descriptionItems && Array.isArray(content.descriptionItems)) {
      images.descriptionItems = content.descriptionItems.map((item: any) => ({
        imageSrc: item.imageSrc || null
      }));
    }
    
    return images;
  }
  
  if (pageKey === 'camps') {
    const images: any = {};
    
    if (content.armenianCamp?.descriptionItems && Array.isArray(content.armenianCamp.descriptionItems)) {
      images.armenianCamp = {
        descriptionItems: content.armenianCamp.descriptionItems.map((item: any) => ({
          imageSrc: item.imageSrc || null
        }))
      };
    }
    
    if (content.internationalCamp?.descriptionItems && Array.isArray(content.internationalCamp.descriptionItems)) {
      images.internationalCamp = {
        descriptionItems: content.internationalCamp.descriptionItems.map((item: any) => ({
          imageSrc: item.imageSrc || null
        }))
      };
    }
    
    if (content.tabs && Array.isArray(content.tabs)) {
      images.tabs = content.tabs.map((item: any) => ({
        imageSrc: item.imageSrc || null
      }));
    }
    
    return images;
  }
  
  return {};
}

// Helper function to apply images to content (always apply, overwrite existing)
function applyImages(baseContent: any, images: any, pageKey: PageKey): any {
  if (pageKey === 'home') {
    const merged = { ...baseContent };
    
    if (Array.isArray(images.upcomingEvents) && Array.isArray(merged.upcomingEvents)) {
      merged.upcomingEvents = merged.upcomingEvents.map((item: any, index: number) => {
        const imageItem = images.upcomingEvents[index];
        // Always apply image if provided, even if it's empty (to clear it)
        if (imageItem !== undefined) {
          return { ...item, image: imageItem.image || item.image || '' };
        }
        return item;
      });
    }
    
    if (Array.isArray(images.programs) && Array.isArray(merged.programs)) {
      merged.programs = merged.programs.map((item: any, index: number) => {
        const imageItem = images.programs[index];
        // Always apply image if provided, even if it's empty (to clear it)
        if (imageItem !== undefined) {
          return { ...item, image: imageItem.image || item.image || '' };
        }
        return item;
      });
    }
    
    return merged;
  }
  
  if (pageKey === 'ourTeam') {
    const merged = { ...baseContent };
    
    if (Array.isArray(images.departments) && merged.departments?.items && Array.isArray(merged.departments.items)) {
      merged.departments = {
        ...merged.departments,
        items: merged.departments.items.map((item: any, index: number) => {
          const imageItem = images.departments[index];
          // Always apply image if provided, even if it's empty (to clear it)
          if (imageItem !== undefined) {
            return { ...item, image: imageItem.image || item.image || '' };
          }
          return item;
        }),
      };
    }
    
    return merged;
  }
  
  if (pageKey === 'marketing') {
    const merged = { ...baseContent };
    
    // Apply image to headOfMarketing
    if (images.headOfMarketing && merged.headOfMarketing) {
      merged.headOfMarketing = {
        ...merged.headOfMarketing,
        image: images.headOfMarketing.image || merged.headOfMarketing.image || '',
      };
    }
    
    // Apply images to members
    if (Array.isArray(images.members) && merged.members?.items && Array.isArray(merged.members.items)) {
      merged.members = {
        ...merged.members,
        items: merged.members.items.map((item: any, index: number) => {
          const imageItem = images.members[index];
          // Always apply image if provided, even if it's empty (to clear it)
          if (imageItem !== undefined) {
            return { ...item, image: imageItem.image || item.image || '' };
          }
          return item;
        }),
      };
    }
    
    return merged;
  }
  
  if (pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents') {
    const merged = { ...baseContent };
    
    // Apply imageSrc to descriptionItems
    if (Array.isArray(images.descriptionItems) && merged.descriptionItems && Array.isArray(merged.descriptionItems)) {
      merged.descriptionItems = merged.descriptionItems.map((item: any, index: number) => {
        const imageItem = images.descriptionItems[index];
        // Always apply imageSrc if provided, even if it's empty (to clear it)
        if (imageItem !== undefined) {
          return { ...item, imageSrc: imageItem.imageSrc || item.imageSrc || '' };
        }
        return item;
      });
    }
    
    return merged;
  }
  
  if (pageKey === 'camps') {
    const merged = { ...baseContent };
    
    // Apply imageSrc to armenianCamp.descriptionItems
    if (images.armenianCamp?.descriptionItems && Array.isArray(images.armenianCamp.descriptionItems) && 
        merged.armenianCamp?.descriptionItems && Array.isArray(merged.armenianCamp.descriptionItems)) {
      merged.armenianCamp.descriptionItems = merged.armenianCamp.descriptionItems.map((item: any, index: number) => {
        const imageItem = images.armenianCamp.descriptionItems[index];
        if (imageItem !== undefined) {
          return { ...item, imageSrc: imageItem.imageSrc || item.imageSrc || '' };
        }
        return item;
      });
    }
    
    // Apply imageSrc to internationalCamp.descriptionItems
    if (images.internationalCamp?.descriptionItems && Array.isArray(images.internationalCamp.descriptionItems) && 
        merged.internationalCamp?.descriptionItems && Array.isArray(merged.internationalCamp.descriptionItems)) {
      merged.internationalCamp.descriptionItems = merged.internationalCamp.descriptionItems.map((item: any, index: number) => {
        const imageItem = images.internationalCamp.descriptionItems[index];
        if (imageItem !== undefined) {
          return { ...item, imageSrc: imageItem.imageSrc || item.imageSrc || '' };
        }
        return item;
      });
    }
    
    // Apply imageSrc to tabs
    if (Array.isArray(images.tabs) && merged.tabs && Array.isArray(merged.tabs)) {
      merged.tabs = merged.tabs.map((item: any, index: number) => {
        const imageItem = images.tabs[index];
        if (imageItem !== undefined) {
          return { ...item, imageSrc: imageItem.imageSrc || item.imageSrc || '' };
        }
        return item;
      });
    }
    
    return merged;
  }
  
  return baseContent;
}

// Helper function to transform marketing content from editing format to storage format
function transformMarketingContentForStorage(content: any): any {
  const transformed = { ...content };
  
  // Transform headOfMarketing: convert linkedin field back to socialLinks array
  if (transformed.headOfMarketing) {
    const head = { ...transformed.headOfMarketing };
    const socialLinks: any[] = [];
    
    // Keep existing social links that are not linkedin
    if (head.socialLinks && Array.isArray(head.socialLinks)) {
      socialLinks.push(...head.socialLinks.filter((link: any) => link.name !== 'linkedin'));
    }
    
    // Add linkedin if provided
    if (head.linkedin && head.linkedin.trim() !== '') {
      socialLinks.push({
        name: 'linkedin',
        href: head.linkedin.trim(),
        ariaLabel: `${head.name || 'Head of Marketing'} LinkedIn`,
      });
    }
    
    // Convert image back to imageSrc
    if (head.image) {
      head.imageSrc = head.image;
      delete head.image;
    }
    
    head.socialLinks = socialLinks;
    delete head.linkedin;
    transformed.headOfMarketing = head;
  }
  
  // Transform members.items: convert linkedin field back to socialLinks array
  if (transformed.members?.items && Array.isArray(transformed.members.items)) {
    transformed.members = {
      ...transformed.members,
      items: transformed.members.items.map((item: any) => {
        const member = { ...item };
        const socialLinks: any[] = [];
        
        // Keep existing social links that are not linkedin
        if (member.socialLinks && Array.isArray(member.socialLinks)) {
          socialLinks.push(...member.socialLinks.filter((link: any) => link.name !== 'linkedin'));
        }
        
        // Add linkedin if provided
        if (member.linkedin && member.linkedin.trim() !== '') {
          socialLinks.push({
            name: 'linkedin',
            href: member.linkedin.trim(),
            ariaLabel: `${member.name || 'Member'} LinkedIn`,
          });
        }
        
        // Convert image back to imageSrc
        if (member.image) {
          member.imageSrc = member.image;
          delete member.image;
        }
        
        member.socialLinks = socialLinks;
        delete member.linkedin;
        return member;
      }),
    };
  }
  
  return transformed;
}

export async function updatePageContent(
  pageKey: PageKey,
  locale: string,
  content: any
): Promise<void> {
  // Transform marketing content before storing
  const contentToStore = pageKey === 'marketing' ? transformMarketingContentForStorage(content) : content;
  
  // Save to MongoDB
  await saveContentToDB(pageKey, locale, contentToStore);
  
  // Extract images from the content being saved
  const images = extractImages(content, pageKey);
  
  // If we have images, sync them to the other locale as well
  const otherLocale = locale === 'en' ? 'hy' : 'en';
  let otherLocaleContent = await getContentFromDB(pageKey, otherLocale);
  
  // If not in DB, try to load from messages
  if (!otherLocaleContent) {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const messagesPath = path.join(process.cwd(), 'messages', `${otherLocale}.json`);
      const messagesContent = await fs.readFile(messagesPath, 'utf-8');
      const messages = JSON.parse(messagesContent);
          
            // Map pageKey to messages key (centerUpJunior -> junior, cursesAndActivities -> coursesAndActivities, camps -> camp)
            let messagesKey = pageKey;
            if (pageKey === 'centerUpJunior') {
              messagesKey = 'junior';
            } else if (pageKey === 'cursesAndActivities') {
              messagesKey = 'coursesAndActivities';
            } else if (pageKey === 'camps') {
              messagesKey = 'camp';
            }
            if (messages[messagesKey]) {
              const pageContent = messages[messagesKey];
              if (pageKey === 'home') {
              otherLocaleContent = {
                upcomingEvents: Array.isArray(pageContent.upcomingEvents?.events) 
                  ? pageContent.upcomingEvents.events 
                  : (Array.isArray(pageContent.upcomingEvents) ? pageContent.upcomingEvents : []),
                programs: Array.isArray(pageContent.programs?.items) 
                  ? pageContent.programs.items 
                  : (Array.isArray(pageContent.programs) ? pageContent.programs : []),
              };
            } else if (pageKey === 'ourTeam') {
              otherLocaleContent = {
                departments: {
                  title: pageContent.departments?.title || 'Departments',
                  items: Array.isArray(pageContent.departments?.items) 
                    ? pageContent.departments.items 
                    : [],
                },
              };
            } else if (pageKey === 'marketing') {
              otherLocaleContent = {
                headOfMarketing: pageContent.headOfMarketing ? {
                  ...pageContent.headOfMarketing,
                  linkedin: pageContent.headOfMarketing.socialLinks?.find((link: any) => link.name === 'linkedin')?.href || '',
                  image: pageContent.headOfMarketing.imageSrc || pageContent.headOfMarketing.image || '',
                } : null,
                members: {
                  title: pageContent.members?.title || 'Members',
                  items: Array.isArray(pageContent.members?.items)
                    ? pageContent.members.items.map((item: any) => ({
                        ...item,
                        linkedin: item.socialLinks?.find((link: any) => link.name === 'linkedin')?.href || '',
                        image: item.imageSrc || item.image || '',
                      }))
                    : [],
                },
              };
            } else if (pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents') {
              // Membership, centerUpJunior, futureUp, cursesAndActivities, conferences, eventOrganization, and upcomingEvents page content structure is already correct from messages
              otherLocaleContent = pageContent;
            } else if (pageKey === 'camps') {
              // Camps page content structure is already correct from messages
              otherLocaleContent = pageContent;
            } else {
              otherLocaleContent = pageContent;
            }
          }
    } catch {
      // If we can't load other locale, create structure from current content but with empty text
      if (pageKey === 'home') {
        otherLocaleContent = {
          upcomingEvents: content.upcomingEvents?.map((item: any) => ({ 
            title: '', 
            description: '', 
            image: item.image || '' 
          })) || [],
          programs: content.programs?.map((item: any) => ({ 
            title: '', 
            description: '', 
            image: item.image || '' 
          })) || []
        };
      } else if (pageKey === 'ourTeam') {
        otherLocaleContent = {
          departments: {
            title: content.departments?.title || 'Departments',
            items: content.departments?.items?.map((item: any) => ({ 
              name: '', 
              biography: '', 
              image: item.image || '' 
            })) || []
          }
        };
      } else if (pageKey === 'marketing') {
        otherLocaleContent = {
          headOfMarketing: content.headOfMarketing ? {
            name: '',
            description: '',
            linkedin: '',
            image: content.headOfMarketing.image || '',
          } : null,
          members: {
            title: content.members?.title || 'Members',
            items: content.members?.items?.map((item: any) => ({ 
              name: '', 
              description: '', 
              linkedin: '',
              image: item.image || '' 
            })) || []
          }
        };
      } else if (pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents') {
        otherLocaleContent = {
          heroSection: content.heroSection || {},
          description: content.description || {},
          descriptionItems: content.descriptionItems?.map((item: any) => ({ 
            heading: '', 
            text: '', 
            imageSrc: item.imageSrc || '',
            imagePosition: item.imagePosition || 'start',
            contentFontSize: item.contentFontSize || ''
          })) || [],
          registrationButton: content.registrationButton || {},
          testimonialsSection: content.testimonialsSection || {}
        };
      } else if (pageKey === 'camps') {
        otherLocaleContent = {
          heroSection: content.heroSection || {},
          description: content.description || {},
          tabs: content.tabs?.map((item: any) => ({
            id: item.id || '',
            label: '',
            imageSrc: item.imageSrc || '',
            imageAlt: ''
          })) || [],
          armenianCamp: {
            title: '',
            description: '',
            buttonText: '',
            descriptionItems: content.armenianCamp?.descriptionItems?.map((item: any) => ({
              heading: '',
              text: '',
              imageSrc: item.imageSrc || '',
              imagePosition: item.imagePosition || 'start',
              contentFontSize: item.contentFontSize || ''
            })) || []
          },
          internationalCamp: {
            title: '',
            description: '',
            buttonText: '',
            descriptionItems: content.internationalCamp?.descriptionItems?.map((item: any) => ({
              heading: '',
              text: '',
              imageSrc: item.imageSrc || '',
              imagePosition: item.imagePosition || 'start',
              contentFontSize: item.contentFontSize || ''
            })) || []
          }
        };
      }
    }
  }
  
  // Apply images to other locale content
  if (otherLocaleContent) {
    const updatedOtherLocaleContent = applyImages(otherLocaleContent, images, pageKey);
    
    // Save other locale content to MongoDB
    await saveContentToDB(pageKey, otherLocale, updatedOtherLocaleContent);
  }
}

// Initialize MongoDB connection (optional - connection is lazy-loaded)
export async function initializeContentStore(): Promise<void> {
  try {
    await connectDB();
    console.log('MongoDB connected for content storage');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

