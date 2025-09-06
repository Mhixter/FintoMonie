import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { SavingsGoal } from '../../entities/savings-goal.entity';
import { Wallet } from '../../entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsGoal, Wallet])],
  providers: [SavingsService],
  controllers: [SavingsController],
})
export class SavingsModule {}