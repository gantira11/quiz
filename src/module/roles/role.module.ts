import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/schema/roles.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Roles
    ]),
  ],
  controllers: [
    RoleController
  ],
  providers: [
    RoleService
  ],
})
export class RoleModule { }