import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function get(key: string): Promise<string | null> {
  return redis.get(key);
}

export async function set(key: string, value: string): Promise<string> {
  return redis.set(key, value);
}

export async function getJson<T>(key: string): Promise<T | null> {
  const value = await redis.get(key);

  return value ? JSON.parse(value) : null;
}

export async function setJson<T>(key: string, value: T): Promise<string> {
  return redis.set(key, JSON.stringify(value));
}

export async function setJsonEx<T>(
  key: string,
  value: T,
  seconds: number,
): Promise<string> {
  return redis.set(key, JSON.stringify(value), "EX", seconds);
}
