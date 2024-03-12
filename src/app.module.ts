import 'dotenv/config'
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { config } from './config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './module/roles/role.module';
import { UserModule } from './module/users/user.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: (process.env?.APP_DEBUG||'') === 'true'
    }),
    RoleModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
