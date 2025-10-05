# Azure Container Apps Deployment Scripts

This directory contains scripts to deploy the Cortana Agent Kit service to Azure Container Apps.

## Quick Start

Run these scripts in order for a complete deployment:

```bash
# 1. Build and push Docker image to Azure Container Registry
./deploy-to-acr.azcli

# 2. Create Container Apps Environment with monitoring
./deploy-container-app-env.azcli

# 3. Deploy the Container App
./deploy-to-container-apps.azcli

# 4. Update secrets with actual values
./update-container-app-secrets.azcli
```

## Script Details

### 1. `deploy-to-acr.azcli`
- Creates Azure Container Registry (`cortanaagentkitacr`)
- Builds and pushes Docker image
- **Prerequisites**: Docker installed locally

### 2. `deploy-container-app-env.azcli`
- Creates Log Analytics workspace for monitoring
- Creates Container Apps Environment (`cortana-agent-kit-env`)
- **Prerequisites**: Azure CLI with appropriate permissions

### 3. `deploy-to-container-apps.azcli`
- Deploys the Container App with:
  - External ingress on port 8000
  - Auto-scaling (1-10 replicas)
  - Environment variables configured as secrets
- **Prerequisites**: Steps 1 and 2 completed

### 4. `update-container-app-secrets.azcli`
- Interactive script to update secret values
- Prompts for actual API keys and credentials
- **Prerequisites**: Step 3 completed

## Configuration

The deployment creates:
- **Resource Group**: `cortana-agent-kit-rg`
- **Container Registry**: `cortanaagentkitacr`
- **Container App Environment**: `cortana-agent-kit-env`
- **Container App**: `cortana-agent-kit`

## Required Secrets

You'll need to provide these values when running the secrets update script:
- Azure OpenAI API keys (for both models)
- Email SMTP configuration
- Alpha Vantage API key

## Verification

After deployment, verify the service is running:

```bash
# Get the Container App URL
az containerapp show \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --query properties.configuration.ingress.fqdn

# Test health endpoint
curl https://YOUR_CONTAINER_APP_URL/health
```

For detailed information, see [DEPLOYMENT.md](./DEPLOYMENT.md).