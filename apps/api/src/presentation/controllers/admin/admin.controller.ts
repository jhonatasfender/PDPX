import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireAdmin, RequireSuperAdmin } from '../../decorators/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '../../../domain/entities/user.entity.js';

@ApiTags('Administração')
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  
  @Get('dashboard')
  @RequireAdmin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dashboard administrativo',
    description: 'Acesso ao painel administrativo (requer role ADMIN ou SUPERADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard carregado com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - permissões insuficientes',
  })
  async getDashboard(@CurrentUser() user: User) {
    return {
      message: 'Dashboard administrativo',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      permissions: {
        canManageUsers: user.canManageUsers(),
        canManageProducts: user.canManageProducts(),
        canAccessAdminPanel: user.canAccessAdminPanel(),
      },
    };
  }

  @Get('users')
  @RequireAdmin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Lista todos os usuários do sistema (requer role ADMIN ou SUPERADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários obtida com sucesso',
  })
  async getUsers(@CurrentUser() user: User) {
    return {
      message: 'Lista de usuários',
      currentUser: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      users: [],
    };
  }

  @Put('users/:userId/role')
  @RequireSuperAdmin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Alterar role de usuário',
    description: 'Altera o role de um usuário (requer role SUPERADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Role alterado com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - requer SUPERADMIN',
  })
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() body: { role: string },
    @CurrentUser() user: User,
  ) {
    return {
      message: 'Role alterado com sucesso',
      updatedBy: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      targetUser: {
        id: userId,
        newRole: body.role,
      },
    };
  }
}
