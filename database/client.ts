/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

let db: any;

try {
  if (process.env.DATABASE_URL) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    db = drizzle(pool);
  } else {
    throw new Error('DATABASE_URL not set');
  }
} catch {
  console.warn('[AI Studio] Database not connected — using mock');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };
  db = new Proxy(
    {},
    {
      get: (_, prop) => {
        if (prop === 'query') return new Proxy({}, { get: () => noOp });
        if (prop === 'select') return () => ({ from: () => ({ where: async () => [] }) });
        if (prop === 'insert') return () => ({ values: () => ({ returning: async () => [] }) });
        if (prop === 'update')
          return () => ({ set: () => ({ where: () => ({ returning: async () => [] }) }) });
        if (prop === 'delete') return () => ({ where: () => ({ returning: async () => [] }) });
        if (prop === 'transaction') return async (cb: any) => cb(db);
        return async () => [];
      },
    }
  );
}

export { db };
