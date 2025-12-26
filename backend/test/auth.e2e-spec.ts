import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthFirebaseService } from './../src/auth/auth-firebase.service';
import { AuthService } from './../src/auth/auth.service';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AuthFirebaseController (e2e)', () => {
    let app: INestApplication;
    let authFirebaseService = { createUserWithEmailAndPassword: jest.fn(), revokeRefreshTokens: jest.fn() };
    let authService = { findOrCreateUser: jest.fn() };
    let prismaService = { $connect: jest.fn(), $disconnect: jest.fn(), onModuleInit: jest.fn(), onModuleDestroy: jest.fn() };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AuthFirebaseService)
            .useValue(authFirebaseService)
            .overrideProvider(AuthService)
            .useValue(authService)
            .overrideProvider(PrismaService)
            .useValue(prismaService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/auth-firebase/register (POST)', () => {
        const mockFirebaseUser = { uid: 'test-uid-123', email: 'test@example.com' };
        const mockDbUser = { id: 1, email: 'test@example.com', createdAt: new Date() };

        authFirebaseService.createUserWithEmailAndPassword.mockResolvedValue(mockFirebaseUser);
        authService.findOrCreateUser.mockResolvedValue(mockDbUser);

        return request(app.getHttpServer())
            .post('/auth-firebase/register')
            .send({ email: 'test@example.com', password: 'password123' })
            .expect(201)
            .expect((res) => {
                expect(res.body.message).toBe('Usuario registrado exitosamente');
                expect(res.body.user.uid).toBe('test-uid-123');
                expect(res.body.databaseUser.id).toBe(1);
            });
    });
});
