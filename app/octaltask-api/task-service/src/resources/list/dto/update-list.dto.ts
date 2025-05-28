import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ListColor, ListType } from '../../../entities/list.entity';

export class UpdateListDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    icon?:ListType;

    @IsString()
    @IsOptional()
    color?: ListColor;

    @IsOptional()
    @IsString()
    dueDate?: string;
}