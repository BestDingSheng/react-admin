import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { MenusService } from '../menus/menus.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private menusService: MenusService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: ['menus'],
    });
  }

  findOne(id: number): Promise<Role> {
    return this.rolesRepository.findOne({
      where: { id },
      relations: ['menus'],
    });
  }

  findByIds(ids: number[]): Promise<Role[]> {
    return this.rolesRepository.find({
      where: { id: In(ids) },
      relations: ['menus'],
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // 更新基本字段
    if (updateRoleDto.name !== undefined) role.name = updateRoleDto.name;
    if (updateRoleDto.description !== undefined)
      role.description = updateRoleDto.description;
    if (updateRoleDto.isActive !== undefined)
      role.isActive = updateRoleDto.isActive;

    return this.rolesRepository.save(role);
  }

  async updateRoleMenus(id: number, menuIds: number[]): Promise<Role> {
    const role = await this.findOne(id);
    role.menus = await this.menusService.findByIds(menuIds);
    return this.rolesRepository.save(role);
  }
}
