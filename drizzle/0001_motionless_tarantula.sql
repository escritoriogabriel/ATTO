CREATE TABLE `audio_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`audioIndex` int NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`status` enum('pending','transcribing','completed','failed') NOT NULL DEFAULT 'pending',
	`transcription` longtext,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audio_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transcription_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileType` enum('zip','audio') NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`totalAudios` int NOT NULL DEFAULT 0,
	`processedAudios` int NOT NULL DEFAULT 0,
	`chatContent` longtext,
	`reportContent` longtext,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transcription_jobs_id` PRIMARY KEY(`id`)
);
