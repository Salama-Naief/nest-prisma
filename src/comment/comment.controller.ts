import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOne(
    @Body() data: CreateCommentDto,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.commentService.createOne(data, Number(userId));
  }

  @Get('/')
  async findAll(): Promise<any> {
    return this.commentService.findAll();
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.commentService.deleteOne(id);
  }
}
