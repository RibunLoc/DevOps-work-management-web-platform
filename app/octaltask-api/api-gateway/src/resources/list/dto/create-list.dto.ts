import { IsNotEmpty, IsString, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ListColor, ListType } from '../../../entities/list.entity';

export class CreateListDto {
    @ApiProperty({
        description: 'name of the List',
        example: 'Complete project documentation',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Detailed type of the list',
        example: 'personal',
        required: false
    })
    @IsString()
    @IsOptional()
    icon: ListType;

    @ApiProperty({
        description: 'Color:',
        example: 'red',
        required: false
    })
    @IsString()
    @IsOptional()
    color: ListColor;

    @ApiProperty({
        description: 'Due date for the task (ISO string format)',
        example: '2025-05-20T12:00:00Z',
        required: false
    })
    @IsOptional()
    @IsString()
    dueDate?: string;
}