import dotenv from "dotenv";

dotenv.config();

export const config = {
  azureAIProjectEndpoint: process.env.AZURE_AI_PROJECT_ENDPOINT_STRING,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-05-01",
  emailHost: process.env.EMAIL_HOST,
  emailPort: parseInt(process.env.EMAIL_PORT || "587", 10),
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM,
  emailTo: process.env.EMAIL_TO,
};
