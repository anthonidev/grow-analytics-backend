import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

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

export class UpdateUserDto {
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
}
