import { Agent } from './agent.interface';
import { agent as tradingAnalystAgent } from '../agents/trading-analyst';
// Import other agents here as they are created
// import { agent as someOtherAgent } from '../agents/some-other-agent';

// Define which agents are active in the application.
// To disable an agent, simply comment it out from this array.
const activeAgents: Agent[] = [
  tradingAnalystAgent,
  // someOtherAgent,
];

export const loadAgents = async (): Promise<Agent[]> => {
  console.log('Loading agents...');
  for (const agent of activeAgents) {
    console.log(`Successfully loaded agent: ${agent.name}`);
  }
  return activeAgents;
};
