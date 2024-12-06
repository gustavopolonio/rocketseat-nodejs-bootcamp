import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']).default('production'),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('⚠ Invalid environment variables!', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
