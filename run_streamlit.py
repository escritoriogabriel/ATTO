#!/usr/bin/env python3
"""
ATTO Transcriber - Launcher Unificado
Roda FastAPI + Streamlit simultaneamente
"""

import subprocess
import time
import sys
import os
from pathlib import Path

# Cores para output
GREEN = '\033[92m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
RED = '\033[91m'
RESET = '\033[0m'
BOLD = '\033[1m'


def print_header():
    """Imprime header da aplicação"""
    print(f"\n{BOLD}{BLUE}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║         🎵 ATTO TRANSCRIBER - Streamlit + FastAPI         ║")
    print("║                    v1.0 - Local Edition                    ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{RESET}\n")


def print_info(message: str):
    """Imprime mensagem de informação"""
    print(f"{BLUE}ℹ️  {message}{RESET}")


def print_success(message: str):
    """Imprime mensagem de sucesso"""
    print(f"{GREEN}✅ {message}{RESET}")


def print_warning(message: str):
    """Imprime mensagem de aviso"""
    print(f"{YELLOW}⚠️  {message}{RESET}")


def print_error(message: str):
    """Imprime mensagem de erro"""
    print(f"{RED}❌ {message}{RESET}")


def check_requirements():
    """Verifica se todas as dependências estão instaladas"""
    print_info("Verificando dependências...")
    
    required_packages = [
        "streamlit",
        "fastapi",
        "uvicorn",
        "requests",
        "adm_zip",
        "pydantic"
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
        except ImportError:
            missing.append(package)
    
    if missing:
        print_error(f"Dependências faltando: {', '.join(missing)}")
        print_info("Execute: pip install -r requirements-streamlit.txt")
        return False
    
    print_success("Todas as dependências estão instaladas!")
    return True


def run_backend():
    """Roda o backend FastAPI"""
    print_info("Iniciando FastAPI Backend...")
    
    try:
        backend_path = Path(__file__).parent / "streamlit_app" / "backend_api.py"
        
        process = subprocess.Popen(
            [sys.executable, str(backend_path)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Aguardar inicialização
        time.sleep(3)
        
        if process.poll() is None:
            print_success("FastAPI rodando em http://127.0.0.1:8000")
            return process
        else:
            stdout, stderr = process.communicate()
            print_error(f"Erro ao iniciar FastAPI: {stderr}")
            return None
    
    except Exception as e:
        print_error(f"Erro ao iniciar FastAPI: {str(e)}")
        return None


def run_streamlit():
    """Roda o frontend Streamlit"""
    print_info("Iniciando Streamlit Frontend...")
    
    try:
        # Aguardar um pouco para FastAPI iniciar
        time.sleep(2)
        
        streamlit_path = Path(__file__).parent / "streamlit_app" / "main.py"
        
        subprocess.run([
            sys.executable, "-m", "streamlit", "run",
            str(streamlit_path),
            "--logger.level=warning",
            "--client.showErrorDetails=false"
        ])
    
    except Exception as e:
        print_error(f"Erro ao iniciar Streamlit: {str(e)}")


def main():
    """Função principal"""
    os.chdir(Path(__file__).parent)
    
    print_header()
    
    # Verificar dependências
    if not check_requirements():
        sys.exit(1)
    
    print("\n" + "="*60)
    print_info("Iniciando aplicação...")
    print("="*60 + "\n")
    
    # Iniciar backend
    backend_process = run_backend()
    
    if backend_process is None:
        print_error("Falha ao iniciar backend. Abortando.")
        sys.exit(1)
    
    try:
        # Iniciar Streamlit (bloqueia)
        run_streamlit()
    
    except KeyboardInterrupt:
        print_warning("\nInterrompido pelo usuário")
    
    finally:
        # Limpar
        print_info("Encerrando aplicação...")
        
        if backend_process and backend_process.poll() is None:
            backend_process.terminate()
            try:
                backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                backend_process.kill()
        
        print_success("Aplicação encerrada")


if __name__ == "__main__":
    main()
