import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class TagService {
  constructor(private prima: PrismaService) {}

  async findAll(): Promise<any> {
    const tags = await this.prima.tag.findMany();
    return { info: true, message: 'success', data: tags };
  }
}
