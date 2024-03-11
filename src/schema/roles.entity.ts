import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm';

const moment = require('moment');

@Entity()
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: moment.utc() })
  created_at: Date;

  @Column({ default: moment.utc() })
  updated_at: Date;

  @Column({})
  deleted_at: Date;
}