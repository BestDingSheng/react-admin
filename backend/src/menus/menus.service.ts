import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const menu = this.menuRepository.create(createMenuDto);
    return await this.menuRepository.save(menu);
  }

  async findAll() {
    const menus = await this.menuRepository.find({
      order: {
        order: 'ASC',
      },
    });
    return this.buildMenuTree(menus);
  }

  async findOne(id: number) {
    return await this.menuRepository.findOne({ where: { id } });
  }

  async update(id: number, updateMenuDto: Partial<CreateMenuDto>) {
    await this.menuRepository.update(id, updateMenuDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.menuRepository.delete(id);
  }

  private buildMenuTree(menus: Menu[], parentId: number | null = null): Menu[] {
    const menuTree: Menu[] = [];

    menus.forEach((menu) => {
      if (menu.parentId === parentId) {
        const children = this.buildMenuTree(menus, menu.id);
        if (children.length) {
          menu.children = children;
        }
        menuTree.push(menu);
      }
    });

    return menuTree;
  }
}
