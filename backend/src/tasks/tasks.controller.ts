import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { TaskEntity } from './entities/task.entity';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    [key: string]: any;
  };
}

@Controller('tasks')
@UseGuards(FirebaseAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AuthenticatedRequest
  ): Promise<TaskEntity> {
    return this.tasksService.create(createTaskDto, Number(req.user.uid));
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest): Promise<TaskEntity[]> {
    return this.tasksService.findAll(Number(req.user.uid));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest): Promise<TaskEntity> {
    const task = await this.tasksService.findOne(+id, Number(req.user.uid));
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthenticatedRequest
  ): Promise<TaskEntity> {
    return this.tasksService.update(+id, updateTaskDto, Number(req.user.uid));
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest): Promise<void> {
    await this.tasksService.remove(+id, Number(req.user.uid));
  }

  @Patch(':id/done')
  async markAsDone(@Param('id') id: string, @Request() req: AuthenticatedRequest): Promise<TaskEntity> {
    return this.tasksService.markAsDone(+id, Number(req.user.uid));
  }
}