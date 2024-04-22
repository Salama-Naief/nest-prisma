import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TagController } from './tag.controller';

@Module({
  providers: [TagService, PrismaService],
  controllers: [TagController],
})
export class TagModule {}
