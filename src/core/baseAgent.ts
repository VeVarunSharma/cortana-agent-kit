import { Agent, AgentOptions, Topic } from './agent.interface';
import { azureAIService } from '../services/azureAIService';
import { models } from '../config/models.config';
import OpenAI from 'openai';

export abstract class BaseAgent<T = any> implements Agent<T> {
  id: string;
  name: string;
  schedule: string;
  modelId: keyof typeof models;
  protected topics: Topic[] = [];

  protected openai: OpenAI | undefined;

  constructor(options: AgentOptions) {
    this.id = options.id;
    this.name = options.name;
    this.schedule = options.schedule;
    this.modelId = options.modelId;
  }

  protected initializeTopics(topics: Topic[]): void {
    this.topics = topics;
  }

  abstract run(): Promise<void>;
  abstract process(data: T): Promise<void>;

  protected async getCompletion(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    // Lazily initialize the client on first use
    if (!this.openai) {
      this.openai = azureAIService.getClient(this.modelId);
    }

    const { temperature = 1, maxTokens = 10000 } = options;
    const modelConfig = models[this.modelId];

    if (!modelConfig) {
      throw new Error(`Model configuration for '${this.modelId}' not found.`);
    }

    const deploymentName = modelConfig.deploymentName;

    if (!deploymentName) {
      throw new Error(`Azure OpenAI API deployment name for model '${this.modelId}' is not configured.`);
    }

    const response = await this.openai.chat.completions.create({
      model: deploymentName,
      messages: messages,
      max_completion_tokens: maxTokens,
      temperature: temperature,
    });

    console.log('--- Raw OpenAI Response ---');
    console.log(JSON.stringify(response, null, 2));
    console.log('--------------------------');

    return response.choices[0].message?.content?.trim() ?? '';
  }
}
