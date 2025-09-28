import { MarketNews } from "./types";

// TODO: Integrate a real news API (e.g., NewsAPI, Alpha Vantage, Alpaca).
export const fetchMarketNews = async (): Promise<MarketNews[]> => {
  console.log("Fetching market news...");
  // Mock data for now
  const mockNews: MarketNews[] = [
    {
      headline:
        "Global demand for lithium expected to triple by 2030, major report finds.",
      source: "Reuters",
      url: "#",
    },
    {
      headline:
        "US government announces $5 billion investment in domestic cobalt refining.",
      source: "Bloomberg",
      url: "#",
    },
    {
      headline:
        "New tensions in South China Sea drive up defense stocks in the region.",
      source: "Associated Press",
      url: "#",
    },
    {
      headline:
        "Major aerospace firm lands $10B contract for next-gen fighter jets.",
      source: "Defense News",
      url: "#",
    },
    {
      headline:
        "Semiconductor industry faces new supply chain disruptions from factory fire.",
      source: "Wall Street Journal",
      url: "#",
    },
    {
      headline:
        "AI chipmaker unveils new GPU architecture, promising 10x performance increase.",
      source: "The Verge",
      url: "#",
    },
  ];

  return Promise.resolve(mockNews);
};
