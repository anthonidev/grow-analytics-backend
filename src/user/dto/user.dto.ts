import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  usuario: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  correo: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apell_paterno: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apell_materno: string

  @ApiProperty()
  @IsString()
  @MinLength(3)
  contrasena: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tipo_usuario: string
}

export class CreateUserFromClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sNombreUsuario: string

  @ApiProperty()
  @IsInt()
  sEstado: number

  @ApiProperty()
  @IsInt()
  nIdCliente: number

  @ApiProperty()
  @IsInt()
  nIdRol: number
}

export class UpdateUserDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  nIdRol: number

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  sEstado: number

  @ApiProperty()
  @IsString()
  sPass: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sNombreUsuario: string

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  nIdUsuario: number
}
