import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '角色名称' })
  roleName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: '角色描述' })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: '状态', default: true })
  status?: boolean;
}
