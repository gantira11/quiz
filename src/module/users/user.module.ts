import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/schema/users.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy, LocalStrategy } from 'src/utils/strategy';
import { RoleService } from '../roles/role.service';
import { Roles } from 'src/schema/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles]),
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.EXP_IN },
		}),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    RoleService,
    LocalStrategy,
    JwtStrategy
  ],
})
export class UserModule {}