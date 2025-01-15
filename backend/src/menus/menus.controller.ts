import { Controller, Get, Post, Put, Delete, Body, Param, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@ApiTags('menus')
@Controller('menus')
@UseFilters(HttpExceptionFilter)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiOperation({ summary: '获取菜单树' })
  @ApiResponse({ status: 200, description: '获取成功', type: [Menu] })
  findAll(): Promise<Menu[]> {
    return this.menusService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  @ApiResponse({ status: 201, description: '创建成功', type: Menu })
  create(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menusService.create(createMenuDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单' })
  @ApiResponse({ status: 200, description: '更新成功', type: Menu })
  update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    return this.menusService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.menusService.remove(+id);
  }
}
