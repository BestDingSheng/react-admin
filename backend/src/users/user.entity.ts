import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ description: '密码' })
  password: string;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活' })
  isActive: boolean;
} 