export interface Topic {
  name: string;
  description: string;
  schema: object;
}

export interface AgentOptions {
  id: string;
  name: string;
  schedule: string;
  modelId: keyof typeof import('../config/models.config').models;
}

export interface Agent<T = any> {
  id: string; // A unique, URL-friendly identifier for the agent
  name: string;
  schedule: string; // A cron string like '0 9 * * *' for 9 AM daily
  run: () => Promise<void>;
  process(data: T): Promise<void>;
}
