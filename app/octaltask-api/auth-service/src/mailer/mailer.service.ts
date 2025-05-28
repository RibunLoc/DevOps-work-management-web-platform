import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService, private readonly configService: ConfigService) { }

  async sendResetPasswordEmail(email: string, token) {
    const feBaseUrl = this.configService.get<string>('FRONTEND_BASE_URL');
    let resetLink = `${feBaseUrl}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OctalTask Password Reset',
      template: './reset-password',
      context: {
        email: email,
        resetLink: resetLink,
      },
    });
  }
}
