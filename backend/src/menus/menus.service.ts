import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { BusinessException } from '../common/exceptions/business.exception';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: TreeRepository<Menu>,
  ) {}

  async findAll(): Promise<Menu[]> {
    console.log('开始查询菜单...');

    // 使用 TypeORM 查询
    const menus = await this.menuRepository.find({
      order: {
        sort: 'ASC',
      },
      relations: ['parent'], // 加载父级菜单关系
    });

    // console.log('查询到的原始菜单数据:', JSON.stringify(menus, null, 2));

    // 手动构建树形结构
    const result = this.buildTree(menus);
    console.log('构建的树形结构:', JSON.stringify(result, null, 2));
    return result;
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
        throw new NotFoundException(
          `Parent menu with ID ${createMenuDto.parentId} not found`,
        );
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
    if (updateMenuDto.status !== undefined)
      menu.isActive = updateMenuDto.status;
    if (updateMenuDto.type !== undefined) menu.type = updateMenuDto.type;
    if (updateMenuDto.component !== undefined)
      menu.component = updateMenuDto.component;

    // 更新父级菜单
    if (updateMenuDto.parentId !== undefined) {
      // 防止循环引用
      if (updateMenuDto.parentId === id) {
        throw new BusinessException({
          code: 20001,
          message: '不能将菜单的父级设置为自己',
        });
      }

      if (updateMenuDto.parentId === 0 || updateMenuDto.parentId === null) {
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
          throw new NotFoundException(
            `Parent menu with ID ${updateMenuDto.parentId} not found`,
          );
        }
      }
    }

    return this.menuRepository.save(menu);
  }

  async remove(id: number): Promise<void> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!menu) {
      throw new BusinessException({
        code: 20001,
        message: '菜单不存在',
      });
    }

    // 检查是否有子菜单
    if (menu.children && menu.children.length > 0) {
      throw new BusinessException({
        code: 20000,
        message: '无法删除含有子菜单的菜单项',
      });
    }

    // 直接删除菜单，由于设置了级联删除，会自动处理关联关系
    await this.menuRepository.remove(menu);
  }

  private buildTree(menus: Menu[]): Menu[] {
    const menuMap = new Map<number, Menu>();
    const roots: Menu[] = [];

    // 创建菜单映射
    menus.forEach((menu) => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // 构建树形结构
    menus.forEach((menu) => {
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(menuMap.get(menu.id));
        }
      } else {
        roots.push(menuMap.get(menu.id));
      }
    });

    return roots;
  }
}
