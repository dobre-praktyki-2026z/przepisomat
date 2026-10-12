import app from './app.ts'
import { logger } from './logger.ts'

const port = Number(process.env.PORT ?? 3000)

process.on('unhandledRejection', (reason) => {
  logger.error('unhandled rejection', reason)
})

process.on('uncaughtException', (error) => {
  logger.error('uncaught exception', error)
})

app.listen(port, () => {
  logger.info(`przepisomat API listening on http://localhost:${port}`)
})
