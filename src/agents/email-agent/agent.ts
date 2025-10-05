import { EmailAgent } from './index';

export const agent = new EmailAgent({
  id: 'email-agent',
  name: 'Email Agent',
  schedule: '*/5 * * * *', // Runs every 5 minutes
  modelId: 'o4-mini',
});
