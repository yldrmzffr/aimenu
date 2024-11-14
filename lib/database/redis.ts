import { Redis } from "ioredis";

import { Logger } from "../utils/logger";

export class RedisClient {
  private static instance: RedisClient | null = null;
  private client: Redis | null = null;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger("RedisClient");
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }

    return RedisClient.instance;
  }

  private getClient(): Redis {
    if (!this.client) {
      this.logger.info("Initializing Redis connection");

      this.client = new Redis(
        process.env.REDIS_URL || "redis://localhost:6379",
        {
          maxRetriesPerRequest: 3,
          connectTimeout: 5000,
          disconnectTimeout: 2000,
          retryStrategy: (times) => Math.min(times * 50, 2000),
          enableReadyCheck: false,
          keepAlive: 1000,
          connectionName: "vercel-serverless",
        },
      );

      this.client.on("error", (error) => {
        this.logger.error("Redis connection error", { error: error.message });
        this.client = null;
      });

      this.client.on("connect", () => {
        this.logger.info("Redis connected successfully");
      });
    }

    return this.client;
  }

  public async get(key: string): Promise<string | null> {
    try {
      const value = await this.getClient().get(key);

      this.logger.debug("Redis GET operation", { key, success: true });

      return value;
    } catch (error) {
      this.logger.error("Redis GET operation failed", { key, error });
      throw error;
    }
  }

  public async set(key: string, value: string): Promise<string> {
    try {
      const result = await this.getClient().set(key, value);

      this.logger.debug("Redis SET operation", { key, success: true });

      return result;
    } catch (error) {
      this.logger.error("Redis SET operation failed", { key, error });
      throw error;
    }
  }

  public async getJson<T>(key: string): Promise<T | null> {
    try {
      const value = await this.getClient().get(key);

      this.logger.debug("Redis GET JSON operation", { key, success: true });

      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error("Redis GET JSON operation failed", { key, error });

      return null;
    }
  }

  public async setJson<T>(key: string, value: T): Promise<string> {
    try {
      const result = await this.getClient().set(key, JSON.stringify(value));

      this.logger.debug("Redis SET JSON operation", { key, success: true });

      return result;
    } catch (error) {
      this.logger.error("Redis SET JSON operation failed", { key, error });
      throw error;
    }
  }

  public async setJsonEx<T>(
    key: string,
    value: T,
    seconds: number,
  ): Promise<string> {
    try {
      const result = await this.getClient().set(
        key,
        JSON.stringify(value),
        "EX",
        seconds,
      );

      this.logger.debug("Redis SET JSON EX operation", {
        key,
        seconds,
        success: true,
      });

      return result;
    } catch (error) {
      this.logger.error("Redis SET JSON EX operation failed", {
        key,
        seconds,
        error,
      });
      throw error;
    }
  }

  public async del(key: string): Promise<number> {
    try {
      const result = await this.getClient().del(key);

      this.logger.debug("Redis DEL operation", { key, success: true });

      return result;
    } catch (error) {
      this.logger.error("Redis DEL operation failed", { key, error });
      throw error;
    }
  }
}

export const redis = RedisClient.getInstance();
