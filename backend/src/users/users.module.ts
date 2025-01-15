import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { RolesModule } from '../roles/roles.module';
import { MenusModule } from '../menus/menus.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule, MenusModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
