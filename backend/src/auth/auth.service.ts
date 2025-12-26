import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(firebaseUid: string, email: string): Promise<{ id: number; email: string }> {
    // Buscar usuario por email (asumiendo que el email es único)
    let user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Crear usuario si no existe
      user = await this.prisma.user.create({
        data: {
          email,
          password: '', // Campo requerido por el esquema, pero no se usa para autenticación
        }
      });
    }

    return {
      id: user.id,
      email: user.email
    };
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }
}