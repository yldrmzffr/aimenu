import type { Message } from "@/types";

import * as redis from "@/lib/database/redis";

const MESSAGE_LIMIT = 30;

const CHAT_HISTORY_EXPIRATION = 60 * 60 * 10;

export const ChatLib = {
  generateChatKey(menuId: string) {
    return `menu:${menuId}:chat`;
  },

  async getMessages(menuId: string): Promise<Message[]> {
    const key = this.generateChatKey(menuId);
    const messages = await redis.getJson<Message[]>(key);

    return messages || [];
  },

  async addMessage(menuId: string, message: Message): Promise<void> {
    const key = this.generateChatKey(menuId);
    const messages = await this.getMessages(menuId);

    messages.push(message);

    await redis.setJsonEx(key, messages, CHAT_HISTORY_EXPIRATION);
  },

  async getRecentMessages(
    menuId: string,
    limit: number = MESSAGE_LIMIT,
  ): Promise<Message[]> {
    const messages = await this.getMessages(menuId);

    return messages.slice(-limit);
  },
};
