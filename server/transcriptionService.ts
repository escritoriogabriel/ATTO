import AdmZip from "adm-zip";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storagePut, storageGet } from "./storage";
import {
  createTranscriptionJob,
  updateTranscriptionJob,
  createAudioFile,
  getJobAudioFiles,
  updateAudioFile,
  getTranscriptionJob,
} from "./db";
import type { InsertTranscriptionJob, InsertAudioFile } from "../drizzle/schema";

const AUDIO_EXTENSIONS = [".opus", ".ogg", ".mp3", ".wav", ".m4a"];

interface TranscriptionProgress {
  jobId: number;
  totalAudios: number;
  processedAudios: number;
  status: "pending" | "processing" | "completed" | "failed";
}

/**
 * Extract audio files from a ZIP buffer
 */
export function extractAudiosFromZip(zipBuffer: Buffer): {
  audios: Array<{ name: string; data: Buffer }>;
  chatContent: string | null;
} {
  const zip = new AdmZip(zipBuffer);
  const audios: Array<{ name: string; data: Buffer }> = [];
  let chatContent: string | null = null;

  for (const entry of zip.getEntries()) {
    const fileName = entry.name.toLowerCase();

    // Look for _chat.txt
    if (fileName.endsWith("_chat.txt")) {
      chatContent = entry.getData().toString("utf-8");
    }

    // Extract audio files
    if (AUDIO_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
      audios.push({
        name: entry.name,
        data: entry.getData(),
      });
    }
  }

  return { audios, chatContent };
}

/**
 * Parse chat content to find audio references
 */
export function parseAudioReferences(chatContent: string): Map<string, number> {
  const audioMap = new Map<string, number>();
  const audioPattern = /<Media omitted>\s*\(([^)]+)\)/g;
  let audioIndex = 1;

  let match;
  while ((match = audioPattern.exec(chatContent)) !== null) {
    const fileName = match[1];
    if (fileName) {
      audioMap.set(fileName, audioIndex);
      audioIndex++;
    }
  }

  return audioMap;
}

/**
 * Replace audio references in chat content with transcriptions
 */
export function replaceAudioReferencesInChat(
  chatContent: string,
  audioMap: Map<string, number>,
  transcriptions: Map<string, string>
): string {
  let result = chatContent;

  audioMap.forEach((audioIndex, fileName) => {
    const transcription = transcriptions.get(fileName);
    if (transcription) {
      const pattern = new RegExp(
        `<Media omitted>\\s*\\(${fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)`,
        "g"
      );
      const replacement = `áudio ${audioIndex} (${fileName}) transcrito:\n${transcription}`;
      result = result.replace(pattern, replacement);
    }
  });

  return result;
}

/**
 * Process a single audio file and return transcription
 */
export async function transcribeAudioFile(
  audioBuffer: Buffer,
  audioFileName: string
): Promise<string> {
  // Upload audio to storage temporarily
  const storageKey = `transcriber/temp/${Date.now()}-${audioFileName}`;
  const { url: audioUrl } = await storagePut(storageKey, audioBuffer, "audio/mpeg");

  try {
    // Transcribe using Whisper
    const result = await transcribeAudio({
      audioUrl,
      language: "pt", // Portuguese
    });

    if ('text' in result) {
      return result.text || "";
    }
    return "";
  } catch (error) {
    console.error(`[Transcriber] Failed to transcribe ${audioFileName}:`, error);
    throw error;
  }
}

/**
 * Main transcription job processor
 */
export async function processTranscriptionJob(
  jobId: number,
  fileBuffer: Buffer,
  fileType: "zip" | "audio",
  fileName: string,
  userId: number
): Promise<void> {
  try {
    // Update job status to processing
    await updateTranscriptionJob(jobId, { status: "processing" });

    let audios: Array<{ name: string; data: Buffer }> = [];
    let chatContent: string | null = null;

    if (fileType === "zip") {
      // Extract audios from ZIP
      const extracted = extractAudiosFromZip(fileBuffer);
      audios = extracted.audios;
      chatContent = extracted.chatContent;

      if (audios.length === 0) {
        throw new Error("No audio files found in ZIP");
      }
    } else {
      // Single audio file
      audios = [{ name: fileName, data: fileBuffer }];
    }

    // Create audio file records in database
    for (let i = 0; i < audios.length; i++) {
      await createAudioFile({
        jobId,
        fileName: audios[i].name,
        audioIndex: i + 1,
        storageKey: `transcriber/audios/${jobId}/${i + 1}`,
        status: "pending",
      });
    }

    // Update total audios count
    await updateTranscriptionJob(jobId, { totalAudios: audios.length });

    // Process each audio
    const transcriptions = new Map<string, string>();
    const audioFilesRecords = await getJobAudioFiles(jobId);

    for (let i = 0; i < audios.length; i++) {
      const audio = audios[i];
      const audioFile = audioFilesRecords[i];

      try {
        // Update audio file status to transcribing
        await updateAudioFile(audioFile.id, { status: "transcribing" });

        // Transcribe audio
        const transcription = await transcribeAudioFile(audio.data, audio.name);

        // Store transcription
        transcriptions.set(audio.name, transcription);

        // Update audio file with transcription
        await updateAudioFile(audioFile.id, {
          transcription,
          status: "completed",
        });

        // Update job progress
        await updateTranscriptionJob(jobId, {
          processedAudios: i + 1,
        });
      } catch (error) {
        console.error(`[Transcriber] Error processing audio ${audio.name}:`, error);
        await updateAudioFile(audioFile.id, {
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Generate final report
    let reportContent = "";

    if (fileType === "zip" && chatContent) {
      // Parse audio references and replace them
      const audioMap = parseAudioReferences(chatContent);
      reportContent = replaceAudioReferencesInChat(chatContent, audioMap, transcriptions);
    } else {
      // For single audio files, just create a simple report
      reportContent = `Transcrição de: ${fileName}\n\n`;
      transcriptions.forEach((transcription, audioFileName) => {
        reportContent += `áudio 1 (${audioFileName}) transcrito:\n${transcription}\n`;
      });
    }

    // Update job with final report
    await updateTranscriptionJob(jobId, {
      reportContent,
      chatContent: fileType === "zip" ? chatContent : null,
      status: "completed",
    });
  } catch (error) {
    console.error(`[Transcriber] Job ${jobId} failed:`, error);
    await updateTranscriptionJob(jobId, {
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * Get job progress
 */
export async function getJobProgress(jobId: number): Promise<TranscriptionProgress | null> {
  const job = await getTranscriptionJob(jobId);
  if (!job) return null;

  return {
    jobId: job.id,
    totalAudios: job.totalAudios,
    processedAudios: job.processedAudios,
    status: job.status,
  };
}
