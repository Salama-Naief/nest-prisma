import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [UserModule, AuthModule, ArticleModule, TagModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
