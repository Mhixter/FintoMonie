import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {}

  async sendEmail(to: string, subject: string, body: string) {
    await this.notificationQueue.add('send-email', {
      to,
      subject,
      body,
    });

    return {
      success: true,
      message: 'Email queued for sending',
    };
  }

  async sendSMS(phoneNumber: string, message: string) {
    await this.notificationQueue.add('send-sms', {
      phoneNumber,
      message,
    });

    return {
      success: true,
      message: 'SMS queued for sending',
    };
  }

  async sendPushNotification(userId: string, title: string, body: string) {
    await this.notificationQueue.add('send-push', {
      userId,
      title,
      body,
    });

    return {
      success: true,
      message: 'Push notification queued for sending',
    };
  }
}