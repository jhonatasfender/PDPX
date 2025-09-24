import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });

  const config = new DocumentBuilder()
    .setTitle("PDPX API")
    .setDescription("Projeto PDPX - API")
    .setVersion("1.0")
    .addTag("auth", "Endpoints de autenticação")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const basePort = process.env.API_PORT ? Number(process.env.API_PORT) : 3010;
  app.enableShutdownHooks();
  const maxAttempts = 5;
  const delayMs = 500;
  let attempt = 0;
  let port = basePort;
  // Retry listen to avoid EADDRINUSE races on rapid restarts
  // (previous process may still be releasing the port)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await app.listen(port);
      // eslint-disable-next-line no-console
      console.log(`[API] Listening on port ${port}`);
      break;
    } catch (err: any) {
      if (err?.code === "EADDRINUSE" && attempt < maxAttempts) {
        attempt++;
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      } else if (err?.code === "EADDRINUSE" && attempt >= maxAttempts) {
        // After exhausting attempts, try next port
        port += 1;
        attempt = 0;
        // eslint-disable-next-line no-console
        console.warn(
          `[API] Port in use. Switching to port ${port} and retrying...`,
        );
        continue;
      }
      throw err;
    }
  }
  const httpServer: any = app.getHttpServer?.();

  let isShuttingDown = false;
  const shutdown = async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    try {
      await app.close();
    } catch {}
    try {
      httpServer?.close?.(() => process.exit(0));
    } catch {
      process.exit(0);
    }
    setTimeout(() => process.exit(0), 1000).unref();
  };

  ["SIGINT", "SIGTERM", "SIGUSR2"].forEach((sig) => {
    process.on(sig as NodeJS.Signals, shutdown);
  });
}

bootstrap();
