import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

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

    @IsBoolean()
    @IsOptional()
    isStarted?: boolean;

    @IsOptional()
    @IsString()
    dueDate?: string;

    @IsOptional()
    @IsNumber()
    listId?: number;
}