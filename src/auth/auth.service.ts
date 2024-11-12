import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'

import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { LoginDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}
  private async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.correo)

    if (user && (await compare(dto.contrasena, user.contrasena))) {
      const { ...result } = user
      delete result.contrasena
      return result
    }
    throw new UnauthorizedException('Credenciales inválidas')
  }
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto)
    const payload = {
      username: user.usuario,
      sub: { id: user.id, tipo_usuario: user.tipo_usuario }
    }

    return {
      user,
      backendToken: await this.generateTokens(payload)
    }
  }

  private async generateTokens(payload) {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET_KEY
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_REFRESH_TOKEN_KEY
      })
    }
  }

  async refreshToken(user: any) {
    const payload = { usuario: user.usuario, sub: user.sub }

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET_KEY
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_REFRESH_TOKEN_KEY
      })
    }
  }
}
