# 🐳 Guia Completo: Instalar Docker e Rodar ATTO Localmente

Este guia é específico e passo a passo para você conseguir rodar a aplicação no seu computador.

---

## 📋 Pré-requisitos

- **Windows 10/11 Pro, Enterprise ou Home (com WSL 2)**
- **macOS 11+** (Intel ou Apple Silicon)
- **Linux** (Ubuntu 20.04+, Debian, etc)
- **Mínimo 4GB de RAM disponível**
- **Mínimo 10GB de espaço em disco**

---

## 🪟 WINDOWS

### Passo 1: Instalar WSL 2 (Windows Subsystem for Linux)

1. Abra o **PowerShell como Administrador**
   - Clique em Iniciar
   - Digite "PowerShell"
   - Clique com botão direito e escolha "Executar como administrador"

2. Execute este comando:
```powershell
wsl --install
```

3. Reinicie seu computador

4. Após reiniciar, abra o PowerShell novamente e execute:
```powershell
wsl --set-default-version 2
```

### Passo 2: Instalar Docker Desktop

1. Acesse: https://www.docker.com/products/docker-desktop
2. Clique em "Download for Windows"
3. Abra o arquivo `Docker Desktop Installer.exe`
4. Siga o assistente de instalação (deixe as opções padrão)
5. Reinicie o computador quando solicitado

### Passo 3: Verificar Instalação

1. Abra o **PowerShell** (não precisa ser administrador)
2. Execute:
```powershell
docker --version
docker run hello-world
```

Se vir mensagens de sucesso, Docker está instalado! ✅

### Passo 4: Clonar o Repositório

1. Abra o **PowerShell**
2. Navegue até onde quer guardar o projeto:
```powershell
cd C:\Users\SeuUsuario\Projetos
```

3. Clone o repositório:
```powershell
git clone https://github.com/escritoriogabriel/Atto_App_New.git
cd Atto_App_New
```

### Passo 5: Rodar a Aplicação

1. No PowerShell, dentro da pasta `Atto_App_New`, execute:
```powershell
docker-compose up
```

2. Aguarde até ver mensagens como:
```
app_1    | [2026-05-14T21:00:00.000Z] Server running on http://localhost:3000/
```

3. Abra seu navegador e acesse:
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:3000

### Passo 6: Parar a Aplicação

Pressione `Ctrl + C` no PowerShell

---

## 🍎 macOS

### Passo 1: Instalar Homebrew (se não tiver)

1. Abra o **Terminal** (Cmd + Espaço, digite "Terminal")
2. Execute:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. Siga as instruções na tela

### Passo 2: Instalar Docker Desktop

**Opção A: Com Homebrew (mais fácil)**
```bash
brew install --cask docker
```

**Opção B: Manual**
1. Acesse: https://www.docker.com/products/docker-desktop
2. Clique em "Download for Mac"
3. Escolha a versão correta:
   - **Apple Silicon** (M1, M2, M3): `Docker.dmg` (Apple Silicon)
   - **Intel**: `Docker.dmg` (Intel Chip)
4. Abra o arquivo e arraste o Docker para Applications

### Passo 3: Iniciar Docker Desktop

1. Abra **Applications** > **Docker.app**
2. Aguarde até ver o ícone do Docker na barra superior
3. Abra o **Terminal** e execute:
```bash
docker --version
docker run hello-world
```

Se vir mensagens de sucesso, Docker está instalado! ✅

### Passo 4: Clonar o Repositório

1. No **Terminal**, navegue até onde quer guardar o projeto:
```bash
cd ~/Projetos  # ou qualquer pasta que preferir
```

2. Clone o repositório:
```bash
git clone https://github.com/escritoriogabriel/Atto_App_New.git
cd Atto_App_New
```

### Passo 5: Rodar a Aplicação

1. No Terminal, dentro da pasta `Atto_App_New`, execute:
```bash
docker-compose up
```

2. Aguarde até ver mensagens como:
```
app_1    | [2026-05-14T21:00:00.000Z] Server running on http://localhost:3000/
```

3. Abra seu navegador e acesse:
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:3000

### Passo 6: Parar a Aplicação

Pressione `Ctrl + C` no Terminal

---

