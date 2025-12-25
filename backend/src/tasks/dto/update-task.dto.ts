import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'Título de la tarea (opcional)',
    example: 'Estudiar NestJS avanzado',
    required: false
  })
  title?: string;

  @ApiProperty({
    description: 'Descripción de la tarea (opcional)',
    example: 'Aprender sobre decoradores y módulos en NestJS',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Estado de la tarea (opcional)',
    example: true,
    required: false
  })
  done?: boolean;
}