// Defines the primary categories for grouping news articles and their associated keywords.
export const CATEGORIES = {
  Technology: ['technology', 'ai', 'semiconductor', 'software', 'hardware', 'nvidia', 'openai', 'coreweave', 'meta', 'shopify'],
  Blockchain: ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'stablecoin', 'coinbase', 'gemini', 'circle', 'tron', 'usdc'],
  IPO: ['ipo', 'public listing', 'nasdaq', 'nyse', 'goes public'],
  Defence: ['defense', 'aerospace', 'anduril', 'palantir'],
};

// This creates a 'Topic' type that can only be one of the strings in the TOPICS array.
export type Topic = keyof typeof CATEGORIES;
