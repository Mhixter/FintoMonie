import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { KYCDocument } from '../../entities/kyc-document.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KYCDocument, User])],
  providers: [KycService],
  controllers: [KycController],
})
export class KycModule {}