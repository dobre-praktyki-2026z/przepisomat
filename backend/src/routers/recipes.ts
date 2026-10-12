import { Router, type Request, type Response } from 'express'
import * as controller from '../handlers/recipes.ts'
import {
  validateRecipeInput,
  validateRecipePatch,
} from '../handlers/validation.ts'
import { sendError } from './middleware.ts'

export const recipesRouter = Router()

recipesRouter.get('/', (_req: Request, res: Response) => {
  try {
    return res.json(controller.listRecipes())
  } catch (error) {
    return sendError(res, error)
  }
})

recipesRouter.get('/:id', (req: Request, res: Response) => {
  try {
    return res.json(controller.getRecipe(String(req.params.id)))
  } catch (error) {
    return sendError(res, error)
  }
})

recipesRouter.post('/', (req: Request, res: Response) => {
  try {
    const input = validateRecipeInput(req.body)
    return res.status(201).json(controller.createRecipe(input))
  } catch (error) {
    return sendError(res, error)
  }
})

recipesRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const input = validateRecipeInput(req.body)
    return res.json(controller.updateRecipe(String(req.params.id), input))
  } catch (error) {
    return sendError(res, error)
  }
})

recipesRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const patch = validateRecipePatch(req.body)
    return res.json(controller.patchRecipe(String(req.params.id), patch))
  } catch (error) {
    return sendError(res, error)
  }
})

recipesRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    controller.deleteRecipe(String(req.params.id))
    return res.status(204).end()
  } catch (error) {
    return sendError(res, error)
  }
})
