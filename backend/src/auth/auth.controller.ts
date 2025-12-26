import { Controller, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
    [key: string]: any;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly authService: AuthService
  ) {}
}