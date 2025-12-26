import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { TaskEntity } from './entities/task.entity';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
    [key: string]: any;
  };
}

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(FirebaseAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea (registro automático de usuario)' })
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      example1: {
        summary: 'Crear tarea básica',
        description: 'Ejemplo de creación de una tarea con solo el título',
        value: {
          title: 'Estudiar NestJS',
          description: 'Aprender sobre controladores y servicios',
          done: false
        }
      },
      example2: {
        summary: 'Crear tarea sin descripción',
        description: 'Ejemplo de creación de una tarea solo con título',
        value: {
          title: 'Hacer ejercicio',
          done: false
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Tarea creada exitosamente (usuario registrado automáticamente)',
    type: TaskEntity
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta - Validación fallida'
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o ausente'
  })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AuthenticatedRequest
  ): Promise<TaskEntity> {
    return this.tasksService.create(createTaskDto, req.user.uid, req.user.email);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas obtenida exitosamente',
    type: [TaskEntity]
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o ausente'
  })
  async findAll(@Request() req: AuthenticatedRequest): Promise<TaskEntity[]> {
    return this.tasksService.findAll(req.user.uid, req.user.email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea específica por ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la tarea a buscar',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea encontrada exitosamente',
    type: TaskEntity
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o ausente'
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada'
  })
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest): Promise<TaskEntity> {
    const task = await this.tasksService.findOne(+id, req.user.uid, req.user.email);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea existente' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la tarea a actualizar',
    example: 1
  })
  @ApiBody({
    type: UpdateTaskDto,
    examples: {
      example1: {
        summary: 'Actualizar descripción',
        description: 'Ejemplo de actualización de la descripción de una tarea',
        value: {
          description: 'Nueva descripción actualizada'
        }
      },
      example2: {
        summary: 'Marcar como completada',
        description: 'Ejemplo de marcar una tarea como completada',
        value: {
          done: true
        }
      },
      example3: {
        summary: 'Actualizar título y descripción',
        description: 'Ejemplo de actualización de título y descripción',
        value: {
          title: 'Nuevo título',
          description: 'Nueva descripción'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea actualizada exitosamente',
    type: TaskEntity
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta - Validación fallida'
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o ausente'
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada'
  })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthenticatedRequest
  ): Promise<TaskEntity> {
    return this.tasksService.update(+id, updateTaskDto, req.user.uid, req.user.email);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la tarea a eliminar',
    example: 1
  })
  @ApiResponse({
    status: 204,
    description: 'Tarea eliminada exitosamente'
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o ausente'
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada'
  })
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest): Promise<void> {
    await this.tasksService.remove(+id, req.user.uid, req.user.email);
  }

  @Patch(':id/done')
  @ApiOperation({ summary: 'Marcar una tarea como completada' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la tarea a marcar como completada',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea marcada como completada exitosamente',
    type: TaskEntity
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o ausente'
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada'
  })
  async markAsDone(@Param('id') id: string, @Request() req: AuthenticatedRequest): Promise<TaskEntity> {
    return this.tasksService.markAsDone(+id, req.user.uid, req.user.email);
  }
}