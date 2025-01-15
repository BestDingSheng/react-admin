import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '菜单路径', required: false })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({ description: '菜单图标', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: '父级菜单ID', required: false })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: '排序号' })
  @IsNumber()
  order: number;

  @ApiProperty({ description: '菜单状态', enum: ['enabled', 'disabled'] })
  @IsEnum(['enabled', 'disabled'])
  status: 'enabled' | 'disabled';

  @ApiProperty({ description: '菜单类型', enum: ['menu', 'button'] })
  @IsEnum(['menu', 'button'])
  type: 'menu' | 'button';

  @ApiProperty({ description: '组件路径', required: false })
  @IsString()
  @IsOptional()
  component?: string;

  @ApiProperty({ description: '权限标识', required: false })
  @IsString()
  @IsOptional()
  permission?: string;
}
