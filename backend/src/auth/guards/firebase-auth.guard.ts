import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import { AuthBlacklistService } from '../auth-blacklist.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private authBlacklistService: AuthBlacklistService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Extraer el token del header "Bearer <token>"
    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    // Verificar si el token está en blacklist (revocado)
    if (this.authBlacklistService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    try {
      // Verificar el token con Firebase
      const decodedToken = await this.firebaseService.verifyIdToken(token);
      
      // Agregar la información del usuario al request para uso posterior
      request.user = {
        ...decodedToken,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

