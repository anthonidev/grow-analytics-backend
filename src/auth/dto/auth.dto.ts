import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  correo: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contrasena: string
}
