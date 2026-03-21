const client =
  process.env.NODE_ENV === "production"
    ? (await import("@upstash/redis")).Redis.fromEnv()
    : new (await import("ioredis")).default(process.env.REDIS_URL!);

export const redis = {
  get(key: string) {
    return client.get(key);
  },

  del(key: string) {
    return client.del(key);
  },

  incr(key: string) {
    return client.incr(key);
  },

  expire(key: string, seconds: number) {
    return client.expire(key, seconds);
  },

  async set(key: string, value: string, ttlSeconds?: number) {
    if (!ttlSeconds) {
      return client.set(key, value);
    }

    if (process.env.NODE_ENV === "production") {
      return (client as any).set(key, value, { ex: ttlSeconds });
    }

    return (client as any).set(key, value, "EX", ttlSeconds);
  },
};