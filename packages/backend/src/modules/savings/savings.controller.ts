import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SavingsService } from './savings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Savings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post('goals')
  @ApiOperation({ summary: 'Create savings goal' })
  async createGoal(@Request() req, @Body() body: any) {
    return this.savingsService.createGoal(req.user.userId, body);
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get savings goals' })
  async getGoals(@Request() req) {
    return this.savingsService.getGoals(req.user.userId);
  }

  @Post('goals/:id/fund')
  @ApiOperation({ summary: 'Fund savings goal' })
  async fundGoal(@Request() req, @Param('id') goalId: string, @Body() body: any) {
    return this.savingsService.fundGoal(req.user.userId, goalId, body.amount);
  }
}