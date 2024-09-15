import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger
} from "@nestjs/common";
import { Pool } from "pg";
import { ConfigService } from "@nestjs/config";
import { QueryResult } from "src/types";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get("DB_HOST"),
      port: this.configService.get<number>("DB_PORT"),
      user: this.configService.get("DB_USER"),
      password: this.configService.get("DB_PASSWORD"),
      database: this.configService.get("DB_NAME")
    });
  }

  async onModuleInit() {
    await this.pool.connect();
    console.info("Database connected");
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.info("Database connection closed");
  }

  async query<T>(
    text: string,
    params?: unknown[],
    parser?: (data: T[]) => T[]
  ): Promise<QueryResult<T[]>> {
    try {
      const result = await this.pool.query(text, params);
      return {
        success: true,
        data: parser ? parser(result.rows as T[]) : (result.rows as T[])
      };
    } catch (error) {
      this.logger.error(error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
