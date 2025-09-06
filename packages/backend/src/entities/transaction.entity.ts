import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionType, TransactionStatus } from '@fintomonie/shared';
import { Wallet } from './wallet.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reference: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ default: 'NGN' })
  currency: string;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING
  })
  status: TransactionStatus;

  @Column()
  description: string;

  @Column({ name: 'from_wallet_id', nullable: true })
  fromWalletId?: string;

  @Column({ name: 'to_wallet_id', nullable: true })
  toWalletId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: 'processed_at', nullable: true })
  processedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Wallet, wallet => wallet.outgoingTransactions)
  @JoinColumn({ name: 'from_wallet_id' })
  fromWallet?: Wallet;

  @ManyToOne(() => Wallet, wallet => wallet.incomingTransactions)
  @JoinColumn({ name: 'to_wallet_id' })
  toWallet?: Wallet;
}