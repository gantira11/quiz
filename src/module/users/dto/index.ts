import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  role_id: string;
}

export class UpdateUserDTO {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  username: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  role_id: string;
}

export class LoginDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GetDetailUserDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;
}