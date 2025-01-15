import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/role.entity';
import { Menu } from '../menus/menu.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '用户ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: '用户名' })
  username: string;

  @Column({ unique: true })
  @ApiProperty({ description: '邮箱' })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活' })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ManyToMany(() => Role)
  @JoinTable()
  @ApiProperty({ description: '角色列表', type: () => [Role] })
  roles: Role[];

  @ApiProperty({ description: '菜单列表', type: () => [Menu] })
  menus: Menu[];
}
