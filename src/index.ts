import express from "express";
import { Agent } from "./core/agent.interface";
import { loadAgents } from "./core/agentRegistry";
import { scheduleAgents } from "./core/scheduler";
import "./config"; // Ensures config is loaded

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory store for loaded agents
let loadedAgents: Agent[] = [];

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Manual trigger endpoint for an agent
app.post("/api/agents/:agentId/run", async (req, res) => {
  const { agentId } = req.params;
  const agentToRun = loadedAgents.find((agent) => agent.id === agentId);

  if (!agentToRun) {
    return res
      .status(404)
      .json({ message: `Agent with ID '${agentId}' not found.` });
  }

  try {
    console.log(
      `Manually triggering agent: ${agentToRun.name} (ID: ${agentToRun.id})`
    );
    // We don't await this, so the HTTP request returns immediately.
    // The agent runs in the background.
    agentToRun.run();
    res
      .status(202)
      .json({ message: `Agent '${agentToRun.name}' triggered successfully.` });
  } catch (error) {
    console.error(`Error manually triggering agent ${agentToRun.name}:`, error);
    res.status(500).json({ message: "Failed to trigger agent." });
  }
});

const startServer = async () => {
  try {
    console.log("Loading agents...");
    loadedAgents = await loadAgents();
    console.log(`Loaded ${loadedAgents.length} agents.`);

    console.log("Scheduling agents...");
    scheduleAgents(loadedAgents);
    console.log("Agents scheduled.");

    app.listen(port, () => {
      console.log(`Cortana Agent Service running at http://localhost:${port}`);
      console.log(
        `Manually trigger an agent, e.g., curl -X POST http://localhost:3000/api/agents/trading-analyst/run`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
