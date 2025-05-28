import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;

    @IsOptional()
    @IsString()
    dueDate?: string;
}