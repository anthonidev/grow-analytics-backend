import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as chalk from 'chalk'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now()

    // Obtener la hora en formato HH:mm:ss
    const currentTime = new Date().toLocaleTimeString()

    // Escuchar cuando la respuesta finaliza
    res.on('finish', () => {
      const duration = Date.now() - start

      // Colores definidos con chalk
      const methodColor = chalk.blue(req.method.padEnd(6)) // Método HTTP con longitud fija
      const urlColor = chalk.green(req.originalUrl.padEnd(30)) // URL con longitud fija
      const statusColor =
        res.statusCode >= 400
          ? chalk.red(res.statusCode.toString().padEnd(3))
          : chalk.green(res.statusCode.toString().padEnd(3)) // Código de estado en rojo si es error
      const timeColor = chalk.yellow(`${duration}ms`.padEnd(8)) // Tiempo de respuesta
      const timeStampColor = chalk.gray(currentTime) // Hora

      // Loguear todo en una sola línea con separadores consistentes
      console.log(
        `${timeStampColor} | Method: ${methodColor} | URL: ${urlColor} | Status: ${statusColor} | Time: ${timeColor}`
      )
    })

    next()
  }
}
