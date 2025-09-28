import { Agent } from "../../core/agent.interface";
import { azureAIService } from "../../services/azureAIService";
import { emailService } from "../../services/emailService";
import { fetchMarketNews } from "./sources";
import { MarketNews } from "./types";

const tradingAnalystAgent: Agent = {
  id: "trading-analyst",
  name: "Trading Analyst",
  schedule: "0 8 * * 1-5", // 8 AM on weekdays
  run: async () => {
    console.log("Running Trading Analyst Agent...");

    // 1. Fetch market news
    const newsItems: MarketNews[] = await fetchMarketNews();
    const headlines = newsItems
      .map((item) => `- ${item.headline} (Source: ${item.source})`)
      .join("");

    // 2. Generate AI analysis
    const analysis = await azureAIService.generateAnalysis(headlines);

    // 3. Send email with the analysis
    const subject = `Daily Market Analysis - ${new Date().toLocaleDateString()}`;
    const htmlContent = `
      <h1>Daily Trading Analysis</h1>
      <h2>Key Market Insights</h2>
      <p>${analysis.replace(/ /g, "<br>")}</p>
      <hr>
      <h3>Sources</h3>
      <ul>
        ${newsItems
          .map(
            (item) =>
              `<li><a href="${item.url}">${item.headline}</a> - <i>${item.source}</i></li>`
          )
          .join("")}
      </ul>
    `;

    await emailService.sendEmail(subject, htmlContent);
    console.log("Trading Analyst Agent run completed.");
  },
};

export const agent = tradingAnalystAgent;
