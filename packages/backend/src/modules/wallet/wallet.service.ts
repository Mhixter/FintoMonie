import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionType, TransactionStatus } from '@fintomonie/shared';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async getWalletBalance(userId: string) {
    const wallet = await this.walletRepository.findOne({
      where: { userId, isActive: true }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      balance: wallet.balance,
      currency: wallet.currency,
      accountNumber: wallet.accountNumber,
    };
  }

  async deposit(userId: string, depositDto: DepositDto) {
    const { amount, description, reference } = depositDto;

    const wallet = await this.walletRepository.findOne({
      where: { userId, isActive: true }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Create transaction using query runner for atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create credit transaction
      const transaction = this.transactionRepository.create({
        reference: reference || this.generateReference(),
        amount,
        currency: wallet.currency,
        type: TransactionType.CREDIT,
        status: TransactionStatus.SUCCESS,
        description,
        toWalletId: wallet.id,
        processedAt: new Date(),
      });

      await queryRunner.manager.save(transaction);

      // Update wallet balance
      await queryRunner.manager.update(Wallet, wallet.id, {
        balance: Number(wallet.balance) + Number(amount)
      });

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Deposit successful',
        transaction: {
          id: transaction.id,
          reference: transaction.reference,
          amount: transaction.amount,
          type: transaction.type,
          status: transaction.status,
          description: transaction.description,
        },
        newBalance: Number(wallet.balance) + Number(amount),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Deposit failed');
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto) {
    const { amount, description, reference } = withdrawDto;

    const wallet = await this.walletRepository.findOne({
      where: { userId, isActive: true }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.balance) < Number(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create transaction using query runner for atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create debit transaction
      const transaction = this.transactionRepository.create({
        reference: reference || this.generateReference(),
        amount,
        currency: wallet.currency,
        type: TransactionType.DEBIT,
        status: TransactionStatus.SUCCESS,
        description,
        fromWalletId: wallet.id,
        processedAt: new Date(),
      });

      await queryRunner.manager.save(transaction);

      // Update wallet balance
      await queryRunner.manager.update(Wallet, wallet.id, {
        balance: Number(wallet.balance) - Number(amount)
      });

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Withdrawal successful',
        transaction: {
          id: transaction.id,
          reference: transaction.reference,
          amount: transaction.amount,
          type: transaction.type,
          status: transaction.status,
          description: transaction.description,
        },
        newBalance: Number(wallet.balance) - Number(amount),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Withdrawal failed');
    } finally {
      await queryRunner.release();
    }
  }

  async transfer(userId: string, transferDto: TransferDto) {
    const { amount, recipientAccountNumber, description, reference } = transferDto;

    const senderWallet = await this.walletRepository.findOne({
      where: { userId, isActive: true }
    });

    if (!senderWallet) {
      throw new NotFoundException('Sender wallet not found');
    }

    const recipientWallet = await this.walletRepository.findOne({
      where: { accountNumber: recipientAccountNumber, isActive: true }
    });

    if (!recipientWallet) {
      throw new NotFoundException('Recipient wallet not found');
    }

    if (Number(senderWallet.balance) < Number(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create transaction using query runner for atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const txReference = reference || this.generateReference();

      // Create transfer transaction
      const transaction = this.transactionRepository.create({
        reference: txReference,
        amount,
        currency: senderWallet.currency,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.SUCCESS,
        description,
        fromWalletId: senderWallet.id,
        toWalletId: recipientWallet.id,
        processedAt: new Date(),
      });

      await queryRunner.manager.save(transaction);

      // Update sender wallet balance
      await queryRunner.manager.update(Wallet, senderWallet.id, {
        balance: Number(senderWallet.balance) - Number(amount)
      });

      // Update recipient wallet balance
      await queryRunner.manager.update(Wallet, recipientWallet.id, {
        balance: Number(recipientWallet.balance) + Number(amount)
      });

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Transfer successful',
        transaction: {
          id: transaction.id,
          reference: transaction.reference,
          amount: transaction.amount,
          type: transaction.type,
          status: transaction.status,
          description: transaction.description,
        },
        newBalance: Number(senderWallet.balance) - Number(amount),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Transfer failed');
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactions(userId: string, page: number = 1, limit: number = 50) {
    const wallet = await this.walletRepository.findOne({
      where: { userId, isActive: true }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: [
        { fromWalletId: wallet.id },
        { toWalletId: wallet.id }
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    };
  }

  private generateReference(): string {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}