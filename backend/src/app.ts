import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import { seedIfEmpty } from './db.ts'
import { logger } from './logger.ts'
import * as repo from './repository.ts'
import { recipeInputSchema, recipePatchSchema } from './schema.ts'

seedIfEmpty()

const app: Express = express()
app.use(express.json({ limit: '12mb' }))

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = performance.now()
  res.on('finish', () => {
    const durationMs = Math.round(performance.now() - start)
    const meta = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
    }
    if (res.statusCode >= 500) {
      logger.error('request', meta)
    } else if (res.statusCode >= 400) {
      logger.warn('request', meta)
    } else {
      logger.info('request', meta)
    }
  })
  next()
})

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.get('/api/recipes', (_req: Request, res: Response) => {
  res.json(repo.listRecipes())
})

app.get('/api/recipes/:id', (req: Request, res: Response) => {
  const recipe = repo.getRecipe(String(req.params.id))
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' })
    return
  }
  res.json(recipe)
})

app.post('/api/recipes', (req: Request, res: Response) => {
  const parsed = recipeInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues })
    return
  }
  res.status(201).json(repo.createRecipe(parsed.data))
})

app.put('/api/recipes/:id', (req: Request, res: Response) => {
  const parsed = recipeInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues })
    return
  }
  const recipe = repo.updateRecipe(String(req.params.id), parsed.data)
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' })
    return
  }
  res.json(recipe)
})

app.patch('/api/recipes/:id', (req: Request, res: Response) => {
  const parsed = recipePatchSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues })
    return
  }
  const recipe = repo.patchRecipe(String(req.params.id), parsed.data)
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' })
    return
  }
  res.json(recipe)
})

app.delete('/api/recipes/:id', (req: Request, res: Response) => {
  const removed = repo.deleteRecipe(String(req.params.id))
  if (!removed) {
    res.status(404).json({ error: 'Recipe not found' })
    return
  }
  res.status(204).end()
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status =
    typeof err === 'object' && err !== null && 'status' in err
      ? Number((err as { status?: number }).status) || 500
      : 500
  logger.error('unhandled error', err)
  res
    .status(status)
    .json({ error: err instanceof Error ? err.message : 'Internal server error' })
})

export default app
