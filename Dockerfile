# Utiliza una versión 'slim' de la imagen de Node para reducir el tamaño de la imagen final
FROM node:20.9.0-slim as builder

WORKDIR /app

# Invalida la caché cuando el archivo package.json cambia
ARG CACHEBUST=1

# Copia solo los archivos necesarios para instalar dependencias primero, para aprovechar la caché de Docker
COPY package.json pnpm-lock.yaml ./

# Instala pnpm y las dependencias de manera más eficiente
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copia el resto del código fuente
COPY . .

# Configura la variable de entorno en una sola capa
ENV NODE_ENV=${NODE_ENV}

# Construye la aplicación y verifica el resultado
RUN pnpm build && echo $?

# Genera el cliente de Prisma
RUN npx prisma generate

# Inicia una nueva etapa para reducir el tamaño de la imagen final
FROM node:20.9.0-slim
WORKDIR /app

# Instala OpenSSL y las dependencias necesarias
RUN apt-get update && apt-get install -y libssl-dev && apt-get clean

# Copia los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/prisma ./prisma

# Instala las dependencias en la imagen final
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Expone el puerto definido en la variable de entorno
EXPOSE ${PORT}

# Comando para iniciar la aplicación en modo producción
CMD ["node", "dist/main.js"]
