# ATTO - Hub de Aplicações Inteligentes

## 🎵 Transcriber: Transcreva Áudios do WhatsApp

**ATTO Transcriber** é a primeira aplicação do hub ATTO, uma plataforma elegante para transcrever áudios do WhatsApp e gerar relatórios com as transcrições integradas ao chat original.

### ✨ Funcionalidades

- 🎤 **Upload de Áudios:** Suporte para .mp3, .ogg, .opus, .wav, .m4a
- 📦 **Processamento de ZIP:** Exporte conversas do WhatsApp e processe automaticamente
- 🤖 **Transcrição Automática:** Powered by Whisper API
- 📄 **Geração de Relatórios:** Relatórios em .txt com transcrições integradas
- 📊 **Progresso em Tempo Real:** Acompanhe o processamento de cada áudio
- 🎨 **Interface Elegante:** Design refinado com Tailwind CSS + shadcn/ui
- 🔐 **Segurança:** Autenticação via Manus OAuth

### 🚀 Quick Start

#### Desenvolvimento Local

```bash
# Clone o repositório
gh repo clone escritoriogabriel/Atto_App_New
cd Atto_App_New

# Instale dependências
pnpm install

# Execute em desenvolvimento
pnpm dev

# Execute os testes
pnpm test
```

Acesse `http://localhost:3000` no seu navegador.

#### Deploy em Manus

1. Clique no botão **"Publish"** no Management UI
2. Escolha um domínio customizado ou use o padrão
3. Pronto! Sua aplicação está publicada

#### Deploy em Vercel

```bash
# Instale Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

### 📖 Como Usar

1. **Autentique-se** via Manus OAuth
2. **Selecione um arquivo:**
   - ZIP exportado do WhatsApp, ou
   - Áudio individual (.mp3, .ogg, etc.)
3. **Acompanhe o progresso** em tempo real
4. **Visualize e baixe** o relatório final

Para mais detalhes, veja [TRANSCRIBER_GUIDE.md](./TRANSCRIBER_GUIDE.md)

### 🏗️ Arquitetura

```
┌─────────────────────────────────────────────┐
│           Frontend (React 19)               │
│  - Landing Page (ATTO Hub)                  │
│  - Transcriber Page (DashboardLayout)       │
│  - Upload com Drag-and-Drop                 │
│  - Progresso em Tempo Real                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│     Backend (Express + tRPC)                │
│  - Upload Handler (multipart)               │
│  - ZIP Extractor (adm-zip)                  │
│  - Whisper Transcriber                      │
│  - Chat Parser & Replacer                   │
│  - Report Generator                         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      Database (MySQL/TiDB)                  │
│  - transcription_jobs                       │
│  - audio_files                              │
└─────────────────────────────────────────────┘
```

### 📊 Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19, Tailwind CSS 4, shadcn/ui |
| **Backend** | Node.js, Express 4, tRPC 11 |
| **Banco de Dados** | MySQL (TiDB) |
| **Transcrição** | Whisper API (Manus Built-in) |
| **Processamento** | adm-zip, multer |
| **Testes** | Vitest |

### 📁 Estrutura de Arquivos

```
Atto_App_New/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx      # Landing page ATTO Hub
│   │   │   └── Transcriber.tsx # Página principal do Transcriber
│   │   ├── components/       # Componentes reutilizáveis
│   │   └── App.tsx           # Rotas e layout
│   └── index.html
├── server/                    # Backend Node.js
│   ├── transcriptionService.ts # Lógica de transcrição
│   ├── uploadRoutes.ts        # Rotas HTTP de upload/download
│   ├── routers.ts             # Procedimentos tRPC
│   ├── db.ts                  # Helpers de banco de dados
│   └── _core/                 # Framework plumbing
├── drizzle/                   # Schema e migrations
│   └── schema.ts              # Definição das tabelas
├── TRANSCRIBER_GUIDE.md       # Guia completo de uso
└── package.json
```

### 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Modo watch
pnpm test --watch

# Com cobertura
pnpm test --coverage
```

**Testes incluídos:**
- ✅ parseAudioReferences (8 casos)
- ✅ replaceAudioReferencesInChat (4 casos)
- ✅ auth.logout (1 caso)

### 🔒 Segurança

- ✅ Autenticação obrigatória via Manus OAuth
- ✅ Validação de permissões por usuário
- ✅ Processamento seguro de arquivos no servidor
- ✅ Limite de tamanho de arquivo (500MB)
- ✅ Sanitização de nomes de arquivo

### 📝 Variáveis de Ambiente

As seguintes variáveis são configuradas automaticamente pelo Manus:

```env
DATABASE_URL=mysql://...
JWT_SECRET=...
VITE_APP_ID=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
```

### 🚀 Próximas Funcionalidades

- [ ] Suporte para múltiplos idiomas
- [ ] Edição de transcrições
- [ ] Exportação em PDF/DOCX
- [ ] Integração com Google Drive
- [ ] Análise de sentimento
- [ ] Mais apps no hub ATTO

### 📞 Suporte

- 📖 [Guia Completo](./TRANSCRIBER_GUIDE.md)
- 🐛 [Issues no GitHub](https://github.com/escritoriogabriel/Atto_App_New/issues)
- 💬 Discussões na comunidade

### 📄 Licença

MIT

### 🙏 Agradecimentos

Desenvolvido com ❤️ usando:
- [Manus](https://manus.im) - Plataforma de IA
- [React](https://react.dev) - UI Framework
- [tRPC](https://trpc.io) - Type-safe APIs
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - UI Components

---

**Versão:** 1.0  
**Status:** Produção  
**Última atualização:** Maio 2024
