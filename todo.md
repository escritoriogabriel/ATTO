# ATTO - Transcriber App TODO

## Fase 1: Arquitetura e Schema
- [x] Definir schema de banco de dados (tabelas para jobs, áudios, transcrições)
- [x] Planejar estrutura de processamento de ZIP
- [x] Definir formato de armazenamento de relatórios

## Fase 2: Backend
- [x] Implementar rota de upload (suportar .ogg, .mp3, .zip)
- [x] Implementar extração de arquivos ZIP
- [x] Implementar detecção e extração de áudios do ZIP
- [x] Implementar integração com Whisper para transcrição
- [x] Implementar processamento de _chat.txt e substituição de referências
- [x] Implementar geração de relatório final
- [x] Implementar endpoints tRPC para status de progresso

## Fase 3: Frontend
- [x] Implementar DashboardLayout como base
- [x] Implementar componente de upload (drag-and-drop)
- [x] Implementar barra de progresso em tempo real
- [x] Implementar visualização de transcrições
- [x] Implementar botão de download do relatório
- [x] Design elegante e refinado da interface

## Fase 4: Testes e Ajustes
- [x] Testar upload de arquivos individuais (.ogg, .mp3)
- [x] Testar upload de arquivo ZIP do WhatsApp
- [x] Testar extração de áudios do ZIP
- [x] Testar transcrição via Whisper
- [x] Testar substituição de referências no chat
- [x] Testar download do relatório
- [x] Validar UX e performance
- [x] Escrever testes unitários (parseAudioReferences, replaceAudioReferencesInChat)
- [x] Todos os testes passando (9 testes)

## Fase 5: Deploy
- [x] Criar checkpoint final (v1.0 - 45129954)
- [x] Documentar instruções de uso (TRANSCRIBER_GUIDE.md)
- [x] Preparar para deploy (Vercel ou local)
- [x] Criar README_ATTO.md com overview do projeto
- [x] Documentar stack tecnológico e arquitetura

## Fase 6: Integração Streamlit + FastAPI (Nova Estrutura)
- [x] Remover Docker (Dockerfile, docker-compose, etc)
- [x] Criar pasta streamlit_app/ com estrutura organizada
- [x] Implementar backend_api.py (FastAPI robusto)
- [x] Implementar main.py (Streamlit elegante)
- [x] Criar run_streamlit.py (launcher unificado)
- [x] Criar requirements-streamlit.txt
- [x] Criar README_STREAMLIT.md
- [x] Testar estrutura integrada
- [x] Consolidar tudo em um único repositório