## 🐧 LINUX (Ubuntu/Debian)

### Passo 1: Instalar Docker

1. Abra o **Terminal** (Ctrl + Alt + T)
2. Execute os comandos abaixo um por um:

```bash
# Atualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar repositório do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar seu usuário ao grupo docker (para não precisar de sudo)
sudo usermod -aG docker $USER
newgrp docker
```

3. Reinicie o computador (ou execute: `newgrp docker`)

### Passo 2: Verificar Instalação

```bash
docker --version
docker run hello-world
```

Se vir mensagens de sucesso, Docker está instalado! ✅

### Passo 3: Instalar Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### Passo 4: Clonar o Repositório

```bash
# Criar pasta de projetos (opcional)
mkdir -p ~/Projetos
cd ~/Projetos

# Clonar repositório
git clone https://github.com/escritoriogabriel/Atto_App_New.git
cd Atto_App_New
```

### Passo 5: Rodar a Aplicação

```bash
docker-compose up
```

Aguarde até ver mensagens como:
```
app_1    | [2026-05-14T21:00:00.000Z] Server running on http://localhost:3000/
```

Abra seu navegador e acesse:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### Passo 6: Parar a Aplicação

Pressione `Ctrl + C` no Terminal

---

## 🎯 Comandos Úteis (Todos os SOs)

### Ver logs em tempo real
```bash
docker-compose logs -f
```

### Ver apenas logs da aplicação
```bash
docker-compose logs -f app
```

### Ver apenas logs do MySQL
```bash
docker-compose logs -f mysql
```

### Parar containers sem remover
```bash
docker-compose stop
```

### Remover containers (libera espaço)
```bash
docker-compose down
```

### Remover tudo (containers, volumes, networks)
```bash
docker-compose down -v
```

### Reconstruir imagem
```bash
docker-compose build --no-cache
```

### Executar comando dentro do container
```bash
docker-compose exec app pnpm test
```

### Acessar terminal do container
```bash
docker-compose exec app sh
```

---

## 🔧 Troubleshooting

### ❌ "Port 3000 already in use"

**Windows/macOS:**
```powershell
# PowerShell (Windows)
netstat -ano | findstr :3000

# Terminal (macOS)
lsof -i :3000
```

**Linux:**
```bash
lsof -i :3000
```

Depois mate o processo ou mude a porta no `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Mudou de 3000 para 3001
```

### ❌ "Cannot connect to Docker daemon"

**Windows/macOS:**
- Abra Docker Desktop e aguarde iniciar

**Linux:**
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
```

### ❌ "MySQL connection refused"

Aguarde um pouco (MySQL demora para iniciar):
```bash
docker-compose down
docker-compose up
```

### ❌ "Permission denied" (Linux)

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### ❌ "Out of disk space"

```bash
docker system prune -a
```

---

## 📊 Verificar Tudo Está Funcionando

1. **Frontend carregando?**
   - Abra http://localhost:5173
   - Você deve ver a página do ATTO com o logo

2. **Backend respondendo?**
   - Abra http://localhost:3000/api/health
   - Você deve ver uma resposta JSON

3. **MySQL funcionando?**
   - Execute: `docker-compose exec mysql mysql -u atto_user -p -e "SELECT 1;"`
   - Digite a senha: `atto_password`
   - Você deve ver `1` como resultado

---

## 🚀 Próximos Passos

Após rodar com sucesso:

1. **Acessar o Transcriber:**
   - Clique em "Entrar" na página inicial
   - Você será redirecionado para fazer login

2. **Testar Upload:**
   - Clique em "Transcriber" no menu
   - Faça upload de um arquivo .mp3 ou .ogg
   - Veja a transcrição em tempo real

3. **Ver Banco de Dados:**
   ```bash
   docker-compose exec app pnpm drizzle-kit studio
   ```
   - Abra http://localhost:3000
   - Você pode visualizar e editar dados

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:

1. Verifique se Docker está rodando
2. Tente: `docker-compose down && docker-compose up`
3. Verifique os logs: `docker-compose logs`
4. Procure no arquivo [DEVELOPMENT.md](./DEVELOPMENT.md)

---

**Versão:** 1.0  
**Última atualização:** Maio 2024
