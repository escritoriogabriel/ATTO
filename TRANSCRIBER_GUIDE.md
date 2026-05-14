# ATTO Transcriber - Guia de Uso e Deploy

## 📋 Visão Geral

O **ATTO Transcriber** é uma aplicação web elegante para transcrever áudios do WhatsApp e gerar relatórios com as transcrições integradas ao chat original. Faz parte do hub ATTO de aplicações inteligentes.

## 🚀 Como Usar

### 1. Acessar a Aplicação

- Acesse a URL da aplicação (local ou deploy)
- Clique em "Entrar" para autenticar via Manus OAuth
- Você será redirecionado ao dashboard

### 2. Usar o Transcriber

#### Opção A: Upload de Arquivo ZIP do WhatsApp

1. Exporte uma conversa do WhatsApp como arquivo ZIP
2. Na página do Transcriber, arraste o arquivo ZIP ou clique para selecionar
3. A aplicação irá:
   - Extrair os áudios (.opus, .ogg, .mp3)
   - Transcrever cada áudio usando Whisper
   - Processar o arquivo `_chat.txt`
   - Substituir as referências `<Media omitted>` pelas transcrições
   - Gerar um relatório final em `.txt`

#### Opção B: Upload de Áudio Individual

1. Selecione um arquivo de áudio (.mp3, .ogg, .opus, .wav, .m4a)
2. A aplicação irá:
   - Transcrever o áudio
   - Gerar um relatório simples com a transcrição

### 3. Acompanhar o Progresso

- Uma barra de progresso mostra o status do processamento
- O histórico de transcrições é atualizado em tempo real
- Status possíveis: **Pendente** → **Processando** → **Concluído** ou **Erro**

### 4. Visualizar e Baixar Relatórios

- Clique em **"Visualizar"** para ver o conteúdo do relatório no modal
- Clique em **"Baixar Relatório"** para salvar o arquivo `.txt`
- O arquivo contém o chat original com as transcrições integradas

## 📊 Formato do Relatório

Para arquivos ZIP do WhatsApp:
```
[10/05/2024, 14:30:00] Usuário: Olá!
áudio 1 (audio_2024-05-10_14-30-00.opus) transcrito:
Olá, como você está?

[10/05/2024, 14:31:00] Outro Usuário: Tudo bem!
```

Para áudios individuais:
```
Transcrição de: audio_sample.mp3

áudio 1 (audio_sample.mp3) transcrito:
Conteúdo da transcrição aqui...
```

## 🛠️ Deploy

### Deploy Local

1. **Clone o repositório:**
   ```bash
   gh repo clone escritoriogabriel/Atto_App_New
   cd Atto_App_New
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   - O projeto usa Manus OAuth (configurado automaticamente)
   - Certifique-se de ter `DATABASE_URL` configurado

4. **Execute em desenvolvimento:**
   ```bash
   pnpm dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

5. **Execute os testes:**
   ```bash
   pnpm test
   ```

### Deploy em Vercel

1. **Prepare o repositório:**
   - Certifique-se de que o código está no GitHub
   - Todas as dependências estão no `package.json`

2. **Conecte ao Vercel:**
   ```bash
   pnpm add -g vercel
   vercel
   ```

3. **Configure as variáveis de ambiente no Vercel:**
   - `DATABASE_URL`: String de conexão MySQL
   - `JWT_SECRET`: Chave para sessões (gerada automaticamente)
   - Outras variáveis OAuth (configuradas automaticamente)

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Deploy em Manus (Recomendado)

A aplicação está pronta para deploy no Manus:

1. Clique no botão **"Publish"** no Management UI
2. Escolha um domínio customizado ou use o padrão
3. A aplicação será publicada automaticamente

## ⚙️ Configuração Técnica

### Stack Tecnológico

- **Frontend:** React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Node.js, Express, tRPC 11
- **Banco de Dados:** MySQL (TiDB)
- **Transcrição:** Whisper API (Manus Built-in)
- **Processamento:** adm-zip, multer

### Limites

- **Tamanho máximo de arquivo:** 500MB
- **Formatos de áudio suportados:** .mp3, .ogg, .opus, .wav, .m4a
- **Formatos ZIP suportados:** Exportações do WhatsApp

### Estrutura de Banco de Dados

#### Tabela: `transcription_jobs`
```sql
- id: INT PRIMARY KEY
- userId: INT (referência ao usuário)
- fileName: VARCHAR (nome do arquivo)
- fileType: ENUM ('zip', 'audio')
- status: ENUM ('pending', 'processing', 'completed', 'failed')
- totalAudios: INT
- processedAudios: INT
- reportContent: LONGTEXT
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### Tabela: `audio_files`
```sql
- id: INT PRIMARY KEY
- jobId: INT (referência ao job)
- fileName: VARCHAR
- status: ENUM ('pending', 'transcribing', 'completed', 'failed')
- transcription: LONGTEXT
- createdAt: TIMESTAMP
```

## 🔒 Segurança

- ✅ Autenticação via Manus OAuth
- ✅ Apenas usuários autenticados podem fazer upload
- ✅ Usuários só podem acessar seus próprios jobs
- ✅ Arquivos são processados no servidor (não expostos ao cliente)
- ✅ Relatórios são armazenados de forma segura

## 📝 Endpoints da API

### Upload
```
POST /api/upload
Content-Type: multipart/form-data
Body: { file: File }
Response: { jobId: number, status: string }
```

### Download
```
GET /api/download/:jobId
Response: arquivo .txt (attachment)
```

### tRPC Endpoints
```
trpc.transcriber.getJobs()
trpc.transcriber.getJob(jobId)
trpc.transcriber.getProgress(jobId)
```

## 🐛 Troubleshooting

### Erro: "Upload failed"
- Verifique se o arquivo é válido
- Certifique-se de que o tamanho está dentro do limite (500MB)
- Verifique a conexão com o servidor

### Erro: "Transcrição falhou"
- Verifique se o áudio está em um formato suportado
- Tente novamente - pode ser um erro temporário da API Whisper
- Verifique os logs do servidor

### Erro: "Banco de dados não disponível"
- Verifique se `DATABASE_URL` está configurado
- Certifique-se de que o banco de dados está acessível
- Verifique a conexão de rede

## 📞 Suporte

Para reportar bugs ou sugerir melhorias:
1. Abra uma issue no repositório GitHub
2. Descreva o problema com detalhes
3. Inclua logs e screenshots se possível

## 🎯 Roadmap Futuro

- [ ] Suporte para múltiplos idiomas na transcrição
- [ ] Edição de transcrições antes de gerar relatório
- [ ] Exportação em múltiplos formatos (PDF, DOCX)
- [ ] Integração com Google Drive/OneDrive
- [ ] Análise de sentimento dos áudios
- [ ] Mais aplicações no hub ATTO

---

**Versão:** 1.0  
**Última atualização:** Maio 2024  
**Status:** Produção
