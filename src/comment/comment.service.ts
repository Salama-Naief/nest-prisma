import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

const selectUserData = { email: true, image: true, id: true, username: true };
@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createOne(data: CreateCommentDto, userId: number): Promise<any> {
    const { articleId, body } = data;
    try {
      const article = await this.prisma.article.findUnique({
        where: { id: articleId },
      });

      if (!article) {
        throw new HttpException(
          { info: false, message: 'article not found', data: null },
          HttpStatus.NOT_FOUND,
        );
      }

      const comment = await this.prisma.comment.create({
        data: {
          body,
          articleId,
          userId,
        },
      });
      return { info: true, message: 'success', data: comment };
    } catch (error) {
      throw new HttpException(
        { info: false, message: error.message, data: null },
        error.statusCode,
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const comments = await this.prisma.comment.findMany({
        include: {
          User: {
            select: selectUserData,
          },
        },
      });
      return { info: true, message: 'success', data: comments };
    } catch (error) {
      throw new HttpException(
        { info: false, message: error.message, data: null },
        error.statusCode,
      );
    }
  }

  async deleteOne(id: number): Promise<any> {
    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        throw new HttpException(
          { info: false, message: 'comment is not found', data: null },
          HttpStatus.NOT_FOUND,
        );
      }
      const commentDeleted = await this.prisma.comment.delete({
        where: { id },
      });
      return {
        info: true,
        message: 'deleted successfully',
        data: commentDeleted,
      };
    } catch (error) {
      throw new HttpException(
        { info: false, message: error.message, data: null },
        error.statusCode,
      );
    }
  }
}
