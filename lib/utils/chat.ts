import type { Message } from "@/types";

import { redis } from "@/lib/database/redis";
import { Logger } from "@/lib/utils/logger";

export class ChatLib {
  static logger = new Logger("ChatLib");

  static MESSAGES_LIMIT = 30;
  static CHAT_HISTORY_EXPIRATION = 60 * 60 * 10;

  static generateChatKey(menuId: string): string {
    this.logger.debug("Generating chat key", { menuId });

    return `menu:${menuId}:chat`;
  }

  static async getMessages(menuId: string): Promise<Message[]> {
    this.logger.debug("Fetching chat messages", { menuId });
    const key = this.generateChatKey(menuId);
    const messages = await redis.getJson<Message[]>(key);

    return messages || [];
  }

  static async addMessage(menuId: string, message: Message): Promise<void> {
    this.logger.debug("Adding message to chat", { menuId, message });
    const key = this.generateChatKey(menuId);
    const messages = await this.getMessages(menuId);

    messages.push(message);

    await redis.setJsonEx(key, messages, this.CHAT_HISTORY_EXPIRATION);
  }

  static async getRecentMessages(
    menuId: string,
    limit: number = this.MESSAGES_LIMIT,
  ): Promise<Message[]> {
    this.logger.debug("Fetching recent chat messages", { menuId, limit });
    const messages = await this.getMessages(menuId);

    return messages.slice(-limit);
  }
}
