import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtGuard } from 'src/auth/guards/jwt.guard'
import { UserService } from './user.service'

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'Listar usuarios activos con paginación y filtros' })
  @Get('list')
  async list(@Query('page') page: string = '1', @Query('search') search?: string) {
    return await this.userService.listUsers(parseInt(page, 10), search)
  }
}
