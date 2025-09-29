import { BaseAgent } from '../../core/baseAgent';
import { emailService } from '../../services/emailService';
import { fetchMarketNews } from './sources';
import { MarketNews } from './types';
import OpenAI from 'openai';

class TradingAnalystAgent extends BaseAgent {
  id = 'trading-analyst';
  name = 'Trading Analyst';
  schedule = '0 8 * * 1-5'; // 8 AM on weekdays

  async run(): Promise<void> {
    console.log('Running Trading Analyst Agent...');

    try {
      // 1. Fetch market news
      console.log('Fetching market news...');
      const newsItems: MarketNews[] = await fetchMarketNews();
      const headlines = newsItems.map((item) => `- ${item.headline} (Source: ${item.source})`).join('\n');

      // 2. Generate AI analysis
      const analysis = await this.generateAnalysis(headlines);

      // 3. Send email with the analysis
      const subject = `Daily Market Analysis - ${new Date().toLocaleDateString()}`;
      const htmlContent = this.formatEmail(analysis, newsItems);

      await emailService.sendEmail(subject, htmlContent);
      console.log('Trading Analyst Agent run completed.');
    } catch (error) {
      console.error('Error running Trading Analyst Agent:', error);
      // Re-throw the error to be caught by the central scheduler/trigger
      throw error;
    }
  }

  private async generateAnalysis(content: string): Promise<string> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Analyze the following market news headlines. Identify "high-signal edge" and key catalysts. Do not just summarize. Provide a concise, actionable analysis for a trader. Focus on critical minerals, defense, and tech stocks.`,
      },
      {
        role: 'user',
        content: `News Headlines:\n${content}`,
      },
    ];

    return this.getCompletion(messages, { temperature: 1 });
  }

  private formatEmail(analysis: string, newsItems: MarketNews[]): string {
    return `
      <h1>Daily Trading Analysis</h1>
      <h2>Key Market Insights</h2>
      <p>${analysis.replace(/\n/g, '<br>')}</p>
      <hr>
      <h3>Sources</h3>
      <ul>
        ${newsItems.map((item) => `<li><a href="${item.url}">${item.headline}</a> - <i>${item.source}</i></li>`).join('')}
      </ul>
    `;
  }
}

export const agent = new TradingAnalystAgent();
