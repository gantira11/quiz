import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class Videos {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  file_url: string;
}

export class CreateSubjectDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({type: [Videos]})
  @Type(() => Videos)
  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  videos: Videos[]
}

export class ParamsId {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateSubjectDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsOptional()
  content: string;
}

export class UpdateVideosPayload {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsOptional()
  file_url: string;
}