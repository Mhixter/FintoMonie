import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50
  ) {
    return this.adminService.getAllUsers(page, limit);
  }

  @Put('users/:id/block')
  @ApiOperation({ summary: 'Block user' })
  async blockUser(@Param('id') userId: string) {
    return this.adminService.blockUser(userId);
  }

  @Put('users/:id/unblock')
  @ApiOperation({ summary: 'Unblock user' })
  async unblockUser(@Param('id') userId: string) {
    return this.adminService.unblockUser(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  async getAllTransactions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50
  ) {
    return this.adminService.getAllTransactions(page, limit);
  }

  @Put('loans/:id/approve')
  @ApiOperation({ summary: 'Approve loan' })
  async approveLoan(@Param('id') loanId: string) {
    return this.adminService.approveLoan(loanId);
  }

  @Put('loans/:id/reject')
  @ApiOperation({ summary: 'Reject loan' })
  async rejectLoan(@Param('id') loanId: string, @Body() body: any) {
    return this.adminService.rejectLoan(loanId, body.reason);
  }

  @Get('kyc-documents')
  @ApiOperation({ summary: 'Get KYC documents for review' })
  async getKYCDocuments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50
  ) {
    return this.adminService.getKYCDocuments(page, limit);
  }

  @Put('kyc-documents/:id/approve')
  @ApiOperation({ summary: 'Approve KYC document' })
  async approveKYCDocument(@Param('id') documentId: string) {
    return this.adminService.approveKYCDocument(documentId);
  }

  @Put('kyc-documents/:id/reject')
  @ApiOperation({ summary: 'Reject KYC document' })
  async rejectKYCDocument(@Param('id') documentId: string, @Body() body: any) {
    return this.adminService.rejectKYCDocument(documentId, body.reason);
  }
}