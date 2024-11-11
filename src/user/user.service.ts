import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { hashPassword } from 'src/utils/password.utils'
import { CreateUserDto } from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.usuario.findUnique({ where: { correo: email } })
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.usuario.findUnique({
      where: { usuario: dto.usuario, correo: dto.correo }
    })

    if (existingUser) {
      throw new ConflictException('El nombre de usuario o correo ya existe')
    }

    const hashedPassword = await hashPassword(dto.contrasena)

    const newUser = await this.prisma.usuario.create({
      data: {
        usuario: dto.usuario,
        correo: dto.correo,
        nombre: dto.nombre,
        apell_paterno: dto.apell_paterno,
        apell_materno: dto.apell_materno,
        contrasena: hashedPassword,
        tipo_usuario: dto.tipo_usuario
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sPass, ...result } = newUser
    return result
  }

  async listUsers(page: number = 1, search?: string) {
    const pageSize = 10
    const pageNumber = parseInt(String(page), 10) || 1
    const skip = (pageNumber - 1) * pageSize

    // Construye los filtros dinámicamente
    const filters: any = {}

    if (search) {
      filters.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { apell_paterno: { contains: search, mode: 'insensitive' } },
        { apell_materno: { contains: search, mode: 'insensitive' } }
      ]
    }

    const totalCount = await this.prisma.usuario.count({ where: filters })
    const totalPages = Math.ceil(totalCount / pageSize)

    const users = await this.prisma.usuario.findMany({
      where: filters,
      orderBy: {
        updated_at: 'asc'
      },
      skip,
      take: pageSize,
      select: {
        id: true,
        usuario: true,
        correo: true,
        nombre: true,
        apell_paterno: true,
        apell_materno: true,
        tipo_usuario: true
      }
    })

    return {
      count: totalCount,
      current_page: pageNumber,
      total_pages: totalPages,
      results: users
    }
  }
}
