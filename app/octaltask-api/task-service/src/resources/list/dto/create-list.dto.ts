import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ListColor, ListType } from '../../../entities/list.entity';

export class CreateListDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    icon: ListType;

    @IsString()
    @IsOptional()
    color: ListColor;

    @IsOptional()
    @IsString()
    dueDate?: string;
}