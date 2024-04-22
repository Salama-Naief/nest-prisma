import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/update-article.dto';

const selectUserData = { email: true, image: true, id: true, username: true };
@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async createOne(data: CreateArticleDto, userId: number): Promise<any> {
    const { description, tag, title } = data;
    try {
      let tagData = await this.prisma.tag.findUnique({
        where: { name: tag },
      });

      if (!tagData) {
        tagData = await this.prisma.tag.create({
          data: {
            name: tag,
          },
        });
      }
      const article = await this.prisma.article.findUnique({
        where: { slug: slugify(title), title },
      });
      if (article) {
        throw new HttpException(
          { info: false, message: 'this title is preserved', data: null },
          HttpStatus.BAD_REQUEST,
        );
      }
      const data = {
        autherId: userId,
        title: title,
        description,
        slug: slugify(title),
        tags: { connect: { id: tagData.id } },
      };

      const articleCreated = await this.prisma.article.create({
        data,
      });
      return { info: true, message: 'success', data: articleCreated };
    } catch (error) {
      throw new HttpException(
        { info: false, message: error.message, data: null },
        error.statusCode,
      );
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id },
        include: {
          auther: {
            select: selectUserData,
          },
          tags: true,
          comments: true,
          favoritedBy: { select: selectUserData },
        },
      });
      if (!article) {
        throw new HttpException(
          { info: false, message: 'article is not found', data: null },
          HttpStatus.NOT_FOUND,
        );
      }
      return { info: true, message: 'success', data: article };
    } catch (error) {
      throw new HttpException(
        { info: false, message: error.message, data: null },
        error.statusCode,
      );
    }
  }
  async findAll(): Promise<any> {
    try {
      const article = await this.prisma.article.findMany({
        include: {
          auther: { select: selectUserData },
          comments: true,
          tags: true,
          favoritedBy: { select: selectUserData },
        },
      });
      return { info: true, message: 'success', data: article };
    } catch (error) {
      throw new HttpException(
        { info: false, message: error.message, data: null },
        error.statusCode,
      );
    }
  }

  async deleteOne(id: number): Promise<any> {
    try {
      const article = await this.prisma.article.findUnique({ where: { id } });
      if (!article) {
        throw new HttpException(
          { info: false, message: 'article is not found', data: null },
          HttpStatus.NOT_FOUND,
        );
      }
      const deletedArticle = await this.prisma.article.delete({
        where: { id },
      });
      return {
        info: true,
        message: 'deleted successfully',
        data: deletedArticle,
      };
    } catch (error) {
      throw new HttpException(
        { info: false, message: error.message, data: null },
        error.statusCode,
      );
    }
  }

  async updateOne(data: UpdateArticleDto, id: number): Promise<any> {
    const { tag } = data;
    try {
      let tagData = null;
      if (tag) {
        tagData = await this.prisma.tag.findUnique({
          where: { name: tag },
        });
        if (!tagData) {
          tagData = await this.prisma.tag.create({
            data: {
              name: tag,
            },
          });
        }
      }

      const article = await this.prisma.article.findUnique({ where: { id } });
      if (!article) {
        throw new HttpException(
          { info: false, message: 'article is not found', data: null },
          HttpStatus.NOT_FOUND,
        );
      }

      const updateDate: any = {
        ...data,
      };
      delete updateDate.tag;
      if (data.title) {
        if (data.title === article.title) {
          throw new HttpException(
            {
              info: false,
              message: 'this title is used before please choose another one',
              data: null,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        updateDate.slug = slugify(data.title);
      }
      if (tagData) {
        updateDate.tags = { connect: { id: tagData.id } };
      }

      const articleUpdated = await this.prisma.article.update({
        data: updateDate,
        where: { id },
      });
      return { info: true, message: 'success', data: articleUpdated };
    } catch (error) {
      throw new HttpException(
        { info: false, message: error.message, data: null },
        error.statusCode,
      );
    }
  }

  async favorites(articleId: number, userId: number): Promise<any> {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id: articleId },
        include: { favoritedBy: true },
      });
      if (!article) {
        throw new HttpException(
          { info: false, message: 'article not found', data: null },
          HttpStatus.NOT_FOUND,
        );
      }
      const liked = article.favoritedBy.some((user) => user.id === userId);
      if (!liked) {
        await this.prisma.article.update({
          where: { id: articleId },
          data: { favoritedBy: { connect: { id: userId } } },
        });
      } else {
        await this.prisma.article.update({
          where: { id: articleId },
          data: { favoritedBy: { disconnect: { id: userId } } },
        });
      }
      return { info: true, message: 'success', data: article };
    } catch (error) {
      throw new HttpException(
        { info: false, message: error.message, data: null },
        error.statusCode,
      );
    }
  }
}
