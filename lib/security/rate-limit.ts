import { redis } from "@/lib/redis";

type FixedWindowRateLimitOptions = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export async function checkFixedWindowRateLimit({
  key,
  limit,
  windowSeconds,
}: FixedWindowRateLimitOptions) {
  const count = Number(await redis.incr(key));

  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }

  return {
    allowed: count <= limit,
    count,
    limit,
  };
}

export async function isCooldownActive(key: string) {
  return Boolean(await redis.get(key));
}

export async function setCooldown(key: string, seconds: number) {
  await redis.set(key, "1", seconds);
}