import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { hashPassword } from 'src/utils/password.utils'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.usuario.findUnique({ where: { correo: email } })
  }

  async create(dto: CreateUserDto) {
    const existingUserByUsername = await this.prisma.usuario.findUnique({
      where: { usuario: dto.usuario }
    })

    const existingUserByEmail = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo }
    })

    if (existingUserByUsername) {
      throw new ConflictException('El nombre de usuario ya existe')
    }

    if (existingUserByEmail) {
      throw new ConflictException('El correo ya está registrado')
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
    const { contrasena, ...result } = newUser
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
        { nombre: { contains: search } },
        { apell_paterno: { contains: search } },
        { apell_materno: { contains: search } }
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

  async update(id: number, dto: UpdateUserDto) {
    const existingUser = await this.prisma.usuario.findUnique({ where: { id } })

    if (!existingUser) {
      throw new ConflictException('El usuario no existe')
    }

    // Verificar si el correo cambia y es diferente al actual
    if (dto.correo && dto.correo !== existingUser.correo) {
      const existingEmail = await this.prisma.usuario.findUnique({ where: { correo: dto.correo } })
      if (existingEmail) {
        throw new ConflictException('El correo ya está registrado')
      }
    }

    // Verificar si el nombre de usuario cambia y es diferente al actual
    if (dto.usuario && dto.usuario !== existingUser.usuario) {
      const existingUsername = await this.prisma.usuario.findUnique({
        where: { usuario: dto.usuario }
      })
      if (existingUsername) {
        throw new ConflictException('El nombre de usuario ya está registrado')
      }
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: {
        usuario: dto.usuario ?? existingUser.usuario,
        correo: dto.correo ?? existingUser.correo,
        nombre: dto.nombre ?? existingUser.nombre,
        apell_paterno: dto.apell_paterno ?? existingUser.apell_paterno,
        apell_materno: dto.apell_materno ?? existingUser.apell_materno
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena, ...result } = updatedUser
    return result
  }

  async delete(id: number) {
    const existingUser = await this.prisma.usuario.findUnique({ where: { id } })

    if (!existingUser) {
      throw new ConflictException('El usuario no existe')
    }

    await this.prisma.usuario.delete({ where: { id } })

    return { message: 'Usuario eliminado' }
  }
}
