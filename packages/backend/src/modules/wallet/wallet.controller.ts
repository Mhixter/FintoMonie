import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Wallet balance retrieved successfully' })
  async getBalance(@Request() req) {
    return this.walletService.getWalletBalance(req.user.userId);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit funds to wallet' })
  @ApiResponse({ status: 201, description: 'Deposit successful' })
  async deposit(@Request() req, @Body() depositDto: DepositDto) {
    return this.walletService.deposit(req.user.userId, depositDto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw funds from wallet' })
  @ApiResponse({ status: 201, description: 'Withdrawal successful' })
  async withdraw(@Request() req, @Body() withdrawDto: WithdrawDto) {
    return this.walletService.withdraw(req.user.userId, withdrawDto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer funds to another wallet' })
  @ApiResponse({ status: 201, description: 'Transfer successful' })
  async transfer(@Request() req, @Body() transferDto: TransferDto) {
    return this.walletService.transfer(req.user.userId, transferDto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  async getTransactions(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50
  ) {
    return this.walletService.getTransactions(req.user.userId, page, limit);
  }
}