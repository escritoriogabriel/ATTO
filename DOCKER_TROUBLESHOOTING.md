# 🔧 Docker Troubleshooting - Windows

## ❌ Erro: "unable to get image 'atto-app': failed to connect to the docker API"

Este erro significa que **Docker Desktop não está rodando**.

---

## ✅ Solução Rápida (5 minutos)

### Passo 1: Iniciar Docker Desktop

1. Clique no **Iniciar do Windows** (canto inferior esquerdo)
2. Digite: `Docker Desktop`
3. Clique em "Docker Desktop" para abrir
4. Aguarde até ver o ícone do Docker na barra de tarefas (canto inferior direito)
5. Aguarde aparecer a mensagem "Docker Desktop is running"

### Passo 2: Verificar se está funcionando

Abra o **PowerShell** e execute:
```powershell
docker --version
```

Você deve ver algo como:
```
Docker version 26.1.0, build d260a54
```

### Passo 3: Tentar novamente

No PowerShell, dentro da pasta `Atto_App_New`, execute:
```powershell
docker-compose up
```

---

## 🚨 Se ainda não funcionar, siga estes passos:

### Passo 1: Verificar se WSL 2 está instalado

```powershell
wsl --list --verbose
```

Você deve ver algo como:
```
  NAME      STATE           VERSION
* Ubuntu    Running         2
```

Se não vir nada, instale WSL 2:
```powershell
wsl --install
```

Reinicie o computador.

### Passo 2: Reiniciar o Docker Desktop

1. Clique com botão direito no ícone do Docker (barra de tarefas)
2. Clique em "Quit Docker Desktop"
3. Aguarde fechar completamente
4. Abra Docker Desktop novamente
5. Aguarde iniciar (pode levar 1-2 minutos)

### Passo 3: Limpar cache do Docker

```powershell
docker system prune -a
```

Digite `y` quando perguntado.

### Passo 4: Tentar novamente

```powershell
docker-compose up
```

---

## 🔍 Diagnóstico Avançado

### Verificar se Docker está realmente rodando

```powershell
docker ps
```

Se funcionar, você verá uma lista (vazia ou com containers).

Se der erro, Docker não está rodando.

### Ver logs do Docker Desktop

1. Clique com botão direito no ícone do Docker
2. Clique em "Troubleshoot"
3. Veja os logs

### Reiniciar Docker completamente

```powershell
# Parar Docker
net stop com.docker.service

# Iniciar Docker
net start com.docker.service
```

---

## 💾 Se nada funcionar, reinstale Docker

### Opção 1: Desinstalar e Reinstalar (Recomendado)

1. Clique em **Iniciar** > **Configurações** > **Aplicativos** > **Aplicativos e recursos**
2. Procure por "Docker Desktop"
3. Clique em "Docker Desktop" e depois em "Desinstalar"
4. Siga o assistente
5. **Reinicie o computador**
6. Baixe novamente em: https://www.docker.com/products/docker-desktop
7. Instale novamente

### Opção 2: Usar Docker via WSL 2 (Alternativo)

Se Docker Desktop não funcionar, você pode usar Docker diretamente no WSL 2:

```powershell
# Abrir WSL
wsl

# Dentro do WSL, instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Sair do WSL
exit

# Voltar para PowerShell e tentar novamente
docker-compose up
```

---

## ✅ Checklist de Verificação

- [ ] Docker Desktop está instalado
- [ ] Docker Desktop está rodando (ícone na barra de tarefas)
- [ ] `docker --version` funciona
- [ ] `docker ps` funciona
- [ ] WSL 2 está instalado (`wsl --list --verbose`)
- [ ] Você está na pasta `Atto_App_New`
- [ ] `docker-compose up` foi executado

---

## 📊 Esperado vs Erro

### ✅ Esperado (sucesso)
```powershell
PS C:\Users\gabri\OneDrive\Documentos\GitHub\Atto> docker-compose up
[+] Running 2/2
 ✔ Container atto-mysql   Created
 ✔ Container atto-app     Created
Attaching to atto-mysql, atto-app
atto-mysql   | 2026-05-14 22:01:00+00:00 [Note] [Entrypoint]: MySQL Server initialized
atto-app     | [2026-05-14T22:01:05.000Z] Server running on http://localhost:3000/
```

### ❌ Erro (Docker não rodando)
```powershell
unable to get image 'atto-app': failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine
```

---

## 🎯 Próximos Passos Após Funcionar

Quando você ver:
```
atto-app     | [2026-05-14T22:01:05.000Z] Server running on http://localhost:3000/
```

Abra seu navegador e acesse:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## 📞 Ainda não funciona?

1. Verifique se tem **4GB de RAM disponível**
2. Verifique se tem **10GB de espaço em disco**
3. Tente em outro navegador (Chrome, Firefox, Edge)
4. Reinicie o computador completamente
5. Procure em [INSTALL_DOCKER.md](./INSTALL_DOCKER.md) por mais detalhes

---

**Versão:** 1.0  
**Última atualização:** Maio 2024
