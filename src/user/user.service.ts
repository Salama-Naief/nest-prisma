import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserUpdateDto } from './dto/user-update.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

//used to select the shape of returned data
const select = {
  email: true,
  username: true,
  bio: true,
  id: true,
  updatedAt: true,
  createdAt: true,
  role: true,
};
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // create one user
  async createOne(dto: CreateUserDto): Promise<any> {
    const { email, password, username } = dto;
    try {
      const isUserExist = await this.prisma.user.findUnique({
        where: { email },
      });
      if (isUserExist) {
        const error = 'this email is already exist';
        throw new HttpException(
          { info: false, massage: error, data: null },
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log('dto', dto);
      const hashPassword = bcrypt.hashSync(password, 10);
      const data = {
        email,
        username,
        password: hashPassword,
      };
      const user = await this.prisma.user.create({
        data,
        select,
      });
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      const token = await this.jwtService.signAsync(payload);
      return { info: true, message: 'success', data: { token, user } };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async findOneByEmail(email: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new HttpException(
          { info: false, message: 'user not found!', data: null },
          HttpStatus.NOT_FOUND,
        );
      }
      return { info: true, message: 'success', data: user };
    } catch (error) {
      console.log('get by email ', error);
      throw new HttpException(error.response, error.status);
    }
  }
  async findOneById(id: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          image: true,
          bio: true,
          username: true,
          id: true,
          email: true,
          role: true,
          favorites: true,
          articles: true,
          follower: { select },
          following: { select },
        },
      });
      if (!user) {
        throw new HttpException(
          { info: false, message: 'user not found!', data: null },
          HttpStatus.NOT_FOUND,
        );
      }
      return { info: true, message: 'success', data: user };
    } catch (error) {
      console.log('get by id ', error);
      throw new HttpException(error.response, error.status);
    }
  }

  async findAll(): Promise<any> {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          image: true,
          bio: true,
          username: true,
          id: true,
          email: true,
          role: true,
          favorites: true,
          articles: true,
          follower: { select },
          following: { select },
        },
      });
      return { info: true, message: 'success', data: users };
    } catch (error) {
      console.log('get all ', error);
      throw new HttpException(error.response, error.status);
    }
  }

  async deleteOne(id: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new HttpException(
          { info: false, message: 'user not found!', data: null },
          HttpStatus.NOT_FOUND,
        );
      }
      const userDeleted = await this.prisma.user.delete({
        where: { id },
        select,
      });
      return {
        info: true,
        message: 'user is deleted successffully',
        data: userDeleted,
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async updateOne(id: number, dto: UserUpdateDto): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        { info: false, message: 'user not found!', data: null },
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedUser = await this.prisma.user.update({
      data: dto,
      where: { id },
    });
    return {
      info: true,
      message: 'updated successfully',
      data: updatedUser,
    };
  }

  async updateRole(id: number, data: UpdateRoleDto): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        { info: false, message: 'user not found!', data: null },
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedUser = await this.prisma.user.update({
      data: { role: data.role },
      where: { id },
    });
    return {
      info: true,
      message: 'updated successfully',
      data: updatedUser,
    };
  }

  async follow(currentUserId: number, data: { follow: number }): Promise<any> {
    try {
      const followingUser = await this.prisma.user.findUnique({
        where: { id: data.follow },
      });

      if (!followingUser) {
        throw new HttpException(
          { info: false, message: 'user not found', data: null },
          HttpStatus.NOT_FOUND,
        );
      }
      const current_user = await this.prisma.user.findUnique({
        where: { id: currentUserId },
        include: { following: true },
      });

      const isAlreadyFollowing = current_user.following.some(
        (user) => user.id === data.follow,
      );
      console.log('current_user', current_user);
      if (isAlreadyFollowing) {
        return {
          info: false,
          message: 'You are already following this user',
          data: null,
        };
      }
      const currentUser = await this.prisma.user.update({
        where: { id: currentUserId },
        data: { following: { connect: { id: data.follow } } },
      });
      return { info: true, message: 'success', data: currentUser };
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error.response, error.status);
    }
  }

  async unfollow(
    currentUserId: number,
    data: { follow: number },
  ): Promise<any> {
    try {
      const followingUser = await this.prisma.user.findUnique({
        where: { id: data.follow },
        include: { follower: true },
      });

      if (!followingUser) {
        throw new HttpException(
          { info: false, message: 'user not found', data: null },
          HttpStatus.NOT_FOUND,
        );
      }
      const current_user = await this.prisma.user.findUnique({
        where: { id: currentUserId },
        include: { following: true },
      });

      const isAlreadyFollowing = current_user.following.find(
        (user) => user.id === data.follow,
      );
      if (!isAlreadyFollowing) {
        return {
          info: false,
          message: 'you do not follow this user',
          data: null,
        };
      }
      const currentUser = await this.prisma.user.update({
        where: { id: currentUserId },
        data: { following: { disconnect: { id: data.follow } } },
      });
      return { info: true, message: 'success', data: currentUser };
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error.response, error.status);
    }
  }
}
