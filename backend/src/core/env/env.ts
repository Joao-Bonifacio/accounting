import { z } from 'zod'

export const envSchema = z.object({
  POSTGRES_URL: z.string().pipe(z.url()),
  MONGODB_URL: z.string().pipe(z.url()),
  PORT: z.coerce.number().optional().default(8080),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_ENDPOINT: z.string(),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  SESSION_SECRET: z.string(),
  APP_ENDPOINT: z.string(),
  RPC_HTTP_URL: z.string().pipe(z.url()),
  RPC_WS_URL: z.string().pipe(z.url()),
  PRIVATE_KEY: z.string(),
  ERC20_ADDRESS: z.string(),
  ACCOUNT_ADDRESS: z.string(),
})

export type Env = z.infer<typeof envSchema>
