import type { PrismaClient } from "@/app/generated/prisma/client";
import type { Pool } from "pg";

type PrismaClientConstructor = typeof import("@/app/generated/prisma/client")["PrismaClient"];
type PrismaPgConstructor = typeof import("@prisma/adapter-pg")["PrismaPg"];
type PgPoolConstructor = typeof import("pg")["Pool"];

type PrismaGlobal = {
  prisma?: PrismaClient;
  prismaPromise?: Promise<PrismaClient>;
  prismaPool?: Pool;
};

const globalForPrisma = globalThis as unknown as PrismaGlobal;

async function loadPrismaRuntime() {
  const [clientModule, adapterModule, pgModule] = await Promise.all([
    import("@/app/generated/prisma/client"),
    import("@prisma/adapter-pg"),
    import("pg"),
  ]);

  return {
    PrismaClient: clientModule.PrismaClient as PrismaClientConstructor,
    PrismaPg: adapterModule.PrismaPg as PrismaPgConstructor,
    Pool: pgModule.Pool as PgPoolConstructor,
  };
}

async function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to initialize Prisma");
  }

  const { PrismaClient, PrismaPg, Pool: PgPool } = await loadPrismaRuntime();
  const pool = globalForPrisma.prismaPool ?? new PgPool({ connectionString });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prismaPool = pool;
    globalForPrisma.prisma = client;
  }

  return client;
}

async function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  globalForPrisma.prismaPromise ??= createPrismaClient();
  const client = await globalForPrisma.prismaPromise;
  globalForPrisma.prisma = client;

  return client;
}

function createPrismaPropertyProxy(property: PropertyKey) {
  return new Proxy(function prismaPropertyProxy() {}, {
    get(_target, nestedProperty) {
      if (nestedProperty === "then") {
        return undefined;
      }

      return async (...args: unknown[]) => {
        const client = await getPrismaClient();
        const value = Reflect.get(client, property, client);
        const nestedValue = Reflect.get(value, nestedProperty, value);

        return typeof nestedValue === "function"
          ? nestedValue.apply(value, args)
          : nestedValue;
      };
    },
    apply(_target, _thisArg, args) {
      return getPrismaClient().then((client) => {
        const value = Reflect.get(client, property, client);

        if (typeof value !== "function") {
          return value;
        }

        return value.apply(client, args);
      });
    },
  });
}

const prisma = new Proxy(function prismaProxy() {}, {
  get(_target, property) {
    if (property === "then") {
      return undefined;
    }

    return createPrismaPropertyProxy(property);
  },
}) as unknown as PrismaClient;

export default prisma;