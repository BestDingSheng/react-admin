import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { BusinessException } from '../common/exceptions/business.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new BusinessException({
        code: 20001,
        message: '用户名或密码错误',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BusinessException({
        code: 20001,
        message: '用户名或密码错误',
      });
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    // 检查用户名是否已存在
    const existingUser = await this.usersService.findByUsername(
      registerDto.username,
    );
    if (existingUser) {
      throw new BusinessException({
        code: 20001,
        message: '用户名已存在',
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.usersService.findByEmail(
      registerDto.email,
    );
    if (existingEmail) {
      throw new BusinessException({
        code: 20001,
        message: '邮箱已被使用',
      });
    }

    // 创建新用户
    const user = await this.usersService.create(registerDto);

    // 生成 JWT token
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async getCurrentUser(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BusinessException({
        code: 20001,
        message: '用户不存在',
      });
    }

    // 获取用户的菜单权限
    const menus = await this.usersService.getUserMenus(userId);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        roles: user.roles,
      },
      menus,
    };
  }
}
