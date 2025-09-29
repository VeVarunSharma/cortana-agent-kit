import { Agent } from './agent.interface';
import { azureAIService } from '../services/azureAIService';
import { config } from '../config';
import OpenAI from 'openai';

export abstract class BaseAgent implements Agent {
  abstract id: string;
  abstract name: string;
  abstract schedule: string;

  protected openai: OpenAI;

  constructor() {
    this.openai = azureAIService.client;
  }

  abstract run(): Promise<void>;

  protected async getCompletion(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const { temperature = 1, maxTokens = 500 } = options;
    const deploymentName = config.azureOpenAIApiDeploymentName;

    if (!deploymentName) {
      throw new Error('Azure OpenAI API deployment name is not configured.');
    }

    const response = await this.openai.chat.completions.create({
      model: deploymentName,
      messages: messages,
      max_completion_tokens: maxTokens,
      temperature: temperature,
    });

    return response.choices[0].message?.content?.trim() ?? '';
  }
}
