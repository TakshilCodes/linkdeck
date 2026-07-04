type RedisSetOptions = { ex: number };

type RedisClient = {
  get(key: string): Promise<unknown> | unknown;
  del(key: string): Promise<unknown> | unknown;
  incr(key: string): Promise<number> | number;
  expire(key: string, seconds: number): Promise<unknown> | unknown;
  set(key: string, value: string): Promise<unknown> | unknown;
  set(key: string, value: string, options: RedisSetOptions): Promise<unknown> | unknown;
  set(key: string, value: string, mode: "EX", seconds: number): Promise<unknown> | unknown;
};

let client: RedisClient | null = null;

async function initRedis() {
  if (typeof window === "undefined" && !client) {
    client = process.env.NODE_ENV === "production"
      ? (await import("@upstash/redis")).Redis.fromEnv() as unknown as RedisClient
      : new (await import("ioredis")).default(process.env.REDIS_URL!) as unknown as RedisClient;
  }

  if (!client) {
    throw new Error("Redis is only available on the server");
  }

  return client;
}

export const redis = {
  async get(key: string) {
    const client = await initRedis();
    return client.get(key);
  },

  async del(key: string) {
    const client = await initRedis();
    return client.del(key);
  },

  async incr(key: string) {
    const client = await initRedis();
    return client.incr(key);
  },

  async expire(key: string, seconds: number) {
    const client = await initRedis();
    return client.expire(key, seconds);
  },

  async set(key: string, value: string, ttlSeconds?: number) {
    const client = await initRedis();

    if (!ttlSeconds) {
      return client.set(key, value);
    }

    if (process.env.NODE_ENV === "production") {
      return client.set(key, value, { ex: ttlSeconds });
    }

    return client.set(key, value, "EX", ttlSeconds);
  },
};