# 🔧 Solução: Erro "input/output error" no Docker

## ❌ Erro Recebido

```
Error response from daemon: write /var/lib/desktop-containerd/daemon/io.containerd.metadata.v1.bolt/meta.db: input/output error
```

---

## ✅ Solução (Siga em Ordem)

### Solução 1: Limpar Cache do Docker (TENTE PRIMEIRO)

Abra **PowerShell** e execute:

```powershell
docker system prune -a --volumes
```

Digite `y` quando perguntado.

Depois tente novamente:
```powershell
docker-compose up
```

---

### Solução 2: Reiniciar Docker Desktop

1. Clique com botão direito no ícone do Docker (barra de tarefas)
2. Clique em **"Quit Docker Desktop"**
3. Aguarde fechar completamente (pode levar 30 segundos)
4. Abra Docker Desktop novamente
5. Aguarde iniciar (1-2 minutos)
6. Tente novamente:
```powershell
docker-compose up
```

---

### Solução 3: Resetar Docker Desktop

1. Abra **Docker Desktop**
2. Clique no ícone de engrenagem (Settings) no canto superior direito
3. Vá para **"Troubleshoot"**
4. Clique em **"Clean / Purge data"**
5. Clique em **"Reset"**
6. Aguarde reiniciar
7. Tente novamente:
```powershell
docker-compose up
```

---

### Solução 4: Verificar Espaço em Disco

O erro pode ser causado por **falta de espaço em disco**.

Abra **PowerShell** e execute:

```powershell
Get-Volume
```

Procure pela unidade onde Windows está instalado (geralmente `C:`).

**Você precisa de pelo menos 10GB livres.**

Se não tiver:
1. Delete arquivos desnecessários
2. Limpe a Lixeira
3. Execute limpeza de disco:
```powershell
cleanmgr
```

---

### Solução 5: Verificar Permissões de Pasta

O erro pode ser causado por **permissões de pasta**.

1. Clique com botão direito na pasta `Atto_App_New`
2. Clique em **"Propriedades"**
3. Vá para a aba **"Segurança"**
4. Clique em **"Editar"**
5. Selecione seu usuário
6. Marque **"Controle Total"**
7. Clique em **"Aplicar"** e **"OK"**

Tente novamente:
```powershell
docker-compose up
```

---

### Solução 6: Mover Projeto para Outra Pasta

O OneDrive pode estar causando problemas de sincronização.

**Mude o projeto para uma pasta fora do OneDrive:**

```powershell
# Copiar projeto
Copy-Item -Path "C:\Users\gabri\OneDrive\Documentos\GitHub\Atto" -Destination "C:\Users\gabri\Projetos\Atto" -Recurse

# Entrar na nova pasta
cd C:\Users\gabri\Projetos\Atto

# Tentar novamente
docker-compose up
```

---

### Solução 7: Reinstalar Docker Desktop

Se nada funcionar, reinstale:

1. Abra **Configurações** > **Aplicativos** > **Aplicativos e recursos**
2. Procure por **"Docker Desktop"**
3. Clique em **"Desinstalar"**
4. Siga o assistente
5. **Reinicie o computador**
6. Baixe novamente: https://www.docker.com/products/docker-desktop
7. Instale novamente

---

## 🎯 Ordem Recomendada de Tentativas

1. ✅ Limpar cache: `docker system prune -a --volumes`
2. ✅ Reiniciar Docker Desktop
3. ✅ Resetar Docker Desktop (Troubleshoot > Reset)
4. ✅ Verificar espaço em disco
5. ✅ Verificar permissões de pasta
6. ✅ Mover projeto fora do OneDrive
7. ✅ Reinstalar Docker Desktop

---

## 📊 Checklist

- [ ] Espaço em disco: **Mínimo 10GB livres**
- [ ] Pasta fora do OneDrive/Google Drive/Dropbox
- [ ] Docker Desktop rodando (ícone na barra de tarefas)
- [ ] `docker --version` funciona
- [ ] `docker ps` funciona
- [ ] Cache limpo: `docker system prune -a --volumes`

---

## 🚀 Se Funcionar

Você deve ver:
```
[+] Running 2/2
 ✔ Container atto-mysql   Created
 ✔ Container atto-app     Created
atto-app     | Server running on http://localhost:3000/
```

Acesse:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## 💡 Alternativa: Rodar sem Docker

Se Docker continuar com problemas, você pode rodar **sem Docker** localmente:

```powershell
# Instalar dependências
pnpm install

# Iniciar
pnpm dev
```

(Você precisará ter MySQL rodando localmente)

---

**Tente a Solução 1 primeiro e me avise se funciona!** 🚀
