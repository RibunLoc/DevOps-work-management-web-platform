import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;
}

export class SignupResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({ example: 'Password successfully reset', description: 'Success message' })
  message: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({ example: 'Reset email sent', description: 'Success message' })
  message: string;
}

export class AuthUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'user', description: 'User role', required: false })
  role?: string;
}

export class AuthErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'Error message' })
  message: string;

  @ApiProperty({ example: 'Validation failed', description: 'Error details', required: false })
  error?: string;
}