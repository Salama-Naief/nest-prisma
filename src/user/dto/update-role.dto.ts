import { IsEnum } from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
