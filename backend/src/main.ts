import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createDB } from "./utils/createDB";
import { populateDB } from "./utils/populateDB";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await createDB();
  await populateDB();
  await app.listen(3000);
}
bootstrap();
