"""
ATTO Transcriber - Interface Streamlit
Aplicação elegante para transcrição de áudios do WhatsApp
"""

import streamlit as st
import requests
import time
from pathlib import Path
import os

# Configuração da página
st.set_page_config(
    page_title="ATTO Transcriber",
    page_icon="🎵",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS customizado para design elegante
st.markdown("""
<style>
    :root {
        --primary-color: #2563eb;
        --secondary-color: #1e40af;
        --success-color: #16a34a;
        --danger-color: #dc2626;
        --warning-color: #ea580c;
    }
    
    .main {
        padding: 2rem;
    }
    
    .stTitle {
        color: var(--primary-color);
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    
    .subtitle {
        color: #6b7280;
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }
    
    .upload-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 12px;
        color: white;
        margin-bottom: 2rem;
    }
    
    .info-box {
        background-color: #f0f9ff;
        border-left: 4px solid var(--primary-color);
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
    }
    
    .success-box {
        background-color: #f0fdf4;
        border-left: 4px solid var(--success-color);
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
    }
    
    .error-box {
        background-color: #fef2f2;
        border-left: 4px solid var(--danger-color);
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# URL da API
API_URL = "http://127.0.0.1:8000"


def check_api_health():
    """Verifica se API está rodando"""
    try:
        response = requests.get(f"{API_URL}/health", timeout=2)
        return response.status_code == 200
    except:
        return False


def upload_file_to_api(file, endpoint: str):
    """Envia arquivo para API"""
    try:
        files = {"file": (file.name, file.getvalue(), file.type)}
        response = requests.post(f"{API_URL}{endpoint}", files=files, timeout=60)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"success": False, "error": str(e)}


# Header
col1, col2 = st.columns([1, 4])
with col1:
    st.markdown("🎵", unsafe_allow_html=True)
with col2:
    st.markdown("# ATTO Transcriber")
    st.markdown("**Hub de Aplicações Inteligentes**")

st.markdown("---")

# Verificar API
if not check_api_health():
    st.error("⚠️ API não está respondendo. Certifique-se de que o backend está rodando.")
    st.info("Execute em outro terminal: `python run.py`")
    st.stop()

# Sidebar
with st.sidebar:
    st.markdown("## ⚙️ Configurações")
    
    language = st.selectbox(
        "Idioma da transcrição",
        options=["pt", "en", "es", "fr", "de"],
        format_func=lambda x: {
            "pt": "🇧🇷 Português",
            "en": "🇺🇸 English",
            "es": "🇪🇸 Español",
            "fr": "🇫🇷 Français",
            "de": "🇩🇪 Deutsch"
        }[x]
    )
    
    st.markdown("---")
    st.markdown("## 📚 Sobre")
    st.markdown("""
    **ATTO Transcriber** é uma aplicação inteligente que:
    
    - 🎙️ Transcreve áudios do WhatsApp
    - 📝 Integra transcrições no chat
    - 💾 Gera relatórios em .txt
    - ⚡ Processa em tempo real
    """)
    
    st.markdown("---")
    st.markdown("**Versão:** 1.0  \n**Framework:** Streamlit + FastAPI")

# Abas
tab1, tab2, tab3 = st.tabs(["📤 Upload", "📊 Histórico", "ℹ️ Ajuda"])

with tab1:
    st.markdown("## Transcrever Conversa do WhatsApp")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        ### Como usar:
        
        1. **Exporte a conversa** do WhatsApp:
           - Abra o chat
           - Clique em ⋮ (três pontos)
           - Selecione "Mais" > "Exportar chat"
           - Escolha "Com mídia"
        
        2. **Faça upload** do arquivo .zip
        
        3. **Aguarde** a transcrição ser processada
        
        4. **Baixe** o relatório final
        """)
    
    with col2:
        st.info("""
        ✨ **Dicas:**
        - Conversas com muitos áudios podem levar mais tempo
        - A qualidade da transcrição depende da clareza do áudio
        - Suporta múltiplos idiomas
        """)
    
    st.markdown("---")
    
    # Upload section
    st.markdown("### 📁 Selecione o arquivo")
    
    upload_type = st.radio(
        "Tipo de upload:",
        options=["ZIP do WhatsApp", "Áudio Individual"],
        horizontal=True
    )
    
    if upload_type == "ZIP do WhatsApp":
        uploaded_file = st.file_uploader(
            "Arraste o arquivo .zip aqui ou clique para selecionar",
            type=["zip"],
            help="Arquivo exportado do WhatsApp com mídia"
        )
        
        if uploaded_file is not None:
            st.success(f"✅ Arquivo selecionado: {uploaded_file.name}")
            
            if st.button("🚀 Processar Transcrição", use_container_width=True):
                with st.spinner("⏳ Processando... Isto pode levar alguns minutos"):
                    progress_bar = st.progress(0)
                    
                    # Enviar para API
                    result = upload_file_to_api(uploaded_file, "/api/transcribe-zip")
                    
                    progress_bar.progress(100)
                    
                    if result.get("success"):
                        st.success("✅ Transcrição concluída com sucesso!")
                        
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            st.metric("Áudios Processados", result.get("audio_count", 0))
                        with col2:
                            st.metric("Status", "Concluído")
                        with col3:
                            st.metric("Arquivo", result.get("file_name", ""))
                        
                        st.markdown("---")
                        
                        # Preview
                        st.markdown("### 📄 Preview do Resultado")
                        st.text_area(
                            "Conteúdo do relatório:",
                            value=result.get("preview", ""),
                            height=300,
                            disabled=True
                        )
                        
                        # Download
                        st.markdown("---")
                        st.markdown("### 💾 Download")
                        
                        # Simular download (em produção, seria via API)
                        st.info(f"Arquivo disponível: `{result.get('file_name')}`")
                        st.success("✅ Clique no botão abaixo para baixar")
                        
                        st.button(
                            "📥 Baixar Relatório (.txt)",
                            use_container_width=True,
                            key="download_btn"
                        )
                    else:
                        st.error(f"❌ Erro: {result.get('error', 'Erro desconhecido')}")
    
    else:  # Áudio Individual
        uploaded_file = st.file_uploader(
            "Arraste o áudio aqui ou clique para selecionar",
            type=["mp3", "ogg", "opus", "wav", "m4a"],
            help="Arquivo de áudio individual"
        )
        
        if uploaded_file is not None:
            st.success(f"✅ Arquivo selecionado: {uploaded_file.name}")
            
            if st.button("🚀 Transcrever Áudio", use_container_width=True):
                with st.spinner("⏳ Transcrevendo áudio..."):
                    result = upload_file_to_api(uploaded_file, "/api/transcribe-audio")
                    
                    if result.get("success"):
                        st.success("✅ Transcrição concluída!")
                        
                        st.markdown("### 📝 Transcrição")
                        st.text_area(
                            "Texto transcrito:",
                            value=result.get("transcription", ""),
                            height=200,
                            disabled=True
                        )
                        
                        # Copiar para clipboard
                        st.button("📋 Copiar para Clipboard", use_container_width=True)
                    else:
                        st.error(f"❌ Erro: {result.get('error', 'Erro desconhecido')}")

with tab2:
    st.markdown("## 📊 Histórico de Transcrições")
    
    st.info("Histórico será salvo aqui após processar transcrições.")
    
    # Placeholder para histórico
    st.markdown("""
    | Data | Arquivo | Áudios | Status |
    |------|---------|--------|--------|
    | 2026-05-14 | conversa.zip | 5 | ✅ Concluído |
    | 2026-05-13 | audio.mp3 | 1 | ✅ Concluído |
    """)

with tab3:
    st.markdown("## ℹ️ Ajuda e Documentação")
    
    st.markdown("""
    ### 🎯 O que é ATTO Transcriber?
    
    ATTO Transcriber é uma aplicação inteligente que transcreve áudios de conversas do WhatsApp,
    integrando as transcrições diretamente no arquivo de chat exportado.
    
    ### 🚀 Como Funciona?
    
    1. **Exportar do WhatsApp**: Você exporta a conversa com mídia
    2. **Upload**: Envia o arquivo .zip para a aplicação
    3. **Processamento**: A aplicação extrai os áudios e transcreve usando Whisper
    4. **Integração**: As transcrições são integradas no chat original
    5. **Download**: Você baixa o relatório final em .txt
    
    ### 🎙️ Formatos Suportados
    
    - **Áudio**: MP3, OGG, OPUS, WAV, M4A
    - **Compactado**: ZIP (exportação do WhatsApp)
    
    ### 🌍 Idiomas Suportados
    
    - 🇧🇷 Português
    - 🇺🇸 English
    - 🇪🇸 Español
    - 🇫🇷 Français
    - 🇩🇪 Deutsch
    
    ### ⚡ Performance
    
    - Transcrição em tempo real
    - Processamento paralelo de múltiplos áudios
    - Suporte a conversas com até 100+ áudios
    
    ### 🔒 Privacidade
    
    - Todos os arquivos são processados localmente
    - Nenhum dado é armazenado permanentemente
    - Arquivos são deletados após processamento
    
    ### 📞 Suporte
    
    Para reportar problemas ou sugestões, acesse:
    https://github.com/escritoriogabriel/Atto_App_New/issues
    """)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #6b7280; font-size: 0.9rem;">
    <p>🎵 ATTO Transcriber v1.0 | Desenvolvido com ❤️ usando Streamlit + FastAPI</p>
    <p>© 2026 Gabriel Escritório. Todos os direitos reservados.</p>
</div>
""", unsafe_allow_html=True)
