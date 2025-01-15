import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  roleName: string;

  @ApiProperty({ description: '角色描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '状态', required: false })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
