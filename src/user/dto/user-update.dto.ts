import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly username: string;
  @IsOptional()
  @IsEmail()
  readonly email: string;
  @IsOptional()
  @IsStrongPassword()
  readonly password: string;
}
