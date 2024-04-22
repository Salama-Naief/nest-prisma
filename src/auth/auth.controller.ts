import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<any> {
    return this.authService.login(dto);
  }
}
