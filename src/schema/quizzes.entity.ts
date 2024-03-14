import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Subjects } from './subjects.entity';
import { Quetions } from './quetions.entity';
import { Answers } from './answers.entity';

const moment = require('moment');

@Entity()
export class Quizzes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  subject_id: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Subjects, subject => subject.quizzes, { eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subjects;
  
  @OneToMany(() => Quetions, question => question.quiz)
  quetions: Quetions[];

  @OneToMany(() => Answers, answer => answer.quiz)
  answers: Answers[]
}