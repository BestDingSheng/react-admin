import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { roleName, status, ...rest } = createRoleDto;
    const role = this.rolesRepository.create({
      name: roleName,
      isActive: status,
      ...rest,
    });
    return this.rolesRepository.save(role);
  }

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  findOne(id: number): Promise<Role> {
    return this.rolesRepository.findOneBy({ id });
  }

  findByIds(ids: number[]): Promise<Role[]> {
    return this.rolesRepository.findByIds(ids);
  }
}
