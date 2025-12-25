import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Estudiar NestJS',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripción opcional de la tarea',
    example: 'Aprender sobre controladores y servicios en NestJS',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Estado de la tarea (completada o no)',
    example: false,
    default: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  done?: boolean = false;
}