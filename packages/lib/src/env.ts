/**
 * Read a required environment variable or throw with a clear message.
 * Prefer calling this at module boundaries (clients, config), not in every render.
 */
export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

/** Read an env var with a fallback when unset or empty. */
export function getEnv(name: string, fallback: string): string {
  const value = process.env[name]
  return value && value.length > 0 ? value : fallback
}
