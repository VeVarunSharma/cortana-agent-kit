import express from "express";
import { loadAgents } from "./core/agentRegistry";
import { scheduleAgents } from "./core/scheduler";
import "./config"; // Ensures config is loaded

const app = express();
const port = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const startServer = async () => {
  try {
    console.log("Loading agents...");
    const agents = await loadAgents();
    console.log(`Loaded ${agents.length} agents.`);

    console.log("Scheduling agents...");
    scheduleAgents(agents);
    console.log("Agents scheduled.");

    app.listen(port, () => {
      console.log(`Cortana Agent Service running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
