import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../../entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction } from '../../entities/transaction.entity';
import { Loan } from '../../entities/loan.entity';
import { KYCDocument } from '../../entities/kyc-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Transaction, Loan, KYCDocument])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}