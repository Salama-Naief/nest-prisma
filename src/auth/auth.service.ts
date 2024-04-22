import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { LoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<any> {
    const { email } = dto;
    try {
      const _user = await this.prisma.user.findUnique({
        where: { email },
      });
      const error = { info: false, message: 'wrong email or password!' };
      if (!_user) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }

      const isValidPassword = await bcrypt.compare(
        dto.password,
        _user.password,
      );
      if (!isValidPassword) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      delete _user.password;
      const payload = {
        id: _user.id,
        username: _user.username,
        role: _user.role,
      };
      const token = await this.jwtService.signAsync(payload);
      console.log('token', token);
      // const { password, ...user } = _user;
      return { info: true, massage: 'success', data: { token, user: _user } };
    } catch (error) {
      console.log('create one ', error);
      throw new HttpException(
        {
          info: false,
          messsage: 'something went wrong!',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
