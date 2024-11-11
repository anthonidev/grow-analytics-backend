import { randomBytes } from 'crypto'
import { hash } from 'bcrypt'

// Método para generar una contraseña temporal
export const generateTempPassword = (length: number): string => {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

// Método para hashear la contraseña
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.CRYPT_SALT_ROUNDS, 10) || 10
  return await hash(password, saltRounds)
}

export const validatePasswordSecurity = (password: string) => {
  const errors = []

  // Verificar longitud mínima de 8 caracteres
  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres.')
  }

  // Verificar que contenga al menos una letra minúscula
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula.')
  }

  // Verificar que contenga al menos un número
  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número.')
  }

  // Verificar que contenga al menos un carácter especial
  if (!/[\W_]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial.')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
