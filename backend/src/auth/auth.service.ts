import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    // 检查用户名是否已存在
    const existingUser = await this.usersService.findByUsername(registerDto.username);
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingEmail) {
      throw new ConflictException('邮箱已被使用');
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
      throw new UnauthorizedException('用户不存在');
    }

    // 获取用户的菜单权限
    const menus = await this.usersService.getUserMenus(userId);

    return {
      // code: 20000,
      // data: {
      //   user: {
      //     id: user.id,
      //     username: user.username,
      //     email: user.email,
      //     isActive: user.isActive,
      //     roles: user.roles,
      //   },
      //   menus,
      // },
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