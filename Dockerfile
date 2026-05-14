FROM node:22-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    ffmpeg

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código da aplicação
COPY . .

# Expor portas
EXPOSE 3000 5173

# Comando padrão: desenvolvimento
CMD ["pnpm", "dev"]
