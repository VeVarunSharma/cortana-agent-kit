export interface Agent {
  name: string;
  schedule: string; // A cron string like '0 9 * * *' for 9 AM daily
  run: () => Promise<void>;
}
