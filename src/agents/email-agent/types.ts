export interface Email {
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  timestamp: number;
}
