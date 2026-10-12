import express, { type Express } from 'express'
import { initSchema } from './database/schema.ts'
import { seedIfEmpty } from './database/seed.ts'
import { API_BASE, apiRouter } from './routers/index.ts'
import { errorHandler, requestLogger } from './routers/middleware.ts'

export function createApp(): Express {
  initSchema()
  seedIfEmpty()

  const app = express()
  app.use(express.json({ limit: '12mb' }))
  app.use(requestLogger)
  app.use(API_BASE, apiRouter)
  app.use(errorHandler)
  return app
}

export const app = createApp()
export default app
