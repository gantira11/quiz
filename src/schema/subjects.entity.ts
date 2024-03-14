import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Videos } from './videos.entity';
import { Quizzes } from './quizzes.entity';

const moment = require('moment');

@Entity()
export class Subjects {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @OneToMany(() => Videos, video => video.subject)
  videos: Videos[];
  
  @OneToMany(() => Quizzes, quiz => quiz.subject)
  quizzes: Quizzes[];
}