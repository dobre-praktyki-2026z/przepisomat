type Level = 'debug' | 'info' | 'warn' | 'error'

const LEVELS: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const configured = process.env.LOG_LEVEL as Level | undefined
const threshold = configured && configured in LEVELS ? LEVELS[configured] : LEVELS.info

function serialize(meta: unknown): string {
  if (meta instanceof Error) {
    return JSON.stringify({
      name: meta.name,
      message: meta.message,
      stack: meta.stack,
    })
  }
  return JSON.stringify(meta)
}

function write(level: Level, message: string, meta?: unknown): void {
  if (LEVELS[level] < threshold) {
    return
  }
  const timestamp = new Date().toISOString()
  const suffix = meta === undefined ? '' : ` ${serialize(meta)}`
  process.stdout.write(`${timestamp} ${level.toUpperCase()} ${message}${suffix}\n`)
}

export const logger = {
  debug: (message: string, meta?: unknown) => write('debug', message, meta),
  info: (message: string, meta?: unknown) => write('info', message, meta),
  warn: (message: string, meta?: unknown) => write('warn', message, meta),
  error: (message: string, meta?: unknown) => write('error', message, meta),
}
