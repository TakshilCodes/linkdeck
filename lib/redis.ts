let client: any;

// Initialize Redis client only on server side
async function initRedis() {
  if (typeof window === 'undefined' && !client) {
    client = process.env.NODE_ENV === "production"
      ? (await import("@upstash/redis")).Redis.fromEnv()
      : new (await import("ioredis")).default(process.env.REDIS_URL!);
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
      return (client as any).set(key, value, { ex: ttlSeconds });
    }

    return (client as any).set(key, value, "EX", ttlSeconds);
  },
};