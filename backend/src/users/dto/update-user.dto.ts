import {
  IsOptional,
  IsEmail,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ description: '邮箱' })
  email?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: '是否启用' })
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @ApiPropertyOptional({ description: '角色ID列表', type: [Number] })
  roleIds?: number[];
}
