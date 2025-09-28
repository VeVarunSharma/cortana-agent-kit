import { AIProjectClient } from "@azure/ai-projects";
import "@azure/ai-projects/patch/inference"; // This patches the client with the .inference property
import {
  DefaultAzureCredential,
  ClientSecretCredential,
} from "@azure/identity";
import { config } from "../config";
import OpenAI from "openai";

class AzureAIService {
  private projectClient: AIProjectClient;
  private openAIClient: OpenAI | undefined;

  constructor() {
    if (!config.azureAIProjectEndpoint) {
      throw new Error("Azure AI Project endpoint is not configured.");
    }

    let credential;
    if (
      config.azureTenantId &&
      config.azureClientId &&
      config.azureClientSecret
    ) {
      console.log("Using ClientSecretCredential for authentication.");
      credential = new ClientSecretCredential(
        config.azureTenantId,
        config.azureClientId,
        config.azureClientSecret
      );
    } else {
      console.log("Using DefaultAzureCredential for authentication.");
      credential = new DefaultAzureCredential();
    }

    this.projectClient = new AIProjectClient(
      config.azureAIProjectEndpoint,
      credential
    );
  }

  private async getOpenAIClient(): Promise<OpenAI> {
    if (!this.openAIClient) {
      // @ts-ignore
      this.openAIClient = await this.projectClient.inference.azureOpenAI({
        apiVersion: config.azureOpenAIApiVersion,
      });
    }
    if (!this.openAIClient) {
      throw new Error("Failed to get OpenAI client");
    }
    return this.openAIClient;
  }

  async generateAnalysis(content: string): Promise<string> {
    const deploymentName = config.azureOpenAIApiDeploymentName;
    if (!deploymentName) {
      throw new Error("Azure OpenAI API deployment name is not configured.");
    }

    const client = await this.getOpenAIClient();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `Analyze the following market news headlines. Identify "high-signal edge" and key catalysts. Do not just summarize. Provide a concise, actionable analysis for a trader. Focus on critical minerals, defense, and tech stocks.`,
      },
      {
        role: "user",
        content: `News Headlines:
${content}`,
      },
    ];

    const response = await client.chat.completions.create({
      model: deploymentName,
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message?.content?.trim() ?? "";
  }
}

export const azureAIService = new AzureAIService();
