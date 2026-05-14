# ATTO Transcriber - Guia de Desenvolvimento Local

## 📋 Pré-requisitos

### Opção 1: Com Docker (Recomendado)
- **Docker**: [Instalar Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Incluído no Docker Desktop

### Opção 2: Sem Docker (Desenvolvimento Nativo)
- **Node.js**: 22+ ([Instalar Node.js](https://nodejs.org/))
- **pnpm**: `npm install -g pnpm`
- **MySQL**: 8.0+ ([Instalar MySQL](https://dev.mysql.com/downloads/mysql/))

---

## 🚀 Quickstart com Docker (Recomendado)

### 1. Clone o repositório
```bash
git clone https://github.com/escritoriogabriel/Atto_App_New.git
cd Atto_App_New
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.docker.example .env.docker
# Customize conforme necessário (opcional)
```

### 3. Inicie a aplicação
```bash
docker-compose up
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **MySQL**: localhost:3306

### 4. Parar a aplicação
```bash
docker-compose down
```

---

## 💻 Desenvolvimento Nativo (Sem Docker)

### 1. Clone o repositório
```bash
git clone https://github.com/escritoriogabriel/Atto_App_New.git
cd Atto_App_New
```

### 2. Execute o script de setup
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 3. Configure o banco de dados

#### MySQL local
```bash
# Criar banco de dados
mysql -u root -p -e "CREATE DATABASE atto_db;"

# Importar schema
mysql -u root -p atto_db < scripts/init.sql
```

#### Ou use variáveis de ambiente
```bash
# Criar arquivo .env na raiz
cp .env.docker.example .env

# Editar .env com suas credenciais MySQL
# DATABASE_URL=mysql://user:password@localhost:3306/atto_db
```

### 4. Instale as dependências
```bash
pnpm install
```

### 5. Gere as migrations
```bash
pnpm drizzle-kit generate
```

### 6. Inicie em desenvolvimento
```bash
pnpm dev
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
# Iniciar em modo desenvolvimento
pnpm dev

# Iniciar apenas o frontend
pnpm dev:client

# Iniciar apenas o backend
pnpm dev:server
```

### Banco de Dados
```bash
# Gerar migrations
pnpm drizzle-kit generate

# Visualizar migrations
pnpm drizzle-kit studio

# Aplicar migrations
pnpm db:push
```

### Testes
```bash
# Executar todos os testes
pnpm test

# Modo watch
pnpm test --watch

# Com cobertura
pnpm test --coverage
```

### Build
```bash
# Build para produção
pnpm build

# Iniciar versão produção
pnpm start
```

### Linting
```bash
# Verificar formatação
pnpm format

# Verificar tipos TypeScript
pnpm check
```

---

## 📁 Estrutura do Projeto

```
Atto_App_New/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── hooks/            # Custom hooks
│   │   └── App.tsx           # Componente raiz
│   └── index.html
├── server/                    # Backend Node.js
│   ├── transcriptionService.ts # Lógica de transcrição
│   ├── uploadRoutes.ts        # Rotas HTTP
│   ├── routers.ts             # Procedimentos tRPC
│   ├── db.ts                  # Helpers de BD
│   └── _core/                 # Framework plumbing
├── drizzle/                   # Schema e migrations
│   ├── schema.ts              # Definição das tabelas
│   └── migrations/            # Arquivos SQL
├── scripts/                   # Scripts úteis
│   ├── setup.sh              # Setup inicial
│   └── init.sql              # Inicialização do BD
├── docker-compose.yml         # Orquestração Docker
├── Dockerfile                 # Imagem Docker
└── package.json              # Dependências
```

---

## 🔐 Configuração de Variáveis de Ambiente

### Desenvolvimento Local
Para desenvolvimento local sem Manus OAuth, use valores dummy:

```env
# .env ou .env.docker
NODE_ENV=development
DATABASE_URL=mysql://atto_user:atto_password@localhost:3306/atto_db

JWT_SECRET=dev-secret-key-change-in-production
VITE_APP_ID=local-dev
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:3000

BUILT_IN_FORGE_API_URL=http://localhost:3000
BUILT_IN_FORGE_API_KEY=dev-key
VITE_FRONTEND_FORGE_API_URL=http://localhost:3000
VITE_FRONTEND_FORGE_API_KEY=dev-key

OWNER_OPEN_ID=dev-owner
OWNER_NAME=Developer
```

### Produção (Manus)
Para deploy no Manus, as variáveis são configuradas automaticamente:
- `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` (Whisper API)
- `VITE_APP_ID`, `OAUTH_SERVER_URL` (OAuth)
- `JWT_SECRET` (Sessions)

---

## 🧪 Testes

### Executar Testes
```bash
pnpm test
```

### Testes Incluídos
- ✅ parseAudioReferences - Parsing de referências de áudio
- ✅ replaceAudioReferencesInChat - Substituição de referências
- ✅ auth.logout - Logout de usuário

### Adicionar Novos Testes
Crie arquivos `*.test.ts` em `server/`:

```typescript
import { describe, it, expect } from "vitest";

describe("Meu Teste", () => {
  it("deve fazer algo", () => {
    expect(true).toBe(true);
  });
});
```

---

## 🐛 Troubleshooting

### Erro: "Port already in use"
```bash
# Mudar porta no docker-compose.yml ou .env
# Ou matar processo na porta
lsof -ti:3000 | xargs kill -9
```

### Erro: "Cannot connect to database"
```bash
# Verificar se MySQL está rodando
docker ps  # Se usar Docker
mysql -u root -p  # Se usar MySQL local

# Verificar DATABASE_URL
echo $DATABASE_URL
```

### Erro: "Module not found"
```bash
# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Vite HMR not working"
```bash
# Reiniciar servidor
pnpm dev
```

### Erro: "CORS issues"
- Verificar `VITE_OAUTH_PORTAL_URL`
- Verificar se frontend e backend estão na mesma origem

---

## 📚 Recursos Úteis

- [React 19 Docs](https://react.dev)
- [tRPC Documentation](https://trpc.io)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Vitest](https://vitest.dev)

---

## 🚀 Deploy

### Deploy em Manus
1. Clique em "Publish" no Management UI
2. Escolha domínio customizado
3. Pronto!

### Deploy em Vercel
```bash
vercel --prod
```

### Deploy em Docker
```bash
docker build -t atto-app .
docker run -p 3000:3000 -e DATABASE_URL=... atto-app
```

---

## 💡 Tips

1. **Use pnpm em vez de npm** - Mais rápido e eficiente
2. **Ative o Drizzle Studio** - `pnpm drizzle-kit studio` para visualizar BD
3. **Rode testes antes de commitar** - `pnpm test`
4. **Verifique tipos** - `pnpm check` antes de deploy

---

## 📞 Suporte

- 📖 [Guia do Transcriber](./TRANSCRIBER_GUIDE.md)
- 📖 [README Principal](./README_ATTO.md)
- 🐛 [Issues no GitHub](https://github.com/escritoriogabriel/Atto_App_New/issues)

---

**Última atualização:** Maio 2024  
**Versão:** 1.0
