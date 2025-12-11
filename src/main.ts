import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Permite requests sin origin (ej: Postman, server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Lista de orígenes permitidos desde variable de entorno
      const allowedOrigins = (
        process.env.ALLOWED_ORIGINS || 'http://localhost:4200'
      ).split(',');

      // Verifica si el origin está en la lista permitida
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      // Permite TODOS los subdominios de Vercel (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
