import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

let cachedExpress: any;

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: any, res: any) {
  if (!cachedExpress) {
    cachedExpress = await bootstrap();
  }
  return cachedExpress(req, res);
}
