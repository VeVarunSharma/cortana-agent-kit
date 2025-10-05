import cron from "node-cron";
import { Agent } from "./agent.interface";

export const scheduleAgents = (agents: Agent[]) => {
  agents.forEach((agent) => {
    if (cron.validate(agent.schedule)) {
      cron.schedule(agent.schedule, async () => {
        console.log(`Running agent: ${agent.name}`);
        try {
          await agent.run();
          console.log(`Agent ${agent.name} finished running.`);
        } catch (error) {
          console.error(`Error running agent ${agent.name}:`, error);
        }
      });
      console.log(
        `Scheduled agent: ${agent.name} with schedule: "${agent.schedule}"`
      );
    } else {
      console.error(
        `Invalid cron schedule for agent ${agent.name}: "${agent.schedule}"`
      );
    }
  });
};
