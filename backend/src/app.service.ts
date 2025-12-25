import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testConnection(): Promise<string> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'Connection to Supabase successful!';
    } catch (error) {
      return `Connection failed: ${error.message}`;
    }
  }
}
