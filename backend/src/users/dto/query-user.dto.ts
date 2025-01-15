import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUserDto {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ description: '用户ID' })
  id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '用户名' })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '邮箱' })
  email?: string;
}
