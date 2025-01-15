import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MenusService } from '../menus/menus.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private menusService: MenusService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findAll(query?: {
    id?: number;
    username?: string;
    email?: string;
  }): Promise<User[]> {
    const where: any = {};
    if (query?.id) {
      where.id = query.id;
    }
    if (query?.username) {
      where.username = query.username;
    }
    if (query?.email) {
      where.email = query.email;
    }

    const users = await this.usersRepository.find({
      where,
      relations: ['roles', 'roles.menus'],
    });

    // 为每个用户添加合并后的菜单列表
    for (const user of users) {
      const roleIds = user.roles.map((role) => role.id);
      user.menus = await this.menusService.findUserMenus(roleIds);
    }

    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.menus'],
    });

    if (user) {
      const roleIds = user.roles.map((role) => role.id);
      user.menus = await this.menusService.findUserMenus(roleIds);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.menus'],
    });

    if (user) {
      const roleIds = user.roles.map((role) => role.id);
      user.menus = await this.menusService.findUserMenus(roleIds);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { roleIds, ...rest } = updateUserDto;
    await this.usersRepository.update(id, rest);

    if (roleIds !== undefined) {
      const user = await this.findOne(id);
      user.roles = await this.roleRepository.find({
        where: { id: In(roleIds) },
        relations: ['menus'],
      });
      await this.usersRepository.save(user);
    }

    return this.findOne(id);
  }

  async updateStatus(id: number, isActive: boolean): Promise<User> {
    await this.usersRepository.update(id, { isActive });
    return this.findOne(id);
  }

  async getUserMenus(userId: number): Promise<any[]> {
    const user = await this.findOne(userId);
    if (!user || !user.roles.length) {
      return [];
    }
    const roleIds = user.roles.map((role) => role.id);
    return this.menusService.findUserMenus(roleIds);
  }
}
