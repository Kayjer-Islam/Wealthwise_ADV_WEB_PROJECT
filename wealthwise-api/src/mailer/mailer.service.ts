import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailerService {
  private readonly logger = new Logger('MailerService');

  async sendWelcomeEmail(user: { name: string; email: string }) {
    this.logger.log('==========================================================');
    this.logger.log('EMAIL SENT: Welcome Email');
    this.logger.log('TO: ' + user.email);
    this.logger.log('SUBJECT: Welcome to WealthWise!');
    this.logger.log('BODY: Hi ' + user.name + ', your account has been created successfully!');
    this.logger.log('==========================================================');
  }

  async sendBudgetAlert(
    user: { name: string; email: string },
    category: string,
    limit: number,
    spent: number,
  ) {
    this.logger.log('==========================================================');
    this.logger.log('EMAIL SENT: Budget Alert');
    this.logger.log('TO: ' + user.email);
    this.logger.log('SUBJECT: WealthWise Budget Alert!');
    this.logger.log('BODY: Hi ' + user.name + ', you exceeded your budget for ' + category);
    this.logger.log('Budget Limit: ' + limit.toFixed(2));
    this.logger.log('Total Spent: ' + spent.toFixed(2));
    this.logger.log('Exceeded by: ' + (spent - limit).toFixed(2));
    this.logger.log('==========================================================');
  }
}
