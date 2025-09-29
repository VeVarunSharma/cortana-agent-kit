import dotenv from 'dotenv';

dotenv.config();

export const models = {
  'o4-mini': {
    modelName: 'o4-mini',
    deploymentName: 'o4-mini',
    endpoint: 'https://vesh-mg3br74m-eastus2.cognitiveservices.azure.com/openai/deployments/o4-mini/chat/completions?api-version=2025-01-01-preview',
    apiKey: process.env.AZURE_OPENAI_API_KEY_O4_MINI,
    apiVersion: '2024-12-01-preview',
  },
  'deepseek-r1': {
    modelName: 'deepseek-r1',
    deploymentName: 'DeepSeek-R1',
    endpoint: 'https://cortana-agent-kit-experimentation.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview',
    apiKey: process.env.AZURE_OPENAI_API_KEY_DEEPSEEK_R1,
    apiVersion: '2024-05-01',
  },
};
