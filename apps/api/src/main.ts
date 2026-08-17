import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: true,
    credentials: true,
  })

  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Tier List Live API')
    .setDescription('Real-time collaborative Tier List maker REST & WebSocket API')
    .setVersion('1.0')
    .addTag('Health')
    .addTag('Templates')
    .addTag('Tier Lists')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 Tier List API running on: http://localhost:${port}/api`)
  console.log(`📑 Swagger Documentation available at: http://localhost:${port}/api/docs`)
}

bootstrap()
