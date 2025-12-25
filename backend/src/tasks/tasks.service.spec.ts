import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = { title: 'Test Task', description: 'Test Description' };
      const userId = 1;
      const createdTask = { id: 1, ...createTaskDto, userId, done: false, createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.task.create.mockResolvedValue(createdTask);

      const result = await service.create(createTaskDto, userId);

      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: { ...createTaskDto, userId },
      });
      expect(result).toEqual({
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        done: false,
        userId: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const userId = 1;
      const tasks = [
        { id: 1, title: 'Task 1', description: 'Desc 1', done: false, userId, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'Task 2', description: 'Desc 2', done: true, userId, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrismaService.task.findMany.mockResolvedValue(tasks);

      const result = await service.findAll(userId);

      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a task if it exists and belongs to the user', async () => {
      const taskId = 1;
      const userId = 1;
      const task = { id: taskId, title: 'Test Task', description: 'Test', done: false, userId, createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.task.findFirst.mockResolvedValue(task);

      const result = await service.findOne(taskId, userId);

      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(result).toEqual({
        id: 1,
        title: 'Test Task',
        description: 'Test',
        done: false,
        userId: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const taskId = 999;
      const userId = 1;

      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(service.findOne(taskId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const taskId = 1;
      const userId = 1;
      const updateTaskDto = { title: 'Updated Task' };
      const existingTask = { id: taskId, title: 'Old Task', description: 'Old', done: false, userId, createdAt: new Date(), updatedAt: new Date() };
      const updatedTask = { ...existingTask, ...updateTaskDto };

      mockPrismaService.task.findFirst.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateTaskDto, userId);

      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
      });
      expect(result.title).toBe('Updated Task');
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const taskId = 999;
      const userId = 1;
      const updateTaskDto = { title: 'Updated Task' };

      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(service.update(taskId, updateTaskDto, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const taskId = 1;
      const userId = 1;
      const existingTask = { id: taskId, title: 'Task to delete', userId, createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.task.findFirst.mockResolvedValue(existingTask);
      mockPrismaService.task.delete.mockResolvedValue(undefined);

      await service.remove(taskId, userId);

      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const taskId = 999;
      const userId = 1;

      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(service.remove(taskId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsDone', () => {
    it('should mark a task as done successfully', async () => {
      const taskId = 1;
      const userId = 1;
      const existingTask = { id: taskId, title: 'Task to complete', done: false, userId, createdAt: new Date(), updatedAt: new Date() };
      const updatedTask = { ...existingTask, done: true };

      mockPrismaService.task.findFirst.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.markAsDone(taskId, userId);

      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { done: true },
      });
      expect(result.done).toBe(true);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const taskId = 999;
      const userId = 1;

      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(service.markAsDone(taskId, userId)).rejects.toThrow(NotFoundException);
    });
  });
});