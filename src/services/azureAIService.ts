import { models } from '../config/models.config';
import { AzureOpenAI } from 'openai';

type ModelId = keyof typeof models;

class AzureAIService {
  private clients: Map<ModelId, AzureOpenAI> = new Map();

  public getClient(modelId: ModelId): AzureOpenAI {
    // Check if a client for this model already exists
    if (this.clients.has(modelId)) {
      return this.clients.get(modelId)!;
    }

    // If not, create a new client and store it
    const modelConfig = models[modelId];

    if (!modelConfig.endpoint) {
      throw new Error(`Azure OpenAI endpoint for model '${modelId}' is not configured.`);
    }
    if (!modelConfig.apiKey) {
      throw new Error(`Azure OpenAI API key for model '${modelId}' is not configured.`);
    }

    const newClient = new AzureOpenAI({
      endpoint: modelConfig.endpoint,
      apiVersion: modelConfig.apiVersion,
      apiKey: modelConfig.apiKey,
    });

    this.clients.set(modelId, newClient);
    return newClient;
  }
}

export const azureAIService = new AzureAIService();
