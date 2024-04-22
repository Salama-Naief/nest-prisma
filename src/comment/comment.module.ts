import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  providers: [CommentService, PrismaService],
  controllers: [CommentController],
})
export class CommentModule {}
