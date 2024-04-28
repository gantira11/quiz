import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationParams } from 'src/utils/dto/pagination-dto';

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

class OptionsUpdate {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  @IsString()
  id: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsOptional()
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

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  weight: number;

  @ApiProperty({type: [Options]})
  @Type(() => Options)
  @IsNotEmpty()
  @ValidateNested({each: true})
  options: Options[];
}

class QuetionsUpdate {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  @IsString()
  id: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  @IsString()
  discuss: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  weight: number;

  @ApiPropertyOptional({type: [OptionsUpdate]})
  @Type(() => OptionsUpdate)
  @IsNotEmpty()
  @ValidateNested({each: true})
  options: OptionsUpdate[];
}

enum Category {
  pra = "Pra Test",
  evaluation = "Evaluasi"
}

export class CreateQuizzesDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  subject_id: string;

  @ApiProperty()
  @Type(() => String)
  @IsEnum(Category)
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({type: [Quetions]})
  @Type(() => Quetions)
  @IsNotEmpty()
  @ValidateNested({each: true})
  quetions: Quetions[];
}

export class UpdateQuizzesDTO {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  duration: number;

  @ApiProperty()
  @Type(() => String)
  @IsEnum(Category)
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({type: [QuetionsUpdate]})
  @Type(() => QuetionsUpdate)
  @IsNotEmpty()
  @IsOptional({each: true})
  quetions: QuetionsUpdate[];
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

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  weight: number;

  @ApiProperty({type: [Options]})
  @Type(() => Options)
  @IsNotEmpty()
  @ValidateNested({each: true})
  options: Options[];
}

export class UpdateSubjectDTO {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  content: string;

  @ApiPropertyOptional({type: [Videos]})
  @Type(() => Videos)
  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  videos: Videos[]

  @ApiPropertyOptional({type: [UpdateQuizzesDTO]})
  @Type(() => UpdateQuizzesDTO)
  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  quizzes: UpdateQuizzesDTO[]
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

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
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

export class SubjectId {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  subject_id: string;
}

export class QuizListParam extends PaginationParams {
  @ApiPropertyOptional({ enum: ['Pra Test', 'Evaluasi'] })
  @IsOptional()
  @Type(() => String)
  @IsString()
  category: Category;
}

export class CreateObjectivesDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class UpdateObjectivesDTO {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  body: string;
}