import { PrismaService } from '../../prisma/prisma.service';

export const createMockPrismaService = () => ({
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

export const createMockFirebaseService = () => ({
  getAuth: jest.fn(),
  verifyIdToken: jest.fn(),
});

export const createMockAuthGuard = () => ({
  canActivate: jest.fn(() => true),
});

export interface MockRequest {
  user: {
    uid: string;
  };
}