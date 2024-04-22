import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ArticleController } from './article.controller';

@Module({
  providers: [ArticleService, PrismaService],
  controllers: [ArticleController],
})
export class ArticleModule {}
