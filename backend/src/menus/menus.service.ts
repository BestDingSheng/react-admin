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
      type: createMenuDto.type,
      component: createMenuDto.component,
      parentId: createMenuDto.parentId || null,
    });

    // 处理父级菜单
    if (createMenuDto.parentId && createMenuDto.parentId !== 0) {
      const parent = await this.menuRepository.findOne({
        where: { id: createMenuDto.parentId },
      });
      if (parent) {
        menu.parent = parent;
      } else {
        throw new NotFoundException(`Parent menu with ID ${createMenuDto.parentId} not found`);
      }
    } else {
      // 如果没有选择父级菜单或 parentId 为 0，则设置为顶级菜单
      menu.parent = null;
      menu.parentId = null;
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
    if (updateMenuDto.status !== undefined) menu.isActive = updateMenuDto.status;
    if (updateMenuDto.type !== undefined) menu.type = updateMenuDto.type;
    if (updateMenuDto.component !== undefined) menu.component = updateMenuDto.component;

    // 更新父级菜单
    if (updateMenuDto.parentId !== undefined) {
      if (updateMenuDto.parentId === 0) {
        menu.parent = null;
        menu.parentId = null;
      } else {
        const parent = await this.menuRepository.findOne({
          where: { id: updateMenuDto.parentId },
        });
        if (parent) {
          menu.parent = parent;
          menu.parentId = parent.id;
        } else {
          throw new NotFoundException(`Parent menu with ID ${updateMenuDto.parentId} not found`);
        }
      }
    }

    return this.menuRepository.save(menu);
  }

  async remove(id: number): Promise<void> {
    const menu = await this.menuRepository.findOne({ 
      where: { id },
      relations: ['children']
    });
    
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    // 检查是否有子菜单
    if (menu.children && menu.children.length > 0) {
      throw new NotFoundException('无法删除含有子菜单的菜单项');
    }

    // 直接删除菜单，由于设置了级联删除，会自动处理关联关系
    await this.menuRepository.remove(menu);
  }

  private buildTree(menus: Menu[]): Menu[] {
    const menuMap = new Map<number, Menu>();
    const roots: Menu[] = [];

    // 创建菜单映射
    menus.forEach((menu) => {
      // 创建一个新对象，避免修改原始数据
      const menuWithoutRoles = { ...menu };
      delete menuWithoutRoles.roles; // 删除 roles 字段，避免循环引用
      // 添加 parentId
      menuWithoutRoles.parentId = menu.parentId || null;
      menuMap.set(menu.id, { ...menuWithoutRoles, children: [] });
    });

    // 构建树形结构
    menus.forEach((menu) => {
      const menuWithChildren = menuMap.get(menu.id);
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId);
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
