import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Role {
  @ApiProperty({ description: '角色ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '角色名称' })
  @Column({ length: 50, unique: true })
  roleName: string;

  @ApiProperty({ description: '角色描述' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: '状态' })
  @Column({ default: true })
  status: boolean;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
