import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction } from '../../entities/transaction.entity';
import { Loan } from '../../entities/loan.entity';
import { KYCDocument } from '../../entities/kyc-document.entity';
import { UserRole, LoanStatus, DocumentStatus } from '@fintomonie/shared';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(KYCDocument)
    private kycDocumentRepository: Repository<KYCDocument>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userRepository.count();
    const totalWallets = await this.walletRepository.count();
    const totalTransactions = await this.transactionRepository.count();
    const pendingLoans = await this.loanRepository.count({ where: { status: LoanStatus.PENDING } });

    const totalWalletBalance = await this.walletRepository
      .createQueryBuilder('wallet')
      .select('SUM(wallet.balance)', 'total')
      .getRawOne();

    const totalTransactionVolume = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.status = :status', { status: 'success' })
      .getRawOne();

    return {
      totalUsers,
      totalWallets,
      totalTransactions,
      pendingLoans,
      totalWalletBalance: totalWalletBalance.total || 0,
      totalTransactionVolume: totalTransactionVolume.total || 0,
    };
  }

  async getAllUsers(page: number = 1, limit: number = 50) {
    const [users, total] = await this.userRepository.findAndCount({
      relations: ['wallet'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        kycStatus: user.kycStatus,
        isActive: user.isActive,
        walletBalance: user.wallet?.balance || 0,
        createdAt: user.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    };
  }

  async blockUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(userId, { isActive: false });

    return {
      success: true,
      message: 'User blocked successfully',
    };
  }

  async unblockUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(userId, { isActive: true });

    return {
      success: true,
      message: 'User unblocked successfully',
    };
  }

  async getAllTransactions(page: number = 1, limit: number = 50) {
    const [transactions, total] = await this.transactionRepository.findAndCount({
      relations: ['fromWallet', 'toWallet'],
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

  async approveLoan(loanId: string) {
    const loan = await this.loanRepository.findOne({ where: { id: loanId } });
    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    await this.loanRepository.update(loanId, {
      status: LoanStatus.APPROVED,
      approvedAt: new Date(),
    });

    return {
      success: true,
      message: 'Loan approved successfully',
    };
  }

  async rejectLoan(loanId: string, reason: string) {
    const loan = await this.loanRepository.findOne({ where: { id: loanId } });
    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    await this.loanRepository.update(loanId, {
      status: LoanStatus.REJECTED,
    });

    return {
      success: true,
      message: 'Loan rejected successfully',
    };
  }

  async getKYCDocuments(page: number = 1, limit: number = 50) {
    const [documents, total] = await this.kycDocumentRepository.findAndCount({
      relations: ['user'],
      where: { status: DocumentStatus.PENDING },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      documents: documents.map(doc => ({
        id: doc.id,
        type: doc.type,
        status: doc.status,
        url: doc.url,
        user: {
          id: doc.user.id,
          firstName: doc.user.firstName,
          lastName: doc.user.lastName,
          email: doc.user.email,
        },
        createdAt: doc.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    };
  }

  async approveKYCDocument(documentId: string) {
    const document = await this.kycDocumentRepository.findOne({ where: { id: documentId } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.kycDocumentRepository.update(documentId, {
      status: DocumentStatus.APPROVED,
      verifiedAt: new Date(),
    });

    return {
      success: true,
      message: 'Document approved successfully',
    };
  }

  async rejectKYCDocument(documentId: string, reason: string) {
    const document = await this.kycDocumentRepository.findOne({ where: { id: documentId } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.kycDocumentRepository.update(documentId, {
      status: DocumentStatus.REJECTED,
      rejectionReason: reason,
    });

    return {
      success: true,
      message: 'Document rejected successfully',
    };
  }
}