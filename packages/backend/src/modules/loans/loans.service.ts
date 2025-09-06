import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../../entities/loan.entity';
import { User } from '../../entities/user.entity';
import { LoanStatus } from '@fintomonie/shared';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async applyForLoan(userId: string, loanData: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate monthly repayment and total repayment
    const { amount, interestRate, duration } = loanData;
    const monthlyInterestRate = interestRate / 12;
    const monthlyRepayment = 
      (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, duration)) /
      (Math.pow(1 + monthlyInterestRate, duration) - 1);
    
    const totalRepayment = monthlyRepayment * duration;

    const loan = this.loanRepository.create({
      userId,
      amount,
      interestRate,
      duration,
      purposeOfLoan: loanData.purposeOfLoan,
      monthlyRepayment,
      totalRepayment,
      status: LoanStatus.PENDING,
    });

    await this.loanRepository.save(loan);

    return {
      success: true,
      message: 'Loan application submitted successfully',
      loan: {
        id: loan.id,
        amount: loan.amount,
        interestRate: loan.interestRate,
        duration: loan.duration,
        monthlyRepayment: loan.monthlyRepayment,
        totalRepayment: loan.totalRepayment,
        status: loan.status,
      },
    };
  }

  async getMyLoans(userId: string) {
    const loans = await this.loanRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        amount: true,
        interestRate: true,
        duration: true,
        status: true,
        monthlyRepayment: true,
        totalRepayment: true,
        amountRepaid: true,
        createdAt: true,
        approvedAt: true,
        disbursedAt: true,
      }
    });

    return loans;
  }

  async repayLoan(userId: string, loanId: string, amount: number) {
    const loan = await this.loanRepository.findOne({
      where: { id: loanId, userId }
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    const newAmountRepaid = Number(loan.amountRepaid) + amount;
    
    let newStatus = loan.status;
    if (newAmountRepaid >= Number(loan.totalRepayment)) {
      newStatus = LoanStatus.REPAID;
    }

    await this.loanRepository.update(loanId, {
      amountRepaid: newAmountRepaid,
      status: newStatus,
    });

    return {
      success: true,
      message: 'Loan repayment successful',
      amountRepaid: newAmountRepaid,
      remainingBalance: Math.max(0, Number(loan.totalRepayment) - newAmountRepaid),
      status: newStatus,
    };
  }
}