import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, longtext } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Transcription jobs for WhatsApp audio processing.
 * Tracks the overall processing status of uploaded files.
 */
export const transcriptionJobs = mysqlTable("transcription_jobs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileType: mysqlEnum("fileType", ["zip", "audio"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  totalAudios: int("totalAudios").default(0).notNull(),
  processedAudios: int("processedAudios").default(0).notNull(),
  chatContent: longtext("chatContent"),
  reportContent: longtext("reportContent"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TranscriptionJob = typeof transcriptionJobs.$inferSelect;
export type InsertTranscriptionJob = typeof transcriptionJobs.$inferInsert;

/**
 * Individual audio files extracted from ZIP or uploaded directly.
 */
export const audioFiles = mysqlTable("audio_files", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  audioIndex: int("audioIndex").notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  status: mysqlEnum("status", ["pending", "transcribing", "completed", "failed"]).default("pending").notNull(),
  transcription: longtext("transcription"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AudioFile = typeof audioFiles.$inferSelect;
export type InsertAudioFile = typeof audioFiles.$inferInsert;

/**
 * Relations for transcription jobs and audio files.
 */
export const transcriptionJobsRelations = relations(transcriptionJobs, ({ many }) => ({
  audioFiles: many(audioFiles),
}));

export const audioFilesRelations = relations(audioFiles, ({ one }) => ({
  job: one(transcriptionJobs, {
    fields: [audioFiles.jobId],
    references: [transcriptionJobs.id],
  }),
}));