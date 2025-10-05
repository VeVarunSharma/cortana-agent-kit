import axios from 'axios';
import { MarketNews } from './types';
import { CATEGORIES } from './topics';

const API_URL = 'https://www.alphavantage.co/query';

export const fetchMarketNews = async (apiKey: string): Promise<MarketNews[]> => {
  if (!apiKey) {
    throw new Error('Alpha Vantage API key is required.');
  }

  console.log('Fetching market news from Alpha Vantage...');

  // The Alpha Vantage API only supports specific topic strings.
  // We will fetch a broad set of relevant topics and then use our internal
  // CATEGORIES to group them for the user.
  const topics = 'technology,blockchain';

  try {
    const response = await axios.get(API_URL, {
      params: {
        function: 'NEWS_SENTIMENT',
        // This can be customized or made dynamic based on agent's focus.
        topics: topics,
        limit: 25, // Fetch 50 recent articles to ensure good coverage
        apikey: apiKey,
      },
      headers: {
        'User-Agent': 'request', // Alpha Vantage requires a User-Agent header
      },
    });

    if (response.data.feed && Array.isArray(response.data.feed)) {
      // The API returns a 'feed' array. We'll map it to our MarketNews type.
      // Note: The API structure might have changed. Always log and verify the raw response.
      return response.data.feed as MarketNews[];
    } else {
      // Handle cases where the API response is not as expected
      console.warn('Alpha Vantage API did not return a valid feed:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching market news from Alpha Vantage:', error);
    // Depending on the desired error handling, you might want to return an empty array
    // or re-throw the error to be handled by the calling agent.
    throw error;
  }
};
