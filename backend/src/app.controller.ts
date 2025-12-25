import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { FirebaseAuthGuard } from './auth/guards/firebase-auth.guard';
import { User } from './auth/decorators/user.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-connection')
  async testConnection(): Promise<string> {
    return this.appService.testConnection();
  }

  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  getProfile(@User() user: any) {
    return {
      message: 'This is a protected route',
      user: {
        uid: user.uid,
        email: user.email,
      },
    };
  }
}
