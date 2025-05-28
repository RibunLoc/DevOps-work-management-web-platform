import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ListColor, ListType } from '../../../entities/list.entity';

export class UpdateListDto {
    @ApiProperty({
        description: 'Name of the list',
        example: 'Updated list documentation',
        required: false
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'List type of the list',
        example: 'personal',
        required: false
    })
    @IsString()
    @IsOptional()
    icon:ListType;

    @ApiProperty({
        description: 'List color:',
        example: 'red',
        required: false
    })
    @IsString()
    @IsOptional()
    color: ListColor;

    @ApiProperty({
        description: 'Due date for the task (ISO string format)',
        example: '2025-05-25T12:00:00Z',
        required: false
    })
    @IsOptional()
    @IsString()
    dueDate?: string;
}