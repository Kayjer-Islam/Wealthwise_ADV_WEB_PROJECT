import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailerService {
  private readonly logger = new Logger("MailerService");
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get("MAIL_HOST"),
      port: parseInt(this.config.get("MAIL_PORT") ?? "587", 10),
      auth: {
        user: this.config.get("MAIL_USER"),
        pass: this.config.get("MAIL_PASS"),
      },
    });
  }

  async sendWelcomeEmail(user: { name: string; email: string }) {
    try {
      await this.transporter.sendMail({
        from: this.config.get("MAIL_FROM"),
        to: user.email,
        subject: "Welcome to WealthWise!",
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2 style="color: #4CAF50;">Welcome to WealthWise, ${user.name}!</h2><p>Your account has been created successfully.</p><p>You can now start tracking your expenses and budgets.</p><br/><p>Best regards,</p><p><strong>WealthWise Team</strong></p></div>`,
      });
      this.logger.log("Welcome email sent to " + user.email);
    } catch (error) {
      this.logger.error("Failed to send welcome email: " + error.message);
    }
  }

  async sendBudgetAlert(
    user: { name: string; email: string },
    category: string,
    limit: number,
    spent: number,
  ) {
    try {
      await this.transporter.sendMail({
        from: this.config.get("MAIL_FROM"),
        to: user.email,
        subject: "WealthWise Budget Alert!",
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2 style="color: #f44336;">Budget Alert!</h2><p>Hi ${user.name},</p><p>You have exceeded your budget for <strong>${category}</strong>.</p><ul><li>Budget Limit: <strong>${limit.toFixed(2)}</strong></li><li>Total Spent: <strong>${spent.toFixed(2)}</strong></li><li>Exceeded by: <strong>${(spent - limit).toFixed(2)}</strong></li></ul><p>Please review your expenses.</p><br/><p>Best regards,</p><p><strong>WealthWise Team</strong></p></div>`,
      });
      this.logger.log("Budget alert sent to " + user.email);
    } catch (error) {
      this.logger.error("Failed to send budget alert: " + error.message);
    }
  }
}
