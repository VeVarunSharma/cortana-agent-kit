import { BaseAgent } from '../../core/baseAgent';
import { AgentOptions } from '../../core/agent.interface';
import { emailTopics } from './topics';
import { Email } from './types';

export class EmailAgent extends BaseAgent<Email> {
  constructor(options: AgentOptions) {
    super(options);
    this.initializeTopics(emailTopics);
  }

  async run(): Promise<void> {
    // This method is called by the scheduler.
    // You can add logic here to periodically check for new emails.
    console.log('Email agent is running...');
  }

  async process(email: Email): Promise<void> {
    // Process the incoming email
    console.log('Processing email:', email);
    // Here you would add your logic to handle the email
    // For example, you could use an AI service to understand the email's intent
    // and then take action, like scheduling an appointment or replying to the email.
  }
}
