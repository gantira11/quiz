import { IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HeaderParamsDTO {
  @ApiProperty({ enum: ['web', 'mobile']})
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  platform: Platform;
}

enum Platform {
	web = "web",
	mobile = "mobile"
}