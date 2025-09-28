export interface Agent {
  id: string; // A unique, URL-friendly identifier for the agent
  name: string;
  schedule: string; // A cron string like '0 9 * * *' for 9 AM daily
  run: () => Promise<void>;
}
