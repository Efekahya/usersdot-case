import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createDB } from "./utils/createDB";
import { populateDB } from "./utils/populateDB";

async function bootstrap() {
  await createDB();
  await populateDB();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("api/v1");
  await app.listen(3000);
}
bootstrap();
