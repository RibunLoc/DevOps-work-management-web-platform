import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException, Inject, Logger } from '@nestjs/common';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';
import { MailerService } from 'src/mailer/mailer.service';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

// Interface for Task Service gRPC methods
interface TaskGrpcService {
  createDefaultUserSetup(data: {
    userId: number;
    email: string;
    name: string;
    role?: string;
  }): any;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private taskGrpcService: TaskGrpcService;

  [x: string]: any;
  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailerService: MailerService,
    @Inject('TASK_PACKAGE') private readonly taskClient: ClientGrpc // Add this injection
  ) { }

  // Initialize gRPC service connection
  onModuleInit() {
    this.taskGrpcService = this.taskClient.getService<TaskGrpcService>('TaskService');
  }

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
    const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };
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

    // Create default setup in task service after user creation
    try {
      await this.createDefaultTaskSetup(savedUser);
    } catch (error) {
      this.logger.warn(`Failed to create default task setup for user ${savedUser.id}: ${error.message}`);
      // Don't fail the signup if task setup fails, just log the warning
    }

    const { password: _, resetToken, resetTokenExpires, ...safeUser } = savedUser;
    return safeUser;
  }

  private async createDefaultTaskSetup(user: User) {
    try {
      const setupData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      };

      // Call task service to create default lists and tasks
      const result = await firstValueFrom(
        this.taskGrpcService.createDefaultUserSetup(setupData).pipe(
          timeout(10000) // 10 second timeout
        )
      );

      return result;
    } catch (error) {
      this.logger.error(`Failed to create default task setup for user ${user.id}:`, error);
      throw error;
    }
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