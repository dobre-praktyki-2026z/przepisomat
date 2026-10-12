import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../utility/httpError.ts'
import { logger } from '../utility/logger.ts'

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = performance.now()
  res.on('finish', () => {
    const meta = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(performance.now() - start),
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
}

function statusOf(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const value = Number((error as { status?: unknown }).status)
    if (Number.isInteger(value) && value >= 400 && value < 600) {
      return value
    }
  }
  return undefined
}

export function sendError(res: Response, error: unknown): Response {
  if (error instanceof HttpError) {
    if (error.status >= 500) {
      logger.error('request failed', error)
    }
    return error.issues
      ? res.status(error.status).json({ error: error.message, issues: error.issues })
      : res.status(error.status).json({ error: error.message })
  }

  const status = statusOf(error)
  if (status !== undefined) {
    if (status >= 500) {
      logger.error('request failed', error)
    }
    return res.status(status).json({
      error: error instanceof Error ? error.message : 'Request failed',
    })
  }

  logger.error('unhandled error', error)
  return res.status(500).json({ error: 'Internal server error' })
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  sendError(res, err)
}
