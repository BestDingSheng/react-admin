import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Tree,
  TreeChildren,
  TreeParent,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/role.entity';

@Entity()
@Tree('materialized-path')
export class Menu {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '菜单ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '菜单名称' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '菜单路径' })
  path: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '菜单图标' })
  icon: string;

  @Column({ default: true })
  @ApiProperty({ description: '是否启用' })
  isActive: boolean;

  @Column({ default: 0 })
  @ApiProperty({ description: '排序' })
  sort: number;

  @TreeChildren()
  @ApiProperty({ description: '子菜单', type: () => [Menu] })
  children: Menu[];

  @TreeParent()
  @ApiProperty({ description: '父菜单', type: () => Menu })
  parent: Menu;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.menus)
  @ApiProperty({ description: '角色列表', type: () => [Role] })
  roles: Role[];
}
