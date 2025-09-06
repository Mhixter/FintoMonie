import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('savings_goals')
export class SavingsGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'target_amount' })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0, name: 'current_amount' })
  currentAmount: number;

  @Column()
  deadline: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'auto_save_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  autoSaveAmount?: number;

  @Column({ name: 'auto_save_frequency', nullable: true })
  autoSaveFrequency?: string; // daily, weekly, monthly

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.savingsGoals)
  @JoinColumn({ name: 'user_id' })
  user: User;
}