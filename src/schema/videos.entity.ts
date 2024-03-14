import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Subjects } from './subjects.entity';

const moment = require('moment');

@Entity()
export class Videos {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  file_url: string;

  @Column()
  subject_id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Subjects, subject => subject.videos, { eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subjects;
}