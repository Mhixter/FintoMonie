import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { KYCStatus, UserRole } from '@fintomonie/shared';
import { Wallet } from './wallet.entity';
import { SavingsGoal } from './savings-goal.entity';
import { Loan } from './loan.entity';
import { KYCDocument } from './kyc-document.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ name: 'date_of_birth', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  bvn?: string;

  @Column({ nullable: true })
  nin?: string;

  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.PENDING,
    name: 'kyc_status'
  })
  kycStatus: KYCStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @Column({ name: 'two_fa_enabled', default: false })
  twoFaEnabled: boolean;

  @Column({ name: 'last_login', nullable: true })
  lastLogin?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Wallet, wallet => wallet.user)
  wallet: Wallet;

  @OneToMany(() => SavingsGoal, goal => goal.user)
  savingsGoals: SavingsGoal[];

  @OneToMany(() => Loan, loan => loan.user)
  loans: Loan[];

  @OneToMany(() => KYCDocument, document => document.user)
  kycDocuments: KYCDocument[];
}