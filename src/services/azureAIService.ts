import { config } from '../config';
import { AzureOpenAI } from 'openai';

class AzureAIService {
  private openAIClient: AzureOpenAI;

  constructor() {
    if (!config.azureOpenAIEndpoint) {
      throw new Error('Azure OpenAI endpoint is not configured.');
    }
    if (!config.azureOpenAIApiKey) {
      throw new Error('Azure OpenAI API key is not configured.');
    }

    const azureOpenAiOptions = {
      endpoint: config.azureOpenAIEndpoint,
      apiVersion: config.azureOpenAIApiVersion,
      apiKey: config.azureOpenAIApiKey,
      modelName: config.azureOpenAIApiModelName,
      deployment: config.azureOpenAIApiDeploymentName,
    };

    this.openAIClient = new AzureOpenAI(azureOpenAiOptions);
  }

  async generateAnalysis(content: string): Promise<string> {
    const deploymentName = config.azureOpenAIApiDeploymentName;
    if (!deploymentName) {
      throw new Error('Azure OpenAI API deployment name is not configured.');
    }

    const messages: any[] = [
      {
        role: 'system',
        content: `Analyze the following market news headlines. Identify "high-signal edge" and key catalysts. Do not just summarize. Provide a concise, actionable analysis for a trader. Focus on critical minerals, defense, and tech stocks.`,
      },
      {
        role: 'user',
        content: `News Headlines:
${content}`,
      },
    ];

    const response = await this.openAIClient.chat.completions.create({
      model: deploymentName,
      messages: messages,
      max_completion_tokens: 500,
      temperature: 1,
    });

    return response.choices[0].message?.content?.trim() ?? '';
  }
}

export const azureAIService = new AzureAIService();
