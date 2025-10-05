import fs from 'fs';
import path from 'path';
import { Agent } from './agent.interface';

export const loadAgents = async (): Promise<Agent[]> => {
  const agents: Agent[] = [];
  const agentsDir = path.join(__dirname, '../agents');

  const agentDirectories = fs
    .readdirSync(agentsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const dir of agentDirectories) {
    const agentPath = path.join(agentsDir, dir, 'agent.ts');
    if (fs.existsSync(agentPath)) {
      try {
        const agentModule = await import(path.resolve(agentPath));
        if (agentModule.agent) {
          agents.push(agentModule.agent);
          console.log(`Successfully loaded agent: ${agentModule.agent.name}`);
        }
      } catch (error) {
        console.error(`Error loading agent from ${dir}:`, error);
      }
    }
  }

  return agents;
};
