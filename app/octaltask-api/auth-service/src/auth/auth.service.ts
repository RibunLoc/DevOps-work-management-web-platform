import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';
import { MailerService } from 'src/mailer/mailer.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {

  [x: string]: any;
  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailerService: MailerService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: SignupDto) {
    const { email, password, name } = signupDto;
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashed, name });
    const savedUser = await this.userRepo.save(user);

    const { password: _, resetToken, resetTokenExpires, ...safeUser } = savedUser;
    return safeUser;
  }

  async requestPasswordReset(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const token = uuidv4();
    const expiration = addMinutes(new Date(), 15); // hết hạn sau 15 phút

    user.resetToken = token;
    user.resetTokenExpires = expiration;
    await this.userRepo.save(user);

    await this.mailerService.sendResetPasswordEmail(email, token);

    return { message: 'Reset email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const user = await this.userRepo.findOne({ where: { resetToken: token } });
    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = "";
    user.resetTokenExpires = null;

    await this.userRepo.save(user);
    return { message: 'Password successfully reset' };
  }

  async getUserById(userId: number) {
    try {
      // Find the user in the database by ID
      const user = await this.userRepo.findOne({ where: { id: userId } });
      
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Return user without sensitive information
      const { password, resetToken, resetTokenExpires, ...safeUser } = user;
      return safeUser;
      
    } catch (error) {
      // Rethrow the error (like NotFoundException)
      throw error;
    }
  }
}