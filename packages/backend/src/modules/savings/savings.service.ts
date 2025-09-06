import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsGoal } from '../../entities/savings-goal.entity';
import { Wallet } from '../../entities/wallet.entity';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(SavingsGoal)
    private savingsGoalRepository: Repository<SavingsGoal>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async createGoal(userId: string, goalData: any) {
    const goal = this.savingsGoalRepository.create({
      userId,
      ...goalData,
    });

    await this.savingsGoalRepository.save(goal);

    return {
      success: true,
      message: 'Savings goal created successfully',
      goal: {
        id: goal.id,
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
      },
    };
  }

  async getGoals(userId: string) {
    const goals = await this.savingsGoalRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });

    return goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline,
      progress: (goal.currentAmount / goal.targetAmount) * 100,
      createdAt: goal.createdAt,
    }));
  }

  async fundGoal(userId: string, goalId: string, amount: number) {
    const goal = await this.savingsGoalRepository.findOne({
      where: { id: goalId, userId, isActive: true }
    });

    if (!goal) {
      throw new NotFoundException('Savings goal not found');
    }

    const wallet = await this.walletRepository.findOne({
      where: { userId, isActive: true }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Update goal amount
    const newCurrentAmount = Number(goal.currentAmount) + amount;
    await this.savingsGoalRepository.update(goalId, {
      currentAmount: newCurrentAmount
    });

    // Update wallet balance
    await this.walletRepository.update(wallet.id, {
      balance: Number(wallet.balance) - amount
    });

    return {
      success: true,
      message: 'Goal funded successfully',
      newCurrentAmount,
      progress: (newCurrentAmount / Number(goal.targetAmount)) * 100,
    };
  }
}