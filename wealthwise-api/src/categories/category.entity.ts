import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isPersonal: boolean;

  @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL', nullable: true })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
