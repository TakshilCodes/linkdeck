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

type ConnectableRedisClient = RedisClient & {
  connect?: () => Promise<void>;
  on?: (event: "error", listener: (error: Error) => void) => unknown;
  status?: string;
};

let client: ConnectableRedisClient | null = null;
let connectPromise: Promise<void> | null = null;
let hasLoggedRedisConnectionError = false;

function hasUpstashRedisEnv() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function handleRedisClientError(error: Error) {
  if (hasLoggedRedisConnectionError) return;

  hasLoggedRedisConnectionError = true;
  console.error(
    `[redis] Connection error: ${error.message}. Check REDIS_URL or use UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN.`
  );
}

async function createRedisClient(): Promise<ConnectableRedisClient> {
  if (hasUpstashRedisEnv()) {
    return (await import("@upstash/redis")).Redis.fromEnv() as unknown as ConnectableRedisClient;
  }

  const redisUrl = process.env.REDIS_URL?.trim();

  if (!redisUrl) {
    throw new Error(
      "Redis is not configured. Set REDIS_URL or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN."
    );
  }

  const Redis = (await import("ioredis")).default;
  const localClient = new Redis(redisUrl, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    connectTimeout: 5_000,
    commandTimeout: 5_000,
    retryStrategy: () => null,
  });

  localClient.on("error", handleRedisClientError);

  return localClient as unknown as ConnectableRedisClient;
}

async function connectRedisClient(redisClient: ConnectableRedisClient) {
  if (!redisClient.connect || redisClient.status === "ready") {
    return;
  }

  if (!connectPromise) {
    connectPromise = redisClient.connect().catch((error: unknown) => {
      hasLoggedRedisConnectionError = false;
      throw new Error(
        `Redis connection failed. Check your Redis hostname and REDIS_URL. ${getErrorMessage(error)}`
      );
    }).finally(() => {
      connectPromise = null;
    });
  }

  await connectPromise;
}

async function initRedis() {
  if (typeof window !== "undefined") {
    throw new Error("Redis is only available on the server");
  }

  if (!client) {
    client = await createRedisClient();
  }

  await connectRedisClient(client);
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

    if (hasUpstashRedisEnv()) {
      return client.set(key, value, { ex: ttlSeconds });
    }

    return client.set(key, value, "EX", ttlSeconds);
  },
};