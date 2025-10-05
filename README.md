# Cortana Agent Service

A modular, multi-agent AI service designed to run independent, scheduled AI tasks. This project provides a reusable framework for easily creating and integrating new, "pluggable" AI agents that can perform a variety of automated functions.

## Core Concepts

The service is built on a simple but powerful modular architecture.

### The Agent Framework

- **`Agent` Interface (`src/core/agent.interface.ts`):** At the heart of the framework is the `Agent` interface. Any module that implements this interface can be dynamically loaded into the service. It defines the essential properties of an agent: its `name`, its `schedule` (as a cron string), and its core logic in the `run` method.
- **Agent Registry (`src/core/agentRegistry.ts`):** On startup, the service uses the `loadAgents` function to automatically scan the `src/agents/` directory. It dynamically imports any valid agent module it finds, making them available to the scheduler.
- **Scheduler (`src/core/scheduler.ts`):** The scheduler takes the list of registered agents and uses `node-cron` to set up their execution based on their individual `schedule` properties. This ensures each agent runs independently at its designated time.

### How It Works

1.  **Initialization:** When the service starts (`pnpm dev` or `pnpm start`), the main `index.ts` file is executed.
2.  **Agent Loading:** The `agentRegistry` is called to find and load all agent modules from the `src/agents/` directory.
3.  **Scheduling:** The loaded agents are passed to the `scheduler`, which sets up a cron job for each one.
4.  **Execution:** The Express server starts, and the cron jobs wait to trigger. When an agent's scheduled time arrives, its `run()` method is executed. All logs are printed to the console.

---

## Getting Started

Follow these steps to get the Cortana Agent Service running on your local machine.

### Prerequisites

- **Node.js:** v18 or higher.
- **pnpm:** This project uses `pnpm` for package management. Install it via `npm install -g pnpm`.
- **Docker:** Required for building and running the containerized version of the service.
- **Azure Subscription:** You need an active Azure subscription and an **Azure AI Project** set up to use the AI capabilities.

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd cortana-agent-kit
    ```
2.  Install the dependencies:
    ```bash
    pnpm install
    ```

### Configuration

The service is configured using environment variables.

1.  Create a `.env` file by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Open the `.env` file and fill in the required values:
    - `AZURE_AI_PROJECT_ENDPOINT_STRING`: The endpoint string for your Azure AI Project.
    - `AZURE_OPENAI_API_DEPLOYMENT_NAME`: The name of your chat model deployment (e.g., gpt-4o).
    - `AZURE_OPENAI_API_VERSION`: The API version for the Azure OpenAI data plane (e.g., `2024-05-01`).
    - `EMAIL_*`: Credentials for your SMTP server to allow the service to send email reports.

---

## Running the Service

You can run the service in development mode, as a production build, or in a Docker container.

### Development

This command runs the service using `ts-node`, which provides hot-reloading for immediate feedback during development.

```bash
pnpm dev
```

### Production

First, build the TypeScript project into JavaScript, then run the compiled output.

```bash
# 1. Build the project
pnpm build

# 2. Start the service
pnpm start
```

### Docker

You can build and run the service in a Docker container. This is the recommended way to run it in production.

```bash
# 1. Build the Docker image
docker build -t cortana-agent-service .

# 2. Run the container, passing in your .env file
docker run -p 8000:8000 --env-file .env cortana-agent-service
```

The service will be available at `http://localhost:8000`. You can check its health at `http://localhost:8000/health`.

### Azure Container Apps (Production Deployment)

For production deployment to Azure Container Apps, see the [**Deployment Guide**](./DEPLOYMENT.md) for detailed instructions.

Quick deployment:
```bash
# 1. Build and push to Azure Container Registry
./deploy-to-acr.azcli

# 2. Create Container Apps Environment
./deploy-container-app-env.azcli

# 3. Deploy the Container App
./deploy-to-container-apps.azcli

# 4. Update secrets with actual values
./update-container-app-secrets.azcli
```

---

## How to Add a New Agent

The framework is designed to make adding new agents simple.

1.  **Create a Directory:** Create a new folder for your agent inside `src/agents/`. For example, `src/agents/my-new-agent/`.
2.  **Implement the Agent:** Inside the new directory, create an `index.ts` file. In this file, define and export a constant named `agent` that implements the `Agent` interface.

    ```typescript
    // src/agents/my-new-agent/index.ts
    import { Agent } from '../../core/agent.interface';

    const myNewAgent: Agent = {
      name: 'My New Agent',
      schedule: '0 0 * * *', // Runs every day at midnight
      run: async () => {
        console.log('My new agent is running!');
        // Add your agent's logic here...
        await Promise.resolve();
      },
    };

    export const agent = myNewAgent;
    ```

3.  **Run:** Start the service. The agent registry will automatically detect and schedule your new agent.

---

## Roadmap & Future Improvements

This project is a foundational framework with many opportunities for improvement.

- **[TODO] Real Data Sources:** The `Trading Analyst` agent currently uses mock data. This should be replaced with a real news API (e.g., NewsAPI, Alpha Vantage, Alpaca).
- **[TODO] Robust Error Handling & Retries:** Implement more sophisticated error handling within the agent `run` methods, including retry logic for transient network failures.
- **[TODO] Dynamic Agent Management API:** Add API endpoints to the Express server to allow for enabling, disabling, or triggering agents at runtime without needing to restart the service.
- **[TODO] Database Integration:** Integrate a database (e.g., PostgreSQL, MongoDB) to log agent run history, store results, and manage agent state.
- **[TODO] Centralized Logging:** Use a structured logger (like Pino or Winston) and send logs to a centralized service (like Azure Monitor or Datadog) for better observability.
- **[TODO] More Agents:** Implement the placeholder `calendar-agent` and `crypto-agent` to demonstrate the framework's versatility.

## Caveats & Known Issues

- **Dynamic Imports & Bundling:** The current dynamic import mechanism in `agentRegistry.ts` works well with `ts-node` and the default `tsc` build. However, it may require special configuration if you decide to use a bundler like Webpack or Rollup, which often struggle with fully dynamic paths.
- **No Concurrency Control:** If an agent's `run` method takes longer to execute than its scheduled interval, a new run could be triggered while the previous one is still active. For long-running tasks, concurrency control should be implemented.
