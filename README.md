<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Backend con NestJS (Express + Prisma)

## Descripción

Este proyecto es una aplicación backend desarrollada con [NestJS](https://nestjs.com/), un framework progresivo de Node.js para construir aplicaciones eficientes, escalables y mantenibles. La aplicación incluye integración con Prisma para la gestión de bases de datos, autenticación con JWT y documentación de API con Swagger.

## Requisitos previos

Asegúrate de tener las siguientes herramientas instaladas en tu entorno de desarrollo:

- [Node.js](https://nodejs.org/) (v18.0.0 o superior)
- [pnpm](https://pnpm.io/) (opcional, pero recomendado)

## Instalación

1. Clona el repositorio en tu máquina local:

   ```bash
   git clone https://github.com/anthonidev/grow-analytics-backend.git
   cd grow-analytics-backend
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install # o pnpm install
   ```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto y define las variables de entorno necesarias:

   ```
   JWT_SECRET_KEY=
   JWT_REFRESH_TOKEN_KEY=
   DATABASE_URL=

   ```

2. Ejecuta las migraciones de Prisma para configurar la base de datos:
   ```bash
   npx prisma migrate dev # o pnpx prisma migrate dev
   ```

## Uso

### Comandos para desarrollo

- Iniciar el servidor en modo desarrollo:

  ```bash
  npm run start:dev
  ```

- Construir el proyecto:

  ```bash
  npm run build
  ```

- Ejecutar pruebas:
  ```bash
  npm run test
  ```

### Documentación de la API

La documentación de la API se genera automáticamente con Swagger y está disponible en la ruta:

```
http://localhost:3000/api
```

## Tecnologías utilizadas

- **NestJS**: framework para Node.js.
- **Prisma**: ORM para el manejo de la base de datos.
- **JWT**: para la autenticación.
- **Swagger**: para la documentación de la API.
- **Jest**: para las pruebas unitarias.
- **Docker**: para la creación de contenedores.
