import { Router, type Request, type Response } from 'express'
import { health } from '../handlers/health.ts'
import { sendError } from './middleware.ts'
import { recipesRouter } from './recipes.ts'

export const API_BASE = '/api'

export const apiRouter = Router()

apiRouter.get('/health', (_req: Request, res: Response) => {
  try {
    return res.json(health())
  } catch (error) {
    return sendError(res, error)
  }
})

apiRouter.use('/recipes', recipesRouter)
