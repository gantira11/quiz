import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Roles } from './roles.entity';
import { Answers } from './answers.entity';

const moment = require('moment');

@Entity()
export class Users {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role_id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Roles, (role) => role.users, {eager: true})
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @OneToMany(() => Answers, answer => answer.user)
  answers: Answers[]
}