import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Menu } from '../menus/menu.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '角色ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: '角色名称' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '角色描述' })
  description: string;

  @Column({ default: true })
  @ApiProperty({ description: '是否启用' })
  isActive: boolean;

  @ManyToMany(() => Menu, (menu) => menu.roles, {
    onDelete: 'CASCADE'
  })
  @ApiProperty({ description: '菜单列表', type: () => [Menu] })
  menus: Menu[];

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
