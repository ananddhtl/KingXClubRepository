import { createTransport } from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { EmailConfig } from '@/config';

@Injectable()
export class MailService {
  private appURL: string;
  private authUser: string;
  private authPassword: string;
  private from: string;

  constructor(private readonly configService = EmailConfig) {
    this.appURL = this.configService.appURL;
    this.from = this.configService.from;
    this.authUser = this.configService.authUser;
    this.authPassword = this.configService.authPassword;
  }

  async sendEmail(to: string, subject: string, text: string): Promise<any> {
    // Create the email envelope (transport)
    const transport = createTransport({
      service: 'gmail',
      auth: {
        user: this.authUser, // Your Gmail email address
        pass: this.authPassword, // Your Gmail password or app-specific password
      },
    });

    // Create the email options and body
    const mailOptions = {
      from: `Hello Fresh - Ecommerce API < ${this.from} >`,
      to,
      subject,
      text,
    };

    // Set up the email options and delivering it
    return await transport.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<any> {
    const subject = 'Reset Password';
    const resetPasswordURL = `${this.appURL}/reset-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${resetPasswordURL}
    If you did not request any password resets, then ignore this email.`;

    return await this.sendEmail(to, subject, text);
  }

  async sendAfterResetPasswordEmail(to: string): Promise<any> {
    const subject = 'Password Reset Successfully';
    const text = `Dear user,
    Your password has been reset successfully.`;

    return await this.sendEmail(to, subject, text);
  }
}
