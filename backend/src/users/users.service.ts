import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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

  findAll(query?: {
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
    return this.usersRepository.find({
      where,
      relations: ['roles'],
    });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { roleIds, ...rest } = updateUserDto;
    await this.usersRepository.update(id, rest);

    if (roleIds !== undefined) {
      const user = await this.findOne(id);
      user.roles = await this.roleRepository.findByIds(roleIds);
      await this.usersRepository.save(user);
    }

    return this.findOne(id);
  }

  async updateStatus(id: number, isActive: boolean): Promise<User> {
    await this.usersRepository.update(id, { isActive });
    return this.findOne(id);
  }
}
