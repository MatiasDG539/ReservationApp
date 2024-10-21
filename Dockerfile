# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia todo el código de la aplicación al contenedor
COPY . .

# Construye la aplicación Next.js para producción
RUN npm run build

# Expone el puerto que utilizará la aplicación
EXPOSE 3000

# Comando por defecto para iniciar la aplicación en producción
CMD ["npm", "start"]
