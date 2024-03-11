import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GetDetailDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;
}