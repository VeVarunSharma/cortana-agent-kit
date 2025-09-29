import { config } from '../config';
import { AzureOpenAI } from 'openai';

class AzureAIService {
  public readonly client: AzureOpenAI;

  constructor() {
    if (!config.azureOpenAIEndpoint) {
      throw new Error('Azure OpenAI endpoint is not configured.');
    }
    if (!config.azureOpenAIApiKey) {
      throw new Error('Azure OpenAI API key is not configured.');
    }

    this.client = new AzureOpenAI({
      endpoint: config.azureOpenAIEndpoint,
      apiVersion: config.azureOpenAIApiVersion,
      apiKey: config.azureOpenAIApiKey,
    });
  }
}

export const azureAIService = new AzureAIService();
