import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('KYC')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload KYC document' })
  async uploadDocument(@Request() req, @Body() body: any) {
    return this.kycService.uploadDocument(req.user.userId, body.type, body.url);
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get KYC documents' })
  async getDocuments(@Request() req) {
    return this.kycService.getDocuments(req.user.userId);
  }

  @Post('verify-bvn')
  @ApiOperation({ summary: 'Verify BVN' })
  async verifyBVN(@Request() req, @Body() body: any) {
    return this.kycService.verifyBVN(req.user.userId, body.bvn);
  }

  @Post('verify-nin')
  @ApiOperation({ summary: 'Verify NIN' })
  async verifyNIN(@Request() req, @Body() body: any) {
    return this.kycService.verifyNIN(req.user.userId, body.nin);
  }
}