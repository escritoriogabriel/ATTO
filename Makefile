.PHONY: help setup install dev test build clean docker-up docker-down docker-logs

# Cores para output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help:
	@echo "$(BLUE)ATTO Transcriber - Makefile$(NC)"
	@echo ""
	@echo "$(GREEN)Setup & Installation:$(NC)"
	@echo "  make setup          - Setup inicial do projeto"
	@echo "  make install        - Instalar dependências"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@echo "  make dev            - Iniciar em modo desenvolvimento"
	@echo "  make dev-client     - Iniciar apenas frontend"
	@echo "  make dev-server     - Iniciar apenas backend"
	@echo ""
	@echo "$(GREEN)Database:$(NC)"
	@echo "  make db-generate    - Gerar migrations"
	@echo "  make db-studio      - Abrir Drizzle Studio"
	@echo "  make db-push        - Aplicar migrations"
	@echo ""
	@echo "$(GREEN)Testing:$(NC)"
	@echo "  make test           - Executar testes"
	@echo "  make test-watch     - Testes em modo watch"
	@echo ""
	@echo "$(GREEN)Build:$(NC)"
	@echo "  make build          - Build para produção"
	@echo "  make start          - Iniciar versão produção"
	@echo ""
	@echo "$(GREEN)Docker:$(NC)"
	@echo "  make docker-up      - Iniciar com Docker Compose"
	@echo "  make docker-down    - Parar Docker Compose"
	@echo "  make docker-logs    - Ver logs do Docker"
	@echo "  make docker-build   - Build imagem Docker"
	@echo ""
	@echo "$(GREEN)Utilities:$(NC)"
	@echo "  make format         - Formatar código"
	@echo "  make check          - Verificar tipos TypeScript"
	@echo "  make clean          - Limpar arquivos temporários"

setup:
	@echo "$(BLUE)🚀 Setup inicial...$(NC)"
	@chmod +x scripts/setup.sh
	@./scripts/setup.sh

install:
	@echo "$(BLUE)📦 Instalando dependências...$(NC)"
	@pnpm install

dev:
	@echo "$(BLUE)🚀 Iniciando em desenvolvimento...$(NC)"
	@pnpm dev

dev-client:
	@echo "$(BLUE)🚀 Iniciando frontend...$(NC)"
	@pnpm dev:client

dev-server:
	@echo "$(BLUE)🚀 Iniciando backend...$(NC)"
	@pnpm dev:server

db-generate:
	@echo "$(BLUE)🗄️  Gerando migrations...$(NC)"
	@pnpm drizzle-kit generate

db-studio:
	@echo "$(BLUE)🗄️  Abrindo Drizzle Studio...$(NC)"
	@pnpm drizzle-kit studio

db-push:
	@echo "$(BLUE)🗄️  Aplicando migrations...$(NC)"
	@pnpm db:push

test:
	@echo "$(BLUE)🧪 Executando testes...$(NC)"
	@pnpm test

test-watch:
	@echo "$(BLUE)🧪 Testes em modo watch...$(NC)"
	@pnpm test --watch

build:
	@echo "$(BLUE)🏗️  Build para produção...$(NC)"
	@pnpm build

start:
	@echo "$(BLUE)🚀 Iniciando versão produção...$(NC)"
	@pnpm start

docker-up:
	@echo "$(BLUE)🐳 Iniciando Docker Compose...$(NC)"
	@docker-compose up

docker-down:
	@echo "$(BLUE)🐳 Parando Docker Compose...$(NC)"
	@docker-compose down

docker-logs:
	@echo "$(BLUE)🐳 Logs do Docker...$(NC)"
	@docker-compose logs -f

docker-build:
	@echo "$(BLUE)🐳 Build da imagem Docker...$(NC)"
	@docker build -t atto-app:latest .

format:
	@echo "$(BLUE)✨ Formatando código...$(NC)"
	@pnpm format

check:
	@echo "$(BLUE)✓ Verificando tipos TypeScript...$(NC)"
	@pnpm check

clean:
	@echo "$(BLUE)🧹 Limpando arquivos temporários...$(NC)"
	@rm -rf dist build .next coverage
	@echo "$(GREEN)✅ Limpeza concluída$(NC)"

.DEFAULT_GOAL := help
