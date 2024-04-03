import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppInterceptor } from './utils/interceptor';
import { AppExceptionFilter } from './filter/exception.filter';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

	app.use(function (req, res, next) {
		req.headers.origin = req.headers.origin || req.headers.host;
		next();
	});

	// var whitelist = process.env.CORS_OPTION_ORIGIN.split(",");
  const corsOptions = {
		exposedHeaders: ['Content-Disposition'],
    // 'origin': function (origin, callback) {
    //   if (whitelist.indexOf(origin) !== -1) {
    //       callback(null, true)
    //   } else {
    //     console.log("blocked cors for:", origin)
    //     callback(new Error('Not allowed by CORS'))
    //   }
    // },
    'methods': "GET,HEAD,PUT,PATCH,POST,DELETE",
    'preflightContinue': false,
    'optionsSuccessStatus': 204,
    'credentials': true
  }

  app.enableCors(corsOptions);

  app.use(helmet());

  app.useLogger(app.get(Logger));

  app.useGlobalInterceptors(new AppInterceptor());
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    ['/api', '/api-json'],
    basicAuth({
        challenge: true,
        users: {
            [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS,
        },
    }),
  );

  if(process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Quiz Games Documentation')
      .setDescription('Quiz Games Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
