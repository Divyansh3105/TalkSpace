import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z.string().default('5001'),
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT Secret is required'),
  STREAM_API_KEY: z.string().min(1, 'Stream API Key is required'),
  STREAM_API_SECRET: z.string().min(1, 'Stream API Secret is required'),
  CORS_ORIGIN: z.string().min(1, 'CORS Origin is required'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
