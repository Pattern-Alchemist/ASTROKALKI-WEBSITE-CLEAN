import { PrismaClient } from '@prisma/client'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * AstroKalki Prisma singleton.
 *
 * Why this is more defensive than the stock Next.js + Prisma template:
 * The standard `globalThis.prisma` pattern caches the client across HMR
 * reloads to avoid leaking DB connections in dev. The catch: when
 * `prisma db push` regenerates the client (e.g. after a schema upgrade),
 * the cached client is STALE — it doesn't have delegates for newly-added
 * models, so `db.sessionRecap` becomes `undefined` and every call throws.
 *
 * Fix: in dev, key the cache on the schema.prisma file's mtime. When the
 * schema changes (db:push bumps the mtime), we drop the cached client and
 * instantiate a fresh one. Production behavior is unchanged (cache once,
 * reuse forever).
 */
type CachedDb = PrismaClient & { __schemaMtime?: number }

const globalForPrisma = globalThis as unknown as {
  prisma: CachedDb | undefined
}

function schemaMtime(): number {
  try {
    return statSync(resolve(process.cwd(), 'prisma/schema.prisma')).mtimeMs
  } catch {
    return 0
  }
}

function createClient(): CachedDb {
  // Preserve the original logging behavior (query-level logging in dev).
  return new PrismaClient({ log: ['query'] }) as CachedDb
}

const mtime = schemaMtime()
const cached = globalForPrisma.prisma
const cacheFresh =
  cached !== undefined &&
  (process.env.NODE_ENV === 'production' || cached.__schemaMtime === mtime)

export const db: PrismaClient = cacheFresh ? cached! : createClient()

if (process.env.NODE_ENV !== 'production') {
  ;(db as CachedDb).__schemaMtime = mtime
  globalForPrisma.prisma = db as CachedDb
}
