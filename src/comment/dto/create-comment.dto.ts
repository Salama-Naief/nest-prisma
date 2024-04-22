import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  readonly articleId: number;
  @IsNotEmpty()
  @IsString()
  readonly body: string;
}
