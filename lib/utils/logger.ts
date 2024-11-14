type LogLevel = "info" | "error" | "warn" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  name: string;
  env: string;
  message: string;
  meta?: any;
}

export class Logger {
  constructor(private name: string) {}

  private sanitizeMeta(meta: any): any {
    try {
      return JSON.parse(JSON.stringify(meta));
    } catch {
      if (meta instanceof Error) {
        return {
          message: meta.message,
          name: meta.name,
          stack: meta.stack,
        };
      }

      return String(meta);
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    try {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        name: this.name,
        env: process.env.NODE_ENV || "development",
        message: String(message),
        ...(meta !== undefined && { meta: this.sanitizeMeta(meta) }),
      };

      return JSON.stringify(logEntry);
    } catch (error) {
      return `${new Date().toISOString()} [${level.toUpperCase()}] ${this.name}: ${message} ${
        meta ? `| meta: ${String(meta)}` : ""
      }`;
    }
  }

  info(message: string, meta?: any) {
    console.log(this.formatMessage("info", message, meta));
  }

  error(message: string, meta?: any) {
    console.error(this.formatMessage("error", message, meta));
  }

  warn(message: string, meta?: any) {
    console.warn(this.formatMessage("warn", message, meta));
  }

  debug(message: string, meta?: any) {
    console.debug(this.formatMessage("debug", message, meta));
  }
}
