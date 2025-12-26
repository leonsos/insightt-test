import { Module } from '@nestjs/common';
import { AuthFirebaseController } from './auth-firebase.controller';
import { AuthService } from './auth.service';
import { AuthFirebaseService } from './auth-firebase.service';
import { FirebaseService } from './firebase.service';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuthFirebaseController],
  providers: [AuthService, AuthFirebaseService, FirebaseService, FirebaseAuthGuard, PrismaService],
  exports: [AuthService, AuthFirebaseService, FirebaseService, FirebaseAuthGuard],
})
export class AuthModule {}

