import { Redis } from "ioredis";

let client: Redis | null = null;

function getClient(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      disconnectTimeout: 2000,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      enableReadyCheck: false,
      keepAlive: 1000,
      connectionName: "vercel-serverless",
    });

    client.on("error", (error) => {
      console.error("Redis connection error:", error);
      client = null;
    });
  }

  return client;
}

export async function get(key: string): Promise<string | null> {
  return getClient().get(key);
}

export async function set(key: string, value: string): Promise<string> {
  return getClient().set(key, value);
}

export async function getJson<T>(key: string): Promise<T | null> {
  try {
    const value = await getClient().get(key);

    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Redis getJson error:", error);

    return null;
  }
}

export async function setJson<T>(key: string, value: T): Promise<string> {
  return getClient().set(key, JSON.stringify(value));
}

export async function setJsonEx<T>(
  key: string,
  value: T,
  seconds: number,
): Promise<string> {
  return getClient().set(key, JSON.stringify(value), "EX", seconds);
}
