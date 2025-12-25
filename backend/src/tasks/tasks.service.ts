import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../auth/firebase.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<TaskEntity> {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });

    return this.mapToEntity(task);
  }

  async findAll(userId: number): Promise<TaskEntity[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map(task => this.mapToEntity(task));
  }

  async findOne(id: number, userId: number): Promise<TaskEntity> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.mapToEntity(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<TaskEntity> {
    // Verificar que la tarea pertenece al usuario
    const existingTask = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    return this.mapToEntity(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    // Verificar que la tarea pertenece al usuario
    const existingTask = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.prisma.task.delete({
      where: { id },
    });
  }

  async markAsDone(id: number, userId: number): Promise<TaskEntity> {
    // Verificar que la tarea pertenece al usuario
    const existingTask = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Lógica para "Mark as Done" con Cloud Function
    // 1. Actualizar la tarea en la base de datos
    const task = await this.prisma.task.update({
      where: { id },
      data: { done: true },
    });

    // 2. Disparar evento para Cloud Function (simulación)
    // En una implementación real, aquí llamaríamos a Firebase Cloud Function
    await this.triggerCloudFunction(task);

    return this.mapToEntity(task);
  }

  private async triggerCloudFunction(task: any): Promise<void> {
    // Simulación de llamada a Cloud Function
    // En una implementación real, usaríamos Firebase Admin SDK o HTTP request
    console.log(`Cloud Function triggered for task ${task.id}: Marking as done`);
    
    // Aquí podrías:
    // - Llamar a una Cloud Function HTTP endpoint
    // - Publicar un mensaje en Pub/Sub
    // - Actualizar Firestore para que una Cloud Function lo detecte
    
    // Simulación de procesamiento en Cloud Function
    setTimeout(() => {
      console.log(`Cloud Function processed task ${task.id} successfully`);
    }, 100);
  }

  private mapToEntity(task: any): TaskEntity {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      done: task.done,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}