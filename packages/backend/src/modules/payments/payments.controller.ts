import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize payment' })
  async initializePayment(@Request() req, @Body() body: any) {
    return this.paymentsService.initializePayment(req.user.userId, body.amount, req.user.email);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify payment' })
  async verifyPayment(@Body() body: any) {
    return this.paymentsService.verifyPayment(body.reference);
  }

  @Post('bills')
  @ApiOperation({ summary: 'Pay bills' })
  async payBill(@Request() req, @Body() body: any) {
    return this.paymentsService.payBill(
      req.user.userId,
      body.billType,
      body.amount,
      body.accountNumber
    );
  }
}