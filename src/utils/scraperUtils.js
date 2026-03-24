/**
 * Scraper utility to collect data from influencer.in API
 */

export const scrapeInfluencerData = async (options = {}) => {
  const {
    totalPages = 5,
    delayBetweenRequests = 1000, // 1 second delay between requests
    filters = {},
    onProgress = null
  } = options;

  let allData = [];
  let allInfluencers = [];

  try {
    for (let page = 1; page <= totalPages; page++) {
      if (onProgress) {
        onProgress(`Scraping page ${page}/${totalPages}...`);
      }

      // Build payload
      const payload = {
        'campaign-level-requirements': {
          'price-per-creator': filters.pricePerCreator || 10000000000
        },
        'creator-level-requirements': {
          platform: filters.platform || 'instagram'
        },
        'advance-filters': {
          sortOrder: filters.sortOrder || 'desc',
          sortBy: filters.sortBy || 'followers'
        },
        setReset: false,
        searchedSelectedInfluencerIds: []
      };

      // Add optional filters
      if (filters.location) {
        payload['creator-level-requirements'].city = filters.location.toLowerCase();
      }
      if (filters.language) {
        payload['creator-level-requirements'].language = filters.language;
      }
      if (filters.creatorType) {
        payload['creator-level-requirements'].creator_type = filters.creatorType;
      }

      try {
        const response = await fetch(
          `https://api.influencer.in/api/v1/es/planner/list?page=${page}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        );

        if (!response.ok) {
          console.warn(`Page ${page} failed with status ${response.status}`);
          continue;
        }

        const data = await response.json();

        if (data.results && Array.isArray(data.results)) {
          allInfluencers = allInfluencers.concat(data.results);
          allData.push({
            page,
            count: data.count,
            results: data.results,
            timestamp: new Date().toISOString()
          });

          console.log(`✓ Page ${page}: ${data.results.length} influencers`);
        }

        // Delay before next request to avoid rate limiting
        if (page < totalPages) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
        }
      } catch (pageError) {
        console.error(`Error on page ${page}:`, pageError);
      }
    }

    if (onProgress) {
      onProgress(`Completed! Total influencers: ${allInfluencers.length}`);
    }

    return {
      success: true,
      totalInfluencers: allInfluencers.length,
      allInfluencers,
      pageData: allData,
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      success: false,
      error: error.message,
      totalInfluencers: allInfluencers.length,
      allInfluencers,
      pageData: allData
    };
  }
};

/**
 * Export data to CSV
 */
export const exportToCSV = (influencers, filename = 'influencers.csv') => {
  if (!influencers || influencers.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Username',
    'Platform',
    'Followers',
    'Engagement Rate',
    'Avg Views',
    'Location',
    'Creator Type',
    'Category',
    'Language',
    'URL',
    'Picture',
    'PPC',
    'Speed Score'
  ];

  // Convert influencers to CSV rows
  const rows = influencers.map(influencer => [
    influencer.id || '',
    influencer.name || '',
    influencer.url?.split('/').pop() || '',
    influencer.platform || '',
    influencer.followers || '',
    influencer.engagement_rate || '',
    influencer.avg_views || '',
    influencer.location || influencer.city || '',
    influencer.creator_type || '',
    influencer.primary_category?.name || '',
    influencer.language || '',
    influencer.url || '',
    influencer.picture || '',
    influencer.ppc || '',
    influencer.speed_score || ''
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(`✓ Exported to ${filename}`);
};

/**
 * Export data to JSON
 */
export const exportToJSON = (data, filename = 'influencers.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(`✓ Exported to ${filename}`);
};

/**
 * Save data to localStorage (limited to ~5-10MB)
 */
export const saveToLocalStorage = (data, key = 'scraped_influencers') => {
  try {
    const json = JSON.stringify(data);
    if (json.length > 5242880) { // 5MB limit
      console.warn('Data too large for localStorage');
      return false;
    }
    localStorage.setItem(key, json);
    console.log(`✓ Saved to localStorage with key: ${key}`);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Load data from localStorage
 */
export const loadFromLocalStorage = (key = 'scraped_influencers') => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};
