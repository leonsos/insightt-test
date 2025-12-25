import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { NotFoundException } from '@nestjs/common';

// Extender la interfaz para que coincida con AuthenticatedRequest
interface MockRequest {
  user: {
    uid: string;
  };
  // Propiedades adicionales que podría necesitar AuthenticatedRequest
  headers?: any;
  body?: any;
  params?: any;
  query?: any;
}

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    markAsDone: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRequest: MockRequest = {
    user: { uid: '123' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        {
          provide: FirebaseAuthGuard,
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = { title: 'Test Task', description: 'Test Description' };
      const createdTask = { id: 1, ...createTaskDto, userId: 123, done: false, createdAt: new Date(), updatedAt: new Date() };

      mockTasksService.create.mockResolvedValue(createdTask);

      const result = await controller.create(createTaskDto, mockRequest as any);

      expect(mockTasksService.create).toHaveBeenCalledWith(createTaskDto, 123);
      expect(result).toEqual(createdTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks for the authenticated user', async () => {
      const tasks = [
        { id: 1, title: 'Task 1', description: 'Desc 1', done: false, userId: 123, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'Task 2', description: 'Desc 2', done: true, userId: 123, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockTasksService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll(mockRequest as any);

      expect(mockTasksService.findAll).toHaveBeenCalledWith(123);
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task if it exists', async () => {
      const taskId = '1';
      const task = { id: 1, title: 'Test Task', description: 'Test', done: false, userId: 123, createdAt: new Date(), updatedAt: new Date() };

      mockTasksService.findOne.mockResolvedValue(task);

      const result = await controller.findOne(taskId, mockRequest as any);

      expect(mockTasksService.findOne).toHaveBeenCalledWith(1, 123);
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const taskId = '999';

      mockTasksService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(taskId, mockRequest as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const taskId = '1';
      const updateTaskDto = { title: 'Updated Task' };
      const updatedTask = { id: 1, title: 'Updated Task', description: 'Test', done: false, userId: 123, createdAt: new Date(), updatedAt: new Date() };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateTaskDto, mockRequest as any);

      expect(mockTasksService.update).toHaveBeenCalledWith(1, updateTaskDto, 123);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const taskId = '1';

      mockTasksService.remove.mockResolvedValue(undefined);

      await controller.remove(taskId, mockRequest as any);

      expect(mockTasksService.remove).toHaveBeenCalledWith(1, 123);
    });
  });

  describe('markAsDone', () => {
    it('should mark a task as done successfully', async () => {
      const taskId = '1';
      const markedTask = { id: 1, title: 'Test Task', description: 'Test', done: true, userId: 123, createdAt: new Date(), updatedAt: new Date() };

      mockTasksService.markAsDone.mockResolvedValue(markedTask);

      const result = await controller.markAsDone(taskId, mockRequest as any);

      expect(mockTasksService.markAsDone).toHaveBeenCalledWith(1, 123);
      expect(result.done).toBe(true);
    });
  });
});