import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { RoleGuard } from 'src/roles/role.guard';
import { UserUpdateDto } from './dto/user-update.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FollowDto } from './dto/followe.dto';

@Controller('users')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Post()
  async creatOne(@Body() dto: CreateUserDto): Promise<any> {
    return this.userService.createOne(dto);
  }
  @Get('by-email')
  async findOneByEmail(@Body('email') email: string): Promise<any> {
    return this.userService.findOneByEmail(email);
  }
  @Get('/:id')
  async findOneById(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<any> {
    return this.userService.findOneById(Number(id));
  }
  @Get('/')
  async findAll(): Promise<any> {
    return this.userService.findAll();
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Delete('/:id')
  async deleteOne(@Param('id') id: number): Promise<any> {
    return this.userService.deleteOne(Number(id));
  }

  @UseGuards(AuthGuard)
  @Put('/me')
  async updateMe(@Body() dto: UserUpdateDto, @Req() req: any): Promise<any> {
    const id = req.user.id;
    console.log('id', id);
    return this.userService.updateOne(Number(id), dto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Put('/update-role/:id')
  async updateRole(
    @Body() data: UpdateRoleDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    console.log('role', data);
    return this.userService.updateRole(Number(id), data);
  }

  @UseGuards(AuthGuard)
  @Put('/follow')
  async addFollower(@Body() dto: FollowDto, @Req() req: any): Promise<any> {
    const currentUserId = req.user.id;
    return this.userService.follow(Number(currentUserId), dto);
  }

  @UseGuards(AuthGuard)
  @Put('/unfollow')
  async unfollow(@Body() dto: FollowDto, @Req() req: any): Promise<any> {
    const currentUserId = req.user.id;
    return this.userService.unfollow(Number(currentUserId), dto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Put('/:id')
  async updateOne(
    @Body() dto: UserUpdateDto,
    @Param('id') id: number,
  ): Promise<any> {
    return this.userService.updateOne(Number(id), dto);
  }
}
