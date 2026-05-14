#!/bin/bash

# ============================================
# ATTO Transcriber - Setup Script
# ============================================

set -e

echo "🚀 ATTO Transcriber - Setup Local"
echo "=================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js não encontrado. Por favor, instale Node.js 22+${NC}"
    exit 1
fi

echo -e "${BLUE}✓ Node.js encontrado: $(node --version)${NC}"

# Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando pnpm...${NC}"
    npm install -g pnpm
fi

echo -e "${BLUE}✓ pnpm encontrado: $(pnpm --version)${NC}"

# Instalar dependências
echo ""
echo -e "${BLUE}📦 Instalando dependências...${NC}"
pnpm install

# Gerar migrations do banco de dados
echo ""
echo -e "${BLUE}🗄️  Gerando migrations do banco de dados...${NC}"
pnpm drizzle-kit generate

echo ""
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo ""
echo "1. Configure as variáveis de ambiente:"
echo "   - Copie .env.docker.example para .env.docker"
echo "   - Customize conforme necessário"
echo ""
echo "2. Inicie a aplicação com Docker:"
echo "   docker-compose up"
echo ""
echo "3. Ou execute localmente (sem Docker):"
echo "   pnpm dev"
echo ""
echo "4. Acesse:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend: http://localhost:3000"
echo ""
echo -e "${YELLOW}Nota: Para usar com Manus OAuth, configure as variáveis de ambiente corretas.${NC}"
