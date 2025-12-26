import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthFirebaseService } from './auth-firebase.service';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
    [key: string]: any;
  };
}

@ApiTags('auth-firebase')
@Controller('auth-firebase')
export class AuthFirebaseController {
  constructor(
    private readonly authFirebaseService: AuthFirebaseService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario con Firebase Authentication' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      example1: {
        summary: 'Registro básico',
        description: 'Ejemplo de registro de usuario',
        value: {
          email: 'usuario@ejemplo.com',
          password: 'contraseña123'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            uid: { type: 'string' },
            email: { type: 'string' }
          }
        },
        databaseUser: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Email ya registrado o datos inválidos'
  })
  async register(@Body() registerDto: RegisterDto) {
    const { email, password } = registerDto;

    try {
      // Registrar en Firebase Authentication
      const firebaseUser = await this.authFirebaseService.createUserWithEmailAndPassword(email, password);

      // Registrar en nuestra base de datos (para el userId numérico)
      const databaseUser = await this.authService.findOrCreateUser(firebaseUser.uid, firebaseUser.email);

      return {
        message: 'Usuario registrado exitosamente',
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email
        },
        databaseUser
      };
    } catch (error) {
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con Firebase Authentication' })
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Login básico',
        description: 'Ejemplo de inicio de sesión',
        value: {
          email: 'usuario@ejemplo.com',
          password: 'contraseña123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            uid: { type: 'string' },
            email: { type: 'string' }
          }
        },
        token: {
          type: 'object',
          properties: {
            idToken: { type: 'string' },
            expiresIn: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas'
  })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // En una implementación real, usarías Firebase REST API aquí
      // Por ahora, indicamos que se debe implementar
      throw new Error('Implementación de Firebase Auth REST API requerida. Usa Firebase SDK en el frontend para obtener el ID Token.');
      
      // Este sería el flujo real:
      // const response = await this.authFirebaseService.signInWithEmailAndPassword(email, password);
      // return {
      //   message: 'Inicio de sesión exitoso',
      //   user: {
      //     uid: response.uid,
      //     email: response.email
      //   },
      //   token: {
      //     idToken: response.idToken,
      //     expiresIn: response.expiresIn
      //   }
      // };
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        firebaseUser: {
          type: 'object',
          properties: {
            uid: { type: 'string' },
            email: { type: 'string' }
          }
        },
        databaseUser: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          },
          nullable: true
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o ausente'
  })
  async getMe(@Request() req: AuthenticatedRequest) {
    const firebaseUid = req.user.uid;
    const email = req.user.email;

    // Obtener información de Firebase
    const firebaseUser = await this.authFirebaseService.getUserByUid(firebaseUid);

    // Obtener información de nuestra base de datos
    const databaseUser = await this.authService.findOrCreateUser(firebaseUid, email);

    return {
      firebaseUser,
      databaseUser
    };
  }

  @Post('logout')
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión (revocar tokens)' })
  @ApiResponse({
    status: 204,
    description: 'Sesión cerrada exitosamente'
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o ausente'
  })
  async logout(@Request() req: AuthenticatedRequest) {
    const firebaseUid = req.user.uid;

    try {
      // Revocar los tokens de refresh en Firebase
      await this.authFirebaseService.revokeRefreshTokens(firebaseUid);
      
      return;
    } catch (error) {
      throw new Error(`Error al cerrar sesión: ${error.message}`);
    }
  }

  @Post('delete-account')
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar cuenta de usuario' })
  @ApiResponse({
    status: 204,
    description: 'Cuenta eliminada exitosamente'
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o ausente'
  })
  async deleteAccount(@Request() req: AuthenticatedRequest) {
    const firebaseUid = req.user.uid;

    try {
      // Eliminar de Firebase Authentication
      await this.authFirebaseService.deleteUser(firebaseUid);
      
      return;
    } catch (error) {
      throw new Error(`Error al eliminar cuenta: ${error.message}`);
    }
  }
}