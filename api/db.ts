import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

export const sql = databaseUrl ? neon(databaseUrl) : (() => {
  throw new Error('DATABASE_URL is missing. Please set it in Vercel environment variables.');
}) as any;
