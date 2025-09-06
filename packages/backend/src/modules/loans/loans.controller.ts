import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Loans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Apply for loan' })
  async applyForLoan(@Request() req, @Body() body: any) {
    return this.loansService.applyForLoan(req.user.userId, body);
  }

  @Get('my-loans')
  @ApiOperation({ summary: 'Get my loans' })
  async getMyLoans(@Request() req) {
    return this.loansService.getMyLoans(req.user.userId);
  }

  @Post(':id/repay')
  @ApiOperation({ summary: 'Repay loan' })
  async repayLoan(@Request() req, @Param('id') loanId: string, @Body() body: any) {
    return this.loansService.repayLoan(req.user.userId, loanId, body.amount);
  }
}