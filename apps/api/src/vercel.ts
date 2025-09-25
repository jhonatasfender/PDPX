import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import serverlessExpress from "@vendia/serverless-express";
import type { Handler, Callback, Context } from "aws-lambda";

let cachedHandler: Handler | null = null;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event,
  context: Context,
  callback: Callback,
) => {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return (cachedHandler as Handler)(event, context, callback);
};
