import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Email
  emailHost: process.env.EMAIL_HOST,
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM,
  emailTo: process.env.EMAIL_TO,

  // Alpha Vantage
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
};
