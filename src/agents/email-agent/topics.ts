import { Topic } from '../../core/agent.interface';

export const emailTopics: Topic[] = [
  {
    name: 'email.inbound',
    description: 'An inbound email was received',
    schema: {
      type: 'object',
      properties: {
        from: { type: 'string' },
        to: { type: 'array', items: { type: 'string' } },
        cc: { type: 'array', items: { type: 'string' } },
        subject: { type: 'string' },
        body: { type: 'string' },
        timestamp: { type: 'number' },
      },
      required: ['from', 'to', 'subject', 'body', 'timestamp'],
    },
  },
];
