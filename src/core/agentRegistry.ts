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
    const agentPath = path.join(agentsDir, dir, 'index.ts');
    if (fs.existsSync(agentPath)) {
      try {
        const { agent } = await import(agentPath);
        if (agent) {
          agents.push(agent);
          console.log(`Successfully loaded agent: ${agent.name}`);
        }
      } catch (error) {
        console.error(`Error loading agent from ${dir}:`, error);
      }
    }
  }

  return agents;
};
