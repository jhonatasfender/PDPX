import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

let cachedExpress: any;

async function bootstrap(): Promise<any> {
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

  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: any, res: any) {
  if (!cachedExpress) {
    cachedExpress = await bootstrap();
  }
  return cachedExpress(req, res);
}
