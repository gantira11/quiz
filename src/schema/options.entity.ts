import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Quetions } from './quetions.entity';

const moment = require('moment');

@Entity()
export class Options {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  is_correct: boolean;

  @Column()
  quetion_id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Quetions, quetion => quetion.options, { eager: true })
  @JoinColumn({ name: 'quetion_id' })
  quetion: Quetions;
}