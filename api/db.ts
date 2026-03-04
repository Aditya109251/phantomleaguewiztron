import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

export const getSql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set in environment variables. Please add it to your Vercel project settings.');
  }
  return neon(url);
};

// For backward compatibility with existing code, but using a proxy to handle errors
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  return getSql()(strings, ...values);
};
