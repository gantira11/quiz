import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Quizzes } from './quizzes.entity';
import { Options } from './options.entity';

const moment = require('moment');

@Entity()
export class Quetions {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  discuss: string;

  @Column()
  quiz_id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Quizzes, quiz => quiz.quetions, { eager: true })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quizzes;

  @OneToMany(() => Options, option => option.quetion)
  options: Options[];
}