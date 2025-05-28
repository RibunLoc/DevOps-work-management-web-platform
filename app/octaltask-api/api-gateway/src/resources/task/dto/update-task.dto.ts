import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
    @ApiProperty({
        description: 'Title of the task',
        example: 'Updated project documentation',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Detailed description of the task',
        example: 'Updated documentation with new architecture diagrams',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Flag indicating if the task is completed',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;

    @ApiProperty({
        description: 'Due date for the task (ISO string format)',
        example: '2025-05-25T12:00:00Z',
        required: false
    })
    @IsOptional()
    @IsString()
    dueDate?: string;
}