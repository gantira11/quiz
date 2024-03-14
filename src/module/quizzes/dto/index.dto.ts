import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
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

export class UpdateVideosDTO {
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

class Options {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  is_correct: boolean;
}

class Quetions {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  name: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  discuss: string;

  @ApiProperty({type: [Options]})
  @Type(() => Options)
  @IsNotEmpty()
  @ValidateNested({each: true})
  options: Options[];
}

export class CreateQuizzesDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  subject_id: string;

  @ApiProperty({type: [Quetions]})
  @Type(() => Quetions)
  @IsNotEmpty()
  @ValidateNested({each: true})
  quetions: Quetions[];
}

export class UpdateQuizzesDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateQuetionDTO {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  discuss: string;
}

export class UpdateOptionDTO {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  is_correct: boolean;
}

class Answer {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  quetion_id: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  option_id: string;
}

export class CreateAnswerDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  quiz_id: string;

  @ApiProperty({type: [Answer]})
  @Type(() => Answer)
  @IsNotEmpty()
  @ValidateNested({each: true})
  quetions: Answer[];
}