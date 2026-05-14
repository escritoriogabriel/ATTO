-- ============================================
-- ATTO Transcriber - Database Initialization
-- ============================================

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS atto_db;
USE atto_db;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openId` varchar(64) NOT NULL UNIQUE,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de jobs de transcrição
CREATE TABLE IF NOT EXISTS `transcription_jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `fileType` enum('zip','audio') NOT NULL,
  `status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
  `totalAudios` int DEFAULT 0,
  `processedAudios` int DEFAULT 0,
  `reportContent` longtext,
  `errorMessage` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `transcription_jobs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de arquivos de áudio
CREATE TABLE IF NOT EXISTS `audio_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jobId` int NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `status` enum('pending','transcribing','completed','failed') NOT NULL DEFAULT 'pending',
  `transcription` longtext,
  `errorMessage` text,
  `audioIndex` int,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `jobId` (`jobId`),
  CONSTRAINT `audio_files_ibfk_1` FOREIGN KEY (`jobId`) REFERENCES `transcription_jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar índices para melhor performance
CREATE INDEX idx_jobs_userId_status ON transcription_jobs(userId, status);
CREATE INDEX idx_jobs_createdAt ON transcription_jobs(createdAt);
CREATE INDEX idx_audio_jobId_status ON audio_files(jobId, status);

-- Inserir usuário de desenvolvimento (opcional)
INSERT INTO `users` (openId, name, email, loginMethod, role) 
VALUES ('dev-user-001', 'Developer', 'dev@atto.local', 'local', 'admin')
ON DUPLICATE KEY UPDATE openId=openId;
