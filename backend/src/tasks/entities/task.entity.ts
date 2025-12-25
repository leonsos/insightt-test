import { ApiProperty } from '@nestjs/swagger';

export class TaskEntity {
  @ApiProperty({
    description: 'ID único de la tarea',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Estudiar NestJS'
  })
  title: string;

  @ApiProperty({
    description: 'Descripción de la tarea',
    example: 'Aprender sobre controladores y servicios en NestJS',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Estado de la tarea (completada o no)',
    example: false
  })
  done: boolean;

  @ApiProperty({
    description: 'ID del usuario propietario de la tarea',
    example: 123
  })
  userId: number;

  @ApiProperty({
    description: 'Fecha de creación de la tarea',
    example: '2025-12-25T22:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la tarea',
    example: '2025-12-25T22:30:00.000Z'
  })
  updatedAt: Date;
}