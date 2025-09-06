import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('email')
  @ApiOperation({ summary: 'Send email notification' })
  async sendEmail(@Body() body: any) {
    return this.notificationsService.sendEmail(body.to, body.subject, body.body);
  }

  @Post('sms')
  @ApiOperation({ summary: 'Send SMS notification' })
  async sendSMS(@Body() body: any) {
    return this.notificationsService.sendSMS(body.phoneNumber, body.message);
  }

  @Post('push')
  @ApiOperation({ summary: 'Send push notification' })
  async sendPushNotification(@Body() body: any) {
    return this.notificationsService.sendPushNotification(body.userId, body.title, body.body);
  }
}