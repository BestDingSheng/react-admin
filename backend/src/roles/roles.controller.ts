import { Controller, Get, Post, Put, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 200, description: '创建成功', type: Role })
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有角色' })
  @ApiResponse({ status: 200, description: '获取成功', type: [Role] })
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取角色' })
  @ApiResponse({ status: 200, description: '获取成功', type: Role })
  findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Role })
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Patch(':id/menus')
  @ApiOperation({ summary: '更新角色菜单' })
  @ApiResponse({ status: 200, description: '更新成功', type: Role })
  updateRoleMenus(
    @Param('id') id: string,
    @Body('menuIds') menuIds: number[],
  ): Promise<Role> {
    return this.rolesService.updateRoleMenus(+id, menuIds);
  }
}
