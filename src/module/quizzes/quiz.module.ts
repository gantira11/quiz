import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subjects } from 'src/schema/subjects.entity';
import { Videos } from 'src/schema/videos.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subjects,
      Videos
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}