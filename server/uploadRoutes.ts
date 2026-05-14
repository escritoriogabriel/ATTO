import express, { Express } from "express";
import multer from "multer";
import { processTranscriptionJob } from "./transcriptionService";
import { createTranscriptionJob } from "./db";
import { getDb } from "./db";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
});

export function registerUploadRoutes(app: Express) {
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      // Get user ID from session
      const userId = (req as any).userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const fileName = req.file.originalname;
      const fileBuffer = req.file.buffer;
      const fileType = fileName.toLowerCase().endsWith(".zip") ? "zip" : "audio";

      // Create job record
      const job = await createTranscriptionJob({
        userId,
        fileName,
        fileType,
        status: "pending",
      });

      const jobId = (job as any).insertId || (job as any)[0]?.id;

      // Process in background
      processTranscriptionJob(jobId, fileBuffer, fileType, fileName, userId).catch(
        (error) => {
          console.error("[Transcriber] Background job failed:", error);
        }
      );

      res.json({
        jobId,
        status: "pending",
      });
    } catch (error) {
      console.error("[Upload] Error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  app.get("/api/download/:jobId", async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }

      // Get job from database
      const { transcriptionJobs } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const result = await db
        .select()
        .from(transcriptionJobs)
        .where(eq(transcriptionJobs.id, jobId))
        .limit(1);

      const job = result.length > 0 ? result[0] : null;

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      if (job.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (!job.reportContent) {
        return res.status(400).json({ error: "Report not ready" });
      }

      // Send file
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="transcription_${jobId}.txt"`);
      res.send(job.reportContent);
    } catch (error) {
      console.error("[Download] Error:", error);
      res.status(500).json({ error: "Download failed" });
    }
  });
}
