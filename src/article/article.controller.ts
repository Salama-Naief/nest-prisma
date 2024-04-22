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
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOne(
    @Body() data: CreateArticleDto,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.articleService.createOne(data, Number(userId));
  }

  @Get('/')
  async findAll(): Promise<any> {
    return this.articleService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.articleService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.articleService.deleteOne(id);
  }

  @UseGuards(AuthGuard)
  @Put('/favorite/:id')
  async favorite(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.articleService.favorites(Number(id), Number(userId));
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateOne(
    @Body() data: UpdateArticleDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.articleService.updateOne(data, id);
  }
}
