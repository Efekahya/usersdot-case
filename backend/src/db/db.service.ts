import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger
} from "@nestjs/common";
import { Pool } from "pg";
import { ConfigService } from "@nestjs/config";

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
    console.log("Database connected");
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.log("Database connection closed");
  }

  async query<T>(
    text: string,
    params?: any[]
  ): Promise<{
    success: boolean;
    data?: T;
    error?: string;
  }> {
    try {
      const result = await this.pool.query(text, params);
      return {
        success: true,
        data: result.rows
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
