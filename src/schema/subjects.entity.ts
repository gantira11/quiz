import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Videos } from './videos.entity';

const moment = require('moment');

@Entity()
export class Subjects {
  @PrimaryGeneratedColumn('uuid')
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

  @OneToMany(() => Videos, (video) => {video.subject_id})
  videos: Videos[];
}