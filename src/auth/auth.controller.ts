import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { CreateUserDto } from 'src/user/dto/user.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/auth.dto'
import { RefreshJwtGuard } from './guards/refresh.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto)
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto)
  }

  @ApiOperation({ summary: 'Refrescar el token JWT' })
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user)
  }
}
