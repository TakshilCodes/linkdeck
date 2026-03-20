type RedisLike = {
  get: (key: string) => Promise<any>;
  set: (...args: any[]) => Promise<any>;
  del: (key: string) => Promise<any>;
};

let redis: RedisLike;

if (process.env.NODE_ENV === "production") {
  const { Redis } = await import("@upstash/redis");
  redis = Redis.fromEnv();
} else {
  const IORedis = (await import("ioredis")).default;
  redis = new IORedis(process.env.REDIS_URL!);
}

export { redis };