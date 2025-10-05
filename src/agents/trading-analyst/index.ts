import { BaseAgent } from '../../core/baseAgent';
import { emailService } from '../../services/emailService';
import { fetchMarketNews } from './sources';
import { MarketNews } from './types';
import OpenAI from 'openai';
import { config } from '../../config';
import { CATEGORIES, Topic } from './topics';

class TradingAnalystAgent extends BaseAgent {
  id = 'trading-analyst';
  name = 'Trading Analyst';
  schedule = '0 8 * * 1-5'; // 8 AM on weekdays
  modelId = 'o4-mini' as const;

  async run(): Promise<void> {
    console.log('Running Trading Analyst Agent...');

    if (!config.alphaVantageApiKey) {
      throw new Error('Alpha Vantage API key is not configured. Please set ALPHA_VANTAGE_API_KEY in your environment.');
    }

    try {
      // 1. Fetch market news
      console.log('Step 1: Fetching market news...');
      const newsItems: MarketNews[] = await fetchMarketNews(config.alphaVantageApiKey);
      console.log(`Step 1 Complete: Fetched ${newsItems.length} news items.`);
      const headlines = newsItems.map((item) => `- ${item.title}: ${item.summary} (Source: ${item.source})`).join('\n');

      // 2. Generate AI analysis
      console.log('Step 2: Generating AI analysis...');
      const analysis = await this.generateAnalysis(headlines);
      console.log('Step 2 Complete: AI analysis generated.');

      // 3. Send email with the analysis
      console.log('Step 3: Formatting and sending email...');
      const subject = `Cortana: Daily Market Analysis - ${new Date().toLocaleDateString()}`;
      const htmlContent = this.formatEmail(analysis, newsItems);

      await emailService.sendEmail(subject, htmlContent);
      console.log('Step 3 Complete: Email sent.');
      console.log('Trading Analyst Agent run completed.');
    } catch (error) {
      console.error('Error running Trading Analyst Agent:', error);
      // Re-throw the error to be caught by the central scheduler/trigger
      throw error;
    }
  }

  private async generateAnalysis(content: string): Promise<string> {
    console.log('--- Inside generateAnalysis ---');
    console.log('Received content length:', content.length);

    if (!content || content.trim().length === 0) {
      console.warn('Warning: No content provided to generateAnalysis. Returning empty analysis.');
      return '';
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a world-class trading analyst providing a daily briefing. Your audience is professional traders who need concise, actionable intelligence, not just summaries.

Analyze the provided news headlines and summaries to extract high-signal insights and key market catalysts.

**Format your response in two distinct sections, using markdown:**

**### Overall Market Summary**
Provide a brief, high-level overview of the market sentiment and major trends reflected in the news. Mention the general mood (e.g., bullish, bearish, mixed) and any overarching themes.

**### Actionable Insights & Catalysts**
Present a bulleted list of specific, actionable trading ideas. For each bullet point:
- Clearly state the insight or idea.
- Identify the specific catalyst (e.g., a new product, policy change, M&A activity).
- Briefly explain the potential market impact or opportunity.

**Focus Areas:** Your analysis must prioritize the following sectors:
- **Technology** (especially AI, Semiconductors)
- **Blockchain & Crypto**
- **IPOs**
- **Defence**

Be direct, professional, and avoid filler.`,
      },
      {
        role: 'user',
        content: `News Headlines & Summaries:\n${content}`,
      },
    ];

    console.log('Calling AI model for completion...');
    const data = await this.getCompletion(messages, { temperature: 1 });
    console.log(data);
    return data;
  }

  private formatEmail(analysis: string, newsItems: MarketNews[]): string {
    // Group news items by category based on keywords
    const groupedByTopic = newsItems.reduce(
      (acc, item) => {
        const itemText = `${item.title} ${item.summary}`.toLowerCase();
        let category: Topic | 'General' = 'General';

        for (const [cat, keywords] of Object.entries(CATEGORIES)) {
          if (keywords.some((keyword) => itemText.includes(keyword))) {
            category = cat as Topic;
            break;
          }
        }

        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      },
      {} as Record<Topic | 'General', MarketNews[]>
    );

    // Generate HTML for the sources, with specified categories first
    const orderedCategories: (Topic | 'General')[] = [...(Object.keys(CATEGORIES) as Topic[]), 'General'];
    const sourcesHtml = orderedCategories
      .filter((topic) => groupedByTopic[topic]) // Only show topics with news
      .map((topic) => {
        const itemsHtml = groupedByTopic[topic].map((item) => `<li><a href="${item.url}">${item.title}</a> - <i>${item.source}</i></li>`).join('');
        return `<h4>${topic}</h4><ul>${itemsHtml}</ul>`;
      })
      .join('');

    console.log('Raw AI Analysis:\n', analysis);

    // Parse the AI analysis and format it into HTML
    const analysisHtml = analysis
      .replace(/(\*\*|###) (.*?)\n/g, '<h3>$2</h3>') // Replace markdown headers (both ** and ###)
      .replace(/(\*|-) (.*?)\n/g, '<li>$2</li>') // Replace markdown list items (* or -)
      .replace(/<\/li>\s*<li>/g, '</li><li>') // Clean up whitespace between list items
      .replace(/<\/h3>\s*<li>/g, '</h3><ul><li>') // Wrap list items in a <ul> after a header
      .replace(/<\/li>(?![\s\S]*<li>)/g, '</li></ul>'); // Close the final <ul>

    return `
      <h1>Daily Trading Analysis</h1>
      ${analysisHtml}
      <hr>
      <h2>Sources</h2>
      ${sourcesHtml}
    `;
  }
}

export const agent = new TradingAnalystAgent();
