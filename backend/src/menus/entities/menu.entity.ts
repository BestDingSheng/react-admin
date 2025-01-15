import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('menus')
export class Menu {
  @ApiProperty({ description: '菜单ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '菜单名称' })
  @Column()
  name: string;

  @ApiProperty({ description: '菜单路径' })
  @Column({ nullable: true })
  path: string;

  @ApiProperty({ description: '菜单图标' })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({ description: '父级菜单ID' })
  @Column({ nullable: true })
  parentId: number;

  @ApiProperty({ description: '排序号' })
  @Column({ default: 0 })
  order: number;

  @ApiProperty({ description: '菜单状态' })
  @Column({ default: 'enabled' })
  status: 'enabled' | 'disabled';

  @ApiProperty({ description: '菜单类型' })
  @Column({ default: 'menu' })
  type: 'menu' | 'button';

  @ApiProperty({ description: '组件路径' })
  @Column({ nullable: true })
  component: string;

  @ApiProperty({ description: '权限标识' })
  @Column({ nullable: true })
  permission: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 虚拟字段，不映射到数据库
  children?: Menu[];
}
