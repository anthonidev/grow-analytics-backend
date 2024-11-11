import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { PrismaService } from 'src/prisma.service'
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common'
import { mockDeep } from 'jest-mock-extended'
import {
  hashPassword
  // validatePasswordSecurity,
} from 'src/utils/password.utils'
import { compare } from 'bcrypt'

jest.mock('src/utils/password.utils', () => ({
  hashPassword: jest.fn(),
  validatePasswordSecurity: jest.fn()
}))

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}))

describe('UserService', () => {
  let service: UserService
  let prisma: any // Cambiamos el tipo de prisma a any para evitar problemas de tipado con el mock

  beforeEach(async () => {
    const prismaMock = mockDeep<PrismaService>()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('create', () => {
    it('debe lanzar una excepción si el usuario ya existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: 1 })
      await expect(
        service.create({ sNombreUsuario: 'test', sPass: '1234' } as any)
      ).rejects.toThrow(ConflictException)
    })

    it('debe crear un usuario y guardar auditoría', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)
      prisma.usuario.create.mockResolvedValue({
        nIdUsuario: 1,
        sNombreUsuario: 'test'
      })
      prisma.auditoriaUsuario.create.mockResolvedValue(null)
      ;(hashPassword as jest.Mock).mockResolvedValue('hashedPassword')

      const result = await service.create({
        sNombreUsuario: 'test',
        sPass: '1234'
      } as any)

      expect(prisma.usuario.create).toHaveBeenCalled()
      expect(prisma.auditoriaUsuario.create).toHaveBeenCalled()
      expect(result.sNombreUsuario).toBe('test')
    })
  })

  describe('findByUsername', () => {
    it('debe retornar un usuario por nombre de usuario', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ sNombreUsuario: 'test' })

      const result = await service.findByUsername('test')
      expect(result.sNombreUsuario).toBe('test')
      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { sNombreUsuario: 'test' },
        include: { Cliente: true }
      })
    })
  })

  describe('changePassword', () => {
    it('debe lanzar excepción si la nueva contraseña no cumple requisitos', async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        sPass: 'hashedPassword',
        Auditoria: {},
        Cliente: {}
      })
      ;(compare as jest.Mock).mockResolvedValue(true)

      // Asegúrate de que el mock esté retornando el valor correcto
      /* validatePasswordSecurity.mockReturnValue({
        isValid: false,
        errors: ['Password too short'],
      }); */

      await expect(service.changePassword(1, 'short', 'currentPass')).rejects.toThrow(
        BadRequestException
      )
    })

    it('debe actualizar la contraseña del usuario', async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        sPass: 'hashedPassword',
        Auditoria: {},
        Cliente: { nIdCliente: 1 }
      })
      ;(compare as jest.Mock).mockResolvedValue(true)
      ;(hashPassword as jest.Mock).mockResolvedValue('newHashedPassword')

      // Asegúrate de que el mock esté retornando el valor correcto
      // validatePasswordSecurity.mockReturnValue({ isValid: true });

      await service.changePassword(1, 'newPass', 'currentPass')

      expect(prisma.usuario.update).toHaveBeenCalledWith({
        where: { nIdUsuario: 1 },
        data: { sPass: 'newHashedPassword', bPassTemporal: false }
      })
    })
  })

  describe('resetPassword', () => {
    it('debe lanzar una excepción si el usuario no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)

      await expect(service.resetPassword(1, 'newHashedPassword')).rejects.toThrow(NotFoundException)
    })

    it('debe resetear la contraseña y marcarla como temporal', async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        Auditoria: {},
        Cliente: { nIdCliente: 1 }
      })

      await service.resetPassword(1, 'newHashedPassword')

      expect(prisma.usuario.update).toHaveBeenCalledWith({
        where: { nIdUsuario: 1 },
        data: { sPass: 'newHashedPassword', bPassTemporal: true }
      })
      expect(prisma.auditoriaUsuario.update).toHaveBeenCalled()
    })
  })
})
