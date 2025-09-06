import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LoanStatus } from '@fintomonie/shared';
import { User } from './user.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, name: 'interest_rate' })
  interestRate: number;

  @Column()
  duration: number; // in months

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.PENDING
  })
  status: LoanStatus;

  @Column({ name: 'purpose_of_loan' })
  purposeOfLoan: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'monthly_repayment' })
  monthlyRepayment: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'total_repayment' })
  totalRepayment: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0, name: 'amount_repaid' })
  amountRepaid: number;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt?: Date;

  @Column({ name: 'disbursed_at', nullable: true })
  disbursedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.loans)
  @JoinColumn({ name: 'user_id' })
  user: User;
}