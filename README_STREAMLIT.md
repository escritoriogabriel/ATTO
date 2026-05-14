# 🎵 ATTO Transcriber - Streamlit Edition

Transcrição de áudios do WhatsApp com **Streamlit + FastAPI** - Tudo em um único comando!

---

## ⚡ Quickstart (30 segundos)

### 1️⃣ Instalar Dependências

```bash
pip install -r requirements-streamlit.txt
```

### 2️⃣ Rodar a Aplicação

```bash
python run_streamlit.py
```

### 3️⃣ Acessar

- **Frontend Streamlit**: http://localhost:8501
- **Backend API**: http://127.0.0.1:8000

---

## 📋 Estrutura

```
Atto_App_New/
├── streamlit_app/
│   ├── main.py              # Interface Streamlit
│   ├── backend_api.py       # API FastAPI
│   └── utils/               # Utilitários
├── run_streamlit.py         # Launcher (roda ambos)
├── requirements-streamlit.txt
└── README_STREAMLIT.md      # Este arquivo
```

---

## 🚀 Como Usar

### Transcrever Conversa do WhatsApp

1. **Exporte do WhatsApp:**
   - Abra o chat
   - Clique em ⋮ (três pontos)
   - "Mais" > "Exportar chat" > "Com mídia"

2. **Faça upload** do arquivo .zip

3. **Aguarde** a transcrição

4. **Baixe** o resultado

---

## 🎙️ Formatos Suportados

- **Áudio**: MP3, OGG, OPUS, WAV, M4A
- **Compactado**: ZIP (WhatsApp)

---

## 🌍 Idiomas

- 🇧🇷 Português
- 🇺🇸 English
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

---

## 🔧 Troubleshooting

### "ModuleNotFoundError"
```bash
pip install -r requirements-streamlit.txt
```

### "Connection refused"
Verifique se `run_streamlit.py` está rodando

### Porta já em uso
Mude em `streamlit_app/backend_api.py` e `streamlit_app/main.py`

---

## 📚 Mais Informações

- [README_ATTO.md](./README_ATTO.md) - Overview do projeto
- [TRANSCRIBER_GUIDE.md](./TRANSCRIBER_GUIDE.md) - Guia completo

---

**Versão:** 1.0  
**Status:** ✅ Pronto para Usar
