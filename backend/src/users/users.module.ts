import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/db.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
