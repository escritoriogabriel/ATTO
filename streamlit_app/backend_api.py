"""
ATTO Transcriber - Backend FastAPI
Processa transcrições de áudios do WhatsApp
"""

import os
import re
import zipfile
import tempfile
from pathlib import Path
from typing import Optional
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import adm_zip

app = FastAPI(title="ATTO Transcriber API", version="1.0.0")

# Configuração
UPLOAD_DIR = Path(tempfile.gettempdir()) / "atto_uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Tipos de áudio suportados
AUDIO_EXTENSIONS = {".mp3", ".ogg", ".opus", ".wav", ".m4a"}


class TranscriptionRequest(BaseModel):
    """Request para transcrição"""
    file_path: str
    language: Optional[str] = "pt"


class TranscriptionResponse(BaseModel):
    """Response de transcrição"""
    success: bool
    message: str
    transcription: Optional[str] = None
    file_name: Optional[str] = None


def transcribe_audio(audio_path: str, language: str = "pt") -> str:
    """
    Transcreve um arquivo de áudio usando Whisper API
    
    Args:
        audio_path: Caminho do arquivo de áudio
        language: Código de idioma (pt, en, es, etc)
    
    Returns:
        Texto transcrito
    """
    try:
        # Tentar usar OpenAI API se disponível
        from openai import OpenAI
        
        api_key = os.getenv("OPENAI_API_KEY", "")
        if not api_key:
            return f"[Transcrição simulada do arquivo: {Path(audio_path).name}]"
        
        client = OpenAI(api_key=api_key)
        
        with open(audio_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=language,
            )
        
        return transcript.text
    except:
        # Fallback: transcrição simulada
        return f"[Transcrição simulada do arquivo: {Path(audio_path).name}]"


def extract_audio_references(chat_content: str) -> list[tuple[int, str, str]]:
    """
    Extrai referências de áudio do arquivo _chat.txt
    
    Retorna lista de (índice, nome_arquivo, linha_original)
    """
    references = []
    lines = chat_content.split("\n")
    
    for i, line in enumerate(lines):
        # Padrão: <Media omitted> ou <Áudio omitido> ou referência a arquivo
        if "<Media omitted>" in line or "<Áudio omitido>" in line:
            references.append((i, f"audio_{len(references)+1}", line))
        # Procurar por padrões de referência a arquivo
        elif re.search(r"\.(mp3|ogg|opus|wav|m4a)", line, re.IGNORECASE):
            match = re.search(r"([a-zA-Z0-9_\-\.]+\.(mp3|ogg|opus|wav|m4a))", line, re.IGNORECASE)
            if match:
                filename = match.group(1)
                references.append((i, filename, line))
    
    return references


def replace_audio_references(chat_content: str, transcriptions: dict[str, str]) -> str:
    """
    Substitui referências de áudio pelas transcrições
    
    Args:
        chat_content: Conteúdo original do chat
        transcriptions: Dicionário {nome_arquivo: transcrição}
    
    Returns:
        Chat com transcrições integradas
    """
    lines = chat_content.split("\n")
    result_lines = []
    audio_counter = 1
    
    for line in lines:
        # Procurar por referências de áudio
        found_match = False
        
        for filename, transcription in transcriptions.items():
            if filename in line or "<Media omitted>" in line or "<Áudio omitido>" in line:
                # Substituir pela transcrição
                result_lines.append(f"áudio {audio_counter} ({filename}) transcrito:")
                result_lines.append(transcription)
                result_lines.append("")  # Linha em branco
                audio_counter += 1
                found_match = True
                break
        
        if not found_match:
            result_lines.append(line)
    
    return "\n".join(result_lines)


def process_whatsapp_zip(zip_path: str) -> tuple[str, dict[str, str]]:
    """
    Processa arquivo ZIP exportado do WhatsApp
    
    Retorna: (chat_content, transcriptions)
    """
    transcriptions = {}
    chat_content = ""
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            # Procurar por _chat.txt
            chat_files = [f for f in zip_ref.namelist() if f.endswith("_chat.txt")]
            
            if not chat_files:
                raise ValueError("Nenhum arquivo _chat.txt encontrado no ZIP")
            
            chat_file = chat_files[0]
            chat_content = zip_ref.read(chat_file).decode('utf-8')
            
            # Procurar por arquivos de áudio
            audio_files = [f for f in zip_ref.namelist() 
                          if Path(f).suffix.lower() in AUDIO_EXTENSIONS]
            
            # Extrair e transcrever áudios
            for audio_file in audio_files:
                audio_data = zip_ref.read(audio_file)
                
                # Salvar temporariamente
                temp_audio_path = UPLOAD_DIR / Path(audio_file).name
                temp_audio_path.write_bytes(audio_data)
                
                # Transcrever
                filename = Path(audio_file).name
                transcription = transcribe_audio(str(temp_audio_path))
                transcriptions[filename] = transcription
                
                # Limpar
                temp_audio_path.unlink()
        
        return chat_content, transcriptions
    
    except Exception as e:
        raise ValueError(f"Erro ao processar ZIP: {str(e)}")


@app.get("/health")
async def health():
    """Health check"""
    return {"status": "ok", "service": "ATTO Transcriber API"}


@app.post("/api/transcribe-zip")
async def transcribe_zip(file: UploadFile = File(...)):
    """
    Endpoint para transcrever ZIP do WhatsApp
    
    Retorna o chat com transcrições integradas
    """
    try:
        # Salvar arquivo enviado
        zip_path = UPLOAD_DIR / file.filename
        content = await file.read()
        zip_path.write_bytes(content)
        
        # Processar
        chat_content, transcriptions = process_whatsapp_zip(str(zip_path))
        
        # Substituir referências
        result_content = replace_audio_references(chat_content, transcriptions)
        
        # Salvar resultado
        result_filename = f"transcribed_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        result_path = UPLOAD_DIR / result_filename
        result_path.write_text(result_content, encoding='utf-8')
        
        # Limpar arquivo original
        zip_path.unlink()
        
        return {
            "success": True,
            "message": "Transcrição concluída",
            "file_name": result_filename,
            "audio_count": len(transcriptions),
            "preview": result_content[:500] + "..." if len(result_content) > 500 else result_content
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/transcribe-audio")
async def transcribe_audio_endpoint(file: UploadFile = File(...), language: str = "pt"):
    """
    Endpoint para transcrever um áudio individual
    """
    try:
        # Salvar arquivo
        audio_path = UPLOAD_DIR / file.filename
        content = await file.read()
        audio_path.write_bytes(content)
        
        # Transcrever
        transcription = transcribe_audio(str(audio_path), language)
        
        # Limpar
        audio_path.unlink()
        
        return {
            "success": True,
            "file_name": file.filename,
            "transcription": transcription
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/download/{filename}")
async def download_file(filename: str):
    """
    Endpoint para download de arquivo transcrito
    """
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="text/plain"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
