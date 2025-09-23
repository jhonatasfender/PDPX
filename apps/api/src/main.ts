import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3010;
  await app.listen(port);
}

bootstrap();
