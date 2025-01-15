import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: TreeRepository<Menu>,
  ) {}

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.findTrees();
  }

  async findByIds(ids: number[]): Promise<Menu[]> {
    return this.menuRepository.findByIds(ids);
  }

  async findUserMenus(roleIds: number[]): Promise<Menu[]> {
    // 如果没有角色，直接返回空数组
    if (!roleIds || roleIds.length === 0) {
      return [];
    }

    // 获取所有角色的菜单
    const menus = await this.menuRepository
      .createQueryBuilder('menu')
      .innerJoinAndSelect('menu.roles', 'role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .andWhere('menu.isActive = :isActive', { isActive: true })
      .orderBy('menu.sort', 'ASC')
      .getMany();

    // 去重并构建树形结构
    const uniqueMenus = Array.from(new Set(menus.map((menu) => menu.id))).map(
      (id) => menus.find((menu) => menu.id === id),
    );

    return this.buildTree(uniqueMenus);
  }

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create({
      name: createMenuDto.name,
      path: createMenuDto.path,
      icon: createMenuDto.icon,
      sort: createMenuDto.order,
      isActive: createMenuDto.status,
    });

    if (createMenuDto.parentId) {
      const parent = await this.menuRepository.findOne({
        where: { id: createMenuDto.parentId },
      });
      if (parent) {
        menu.parent = parent;
      }
    }

    return this.menuRepository.save(menu);
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    // 更新基本字段
    if (updateMenuDto.name !== undefined) menu.name = updateMenuDto.name;
    if (updateMenuDto.path !== undefined) menu.path = updateMenuDto.path;
    if (updateMenuDto.icon !== undefined) menu.icon = updateMenuDto.icon;
    if (updateMenuDto.order !== undefined) menu.sort = updateMenuDto.order;
    if (updateMenuDto.status !== undefined)
      menu.isActive = updateMenuDto.status;

    // 更新父级菜单
    if (updateMenuDto.parentId !== undefined) {
      if (updateMenuDto.parentId === null) {
        menu.parent = null;
      } else {
        const parent = await this.menuRepository.findOne({
          where: { id: updateMenuDto.parentId },
        });
        if (parent) {
          menu.parent = parent;
        }
      }
    }

    return this.menuRepository.save(menu);
  }

  private buildTree(menus: Menu[]): Menu[] {
    const menuMap = new Map<number, Menu>();
    const roots: Menu[] = [];

    // 创建菜单映射
    menus.forEach((menu) => {
      // 创建一个新对象，避免修改原始数据
      const menuWithoutRoles = { ...menu };
      delete menuWithoutRoles.roles; // 删除 roles 字段，避免循环引用
      menuMap.set(menu.id, { ...menuWithoutRoles, children: [] });
    });

    // 构建树形结构
    menus.forEach((menu) => {
      const menuWithChildren = menuMap.get(menu.id);
      if (menu.parent) {
        const parent = menuMap.get(menu.parent.id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(menuWithChildren);
        }
      } else {
        roots.push(menuWithChildren);
      }
    });

    return roots;
  }
}
