import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Quizzes } from './quizzes.entity';
import { Users } from './users.entity';

const moment = require('moment');

@Entity()
export class Answers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quetions: string;

  @Column()
  point: number;

  @Column()
  quiz_id: string;

  @Column()
  user_id: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Quizzes, quiz => quiz.answers, { eager: true })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quizzes;

  @ManyToOne(() => Users, user => user.answers, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}