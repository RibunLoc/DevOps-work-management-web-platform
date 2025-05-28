import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({
        description: 'Title of the task',
        example: 'Complete project documentation',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Detailed description of the task',
        example: 'Write comprehensive documentation for the microservice architecture',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Flag indicating if the task is completed',
        example: false,
        default: false,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;

    @ApiProperty({
        description: 'Due date for the task (ISO string format)',
        example: '2025-05-20T12:00:00Z',
        required: false
    })
    @IsOptional()
    @IsString()
    dueDate?: string;
}