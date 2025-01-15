import { IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ description: '邮箱' })
  email?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: '是否启用' })
  isActive?: boolean;
}
