import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MenusModule } from '../menus/menus.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), MenusModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [TypeOrmModule, RolesService],
})
export class RolesModule {}
