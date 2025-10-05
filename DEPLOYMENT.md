# Azure Container Apps Deployment Guide

This guide walks you through deploying the Cortana Agent Kit service to Azure Container Apps for a scalable and managed production environment.

## Prerequisites

- **Azure CLI**: Install and configure the Azure CLI on your local machine
- **Docker**: Required for building and pushing container images
- **Azure Subscription**: You need an active Azure subscription
- **Resource Group**: The deployment uses resource group `cortana-agent-kit-rg`

## Deployment Steps

### 1. Build and Push Image to Azure Container Registry

First, ensure your Docker image is built and pushed to Azure Container Registry:

```bash
# Build the Docker image locally
docker build -t cortana-agent-kit:latest .

# Push to Azure Container Registry
./deploy-to-acr.azcli
```

This script will:
- Create the resource group `cortana-agent-kit-rg`
- Create Azure Container Registry `cortanaagentkitacr`
- Build and push your Docker image to ACR

### 2. Create Container Apps Environment

Set up the Azure Container Apps Environment with monitoring:

```bash
./deploy-container-app-env.azcli
```

This script will:
- Create a Log Analytics workspace for monitoring
- Create the Container Apps Environment `cortana-agent-kit-env`
- Configure logging and monitoring

### 3. Deploy the Container App

Deploy your service to Azure Container Apps:

```bash
./deploy-to-container-apps.azcli
```

This script will:
- Create the Container App `cortana-agent-kit`
- Configure ingress on port 8000
- Set up auto-scaling (1-10 replicas)
- Configure environment variables with placeholder secrets

### 4. Update Secret Values

After deployment, update the secrets with actual values:

```bash
./update-container-app-secrets.azcli
```

This interactive script will prompt you to enter:
- Azure OpenAI API keys
- Email SMTP configuration
- Alpha Vantage API key

## Configuration

### Environment Variables

The Container App is configured with the following environment variables:

| Variable | Description | Source |
|----------|-------------|---------|
| `PORT` | Application port | Set to 8000 |
| `EMAIL_PORT` | SMTP port | Set to 587 |
| `AZURE_OPENAI_API_KEY_O4_MINI` | API key for O4-Mini model | Secret |
| `AZURE_OPENAI_API_KEY_DEEPSEEK_R1` | API key for DeepSeek-R1 model | Secret |
| `EMAIL_HOST` | SMTP server hostname | Secret |
| `EMAIL_USER` | SMTP username | Secret |
| `EMAIL_PASS` | SMTP password | Secret |
| `EMAIL_FROM` | From email address | Secret |
| `EMAIL_TO` | To email address | Secret |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | Secret |

### Scaling Configuration

The Container App is configured with:
- **CPU**: 1.0 cores
- **Memory**: 2.0 GB
- **Min Replicas**: 1
- **Max Replicas**: 10
- **Auto-scaling**: Based on CPU and memory usage

### Ingress Configuration

- **External ingress**: Enabled for public access
- **Target Port**: 8000
- **Health Check**: Available at `/health` endpoint

## Post-Deployment Verification

### 1. Check Deployment Status

```bash
# Get the Container App URL
az containerapp show \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --query properties.configuration.ingress.fqdn

# Check revision status
az containerapp revision list \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --query '[].{Name:name,Active:properties.active,CreatedTime:properties.createdTime}'
```

### 2. Test the Service

```bash
# Test health endpoint
curl https://YOUR_CONTAINER_APP_URL/health

# Test agent trigger endpoint
curl -X POST https://YOUR_CONTAINER_APP_URL/api/agents/trading-analyst/run
```

### 3. Monitor Logs

```bash
# View live logs
az containerapp logs show \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --follow

# View recent logs
az containerapp logs show \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --tail 50
```

## Management Commands

### Update Container App

To update the container app with a new image:

```bash
# Build and push new image
./deploy-to-acr.azcli

# Update the container app
az containerapp update \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --image cortanaagentkitacr.azurecr.io/cortana-agent-kit:latest
```

### Scale the Application

```bash
# Manual scaling
az containerapp update \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --min-replicas 2 \
  --max-replicas 20

# Update CPU/Memory
az containerapp update \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --cpu 2.0 \
  --memory 4.0Gi
```

### Manage Secrets

```bash
# List current secrets
az containerapp secret list \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg

# Update a specific secret
az containerapp secret set \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --secrets "email-pass=new_password_value"
```

## Troubleshooting

### Common Issues

1. **Container fails to start**: Check logs for environment variable issues
2. **Secrets not working**: Ensure secrets are updated with actual values
3. **Image pull failures**: Verify ACR credentials and image exists
4. **Health check failures**: Ensure port 8000 is exposed and service is running

### Debugging Commands

```bash
# Check container app status
az containerapp show \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --query properties.provisioningState

# View environment variables
az containerapp show \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg \
  --query properties.template.containers[0].env

# Check revision history
az containerapp revision list \
  --name cortana-agent-kit \
  --resource-group cortana-agent-kit-rg
```

## Security Best Practices

1. **Secrets Management**: All sensitive values are stored as Container App secrets
2. **Network Security**: Consider using private Container Apps Environment for additional security
3. **Identity**: Use managed identities where possible instead of API keys
4. **Monitoring**: Enable Application Insights for detailed monitoring and alerts

## Cost Optimization

1. **Auto-scaling**: Set appropriate min/max replicas based on your usage patterns
2. **Resource allocation**: Right-size CPU and memory based on actual usage
3. **Development environments**: Use smaller resource allocations for non-production environments

## Next Steps

1. Set up Application Insights for detailed monitoring
2. Configure custom domains if needed
3. Implement CI/CD pipeline for automated deployments
4. Set up alerts and monitoring dashboards