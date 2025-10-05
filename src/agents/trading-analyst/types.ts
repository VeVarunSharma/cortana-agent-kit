export interface MarketNews {
  title: string;
  summary: string;
  url: string;
  source: string;
  time_published: string;
  topics: { topic: string; relevance_score: string }[];
  ticker_sentiment: {
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }[];
}
