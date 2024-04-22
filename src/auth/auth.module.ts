import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, PrismaService],
})
export class AuthModule {
  constructor() {}
}
``;
