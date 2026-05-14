# 🚀 ATTO Transcriber - Setup Local Rápido

Escolha uma das opções abaixo para rodar a aplicação localmente:

---

## ⚡ Opção 1: Docker (Recomendado - 1 comando!)

**Pré-requisito:** [Docker Desktop](https://www.docker.com/products/docker-desktop)

```bash
# 1. Clone o repositório
git clone https://github.com/escritoriogabriel/Atto_App_New.git
cd Atto_App_New

# 2. Inicie a aplicação (tudo em um comando!)
docker-compose up
```

✅ **Pronto!** Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MySQL: localhost:3306

---

## 💻 Opção 2: Desenvolvimento Nativo (Sem Docker)

**Pré-requisitos:**
- [Node.js 22+](https://nodejs.org/)
- [MySQL 8.0+](https://dev.mysql.com/downloads/mysql/)

```bash
# 1. Clone o repositório
git clone https://github.com/escritoriogabriel/Atto_App_New.git
cd Atto_App_New

# 2. Execute o setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Configure o banco de dados
mysql -u root -p < scripts/init.sql

# 4. Inicie a aplicação
pnpm dev
```

✅ **Pronto!** Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🎯 Comandos Úteis

### Com Docker
```bash
docker-compose up          # Iniciar
docker-compose down        # Parar
docker-compose logs -f     # Ver logs
```

### Sem Docker (com Make)
```bash
make help                  # Ver todos os comandos
make dev                   # Iniciar desenvolvimento
make test                  # Executar testes
make build                 # Build produção
```

### Sem Docker (com pnpm)
```bash
pnpm dev                   # Iniciar desenvolvimento
pnpm test                  # Executar testes
pnpm build                 # Build produção
pnpm drizzle-kit studio    # Visualizar banco de dados
```

---

## 🔧 Configuração (Opcional)

Se quiser customizar portas ou credenciais:

```bash
# Copiar arquivo de exemplo
cp .env.docker.example .env.docker

# Editar conforme necessário
nano .env.docker

# Depois iniciar
docker-compose up
```

---

## 📊 Estrutura do Projeto

```
Atto_App_New/
├── client/          # Frontend React
├── server/          # Backend Node.js
├── drizzle/         # Banco de dados
├── scripts/         # Scripts úteis
├── docker-compose.yml
├── Dockerfile
├── Makefile
└── DEVELOPMENT.md   # Guia detalhado
```

---

## 🧪 Testes

```bash
pnpm test           # Executar testes
pnpm test --watch   # Modo watch
```

---

## 📚 Documentação Completa

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guia detalhado de desenvolvimento
- **[TRANSCRIBER_GUIDE.md](./TRANSCRIBER_GUIDE.md)** - Como usar o Transcriber
- **[README_ATTO.md](./README_ATTO.md)** - Overview do projeto

---

## 🐛 Problemas Comuns

### Porta já em uso
```bash
# Mudar porta no docker-compose.yml
# Ou matar processo
lsof -ti:3000 | xargs kill -9
```

### Erro de conexão com MySQL
```bash
# Verificar se MySQL está rodando
docker ps
# ou
mysql -u root -p
```

### Erro "Module not found"
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## ✅ Checklist de Setup

- [ ] Docker instalado (se usar Docker)
- [ ] Node.js 22+ instalado (se sem Docker)
- [ ] MySQL instalado (se sem Docker)
- [ ] Repositório clonado
- [ ] `docker-compose up` ou `pnpm dev` executado
- [ ] Frontend acessível em http://localhost:5173
- [ ] Backend respondendo em http://localhost:3000

---

## 🎉 Pronto!

Sua aplicação ATTO Transcriber está rodando localmente! 🚀

Para mais detalhes, veja [DEVELOPMENT.md](./DEVELOPMENT.md)

---

**Versão:** 1.0  
**Última atualização:** Maio 2024
