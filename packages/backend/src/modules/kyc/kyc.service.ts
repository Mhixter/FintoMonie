import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KYCDocument } from '../../entities/kyc-document.entity';
import { User } from '../../entities/user.entity';
import { DocumentType, DocumentStatus, KYCStatus } from '@fintomonie/shared';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(KYCDocument)
    private kycDocumentRepository: Repository<KYCDocument>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async uploadDocument(userId: string, type: DocumentType, url: string) {
    const document = this.kycDocumentRepository.create({
      userId,
      type,
      url,
      status: DocumentStatus.PENDING,
    });

    await this.kycDocumentRepository.save(document);

    return {
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        type: document.type,
        status: document.status,
        createdAt: document.createdAt,
      },
    };
  }

  async getDocuments(userId: string) {
    const documents = await this.kycDocumentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        type: true,
        status: true,
        verifiedAt: true,
        rejectionReason: true,
        createdAt: true,
      }
    });

    return documents;
  }

  async verifyBVN(userId: string, bvn: string) {
    // BVN verification logic would go here
    // This would integrate with NIBSS or other verification services
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user BVN
    await this.userRepository.update(userId, { bvn });

    return {
      success: true,
      message: 'BVN verification successful (placeholder)',
      data: {
        bvn,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: user.phoneNumber,
      }
    };
  }

  async verifyNIN(userId: string, nin: string) {
    // NIN verification logic would go here
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user NIN
    await this.userRepository.update(userId, { nin });

    return {
      success: true,
      message: 'NIN verification successful (placeholder)',
      data: {
        nin,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
      }
    };
  }
}