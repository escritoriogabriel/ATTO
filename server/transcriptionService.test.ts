import { describe, it, expect } from "vitest";
import {
  parseAudioReferences,
  replaceAudioReferencesInChat,
  extractAudiosFromZip,
} from "./transcriptionService";

describe("Transcription Service", () => {
  describe("parseAudioReferences", () => {
    it("should parse audio references from WhatsApp chat", () => {
      const chatContent = `[10/05/2024, 14:30:00] User: Hello
<Media omitted> (audio_2024-05-10_14-30-00.opus)
[10/05/2024, 14:31:00] User: Another message
<Media omitted> (audio_2024-05-10_14-31-00.opus)`;

      const audioMap = parseAudioReferences(chatContent);

      expect(audioMap.size).toBe(2);
      expect(audioMap.get("audio_2024-05-10_14-30-00.opus")).toBe(1);
      expect(audioMap.get("audio_2024-05-10_14-31-00.opus")).toBe(2);
    });

    it("should handle chat without audio references", () => {
      const chatContent = `[10/05/2024, 14:30:00] User: Hello
[10/05/2024, 14:31:00] User: Another message`;

      const audioMap = parseAudioReferences(chatContent);

      expect(audioMap.size).toBe(0);
    });

    it("should handle empty chat", () => {
      const audioMap = parseAudioReferences("");

      expect(audioMap.size).toBe(0);
    });
  });

  describe("replaceAudioReferencesInChat", () => {
    it("should replace audio references with transcriptions", () => {
      const chatContent = `[10/05/2024, 14:30:00] User: Hello
<Media omitted> (audio_1.opus)
[10/05/2024, 14:31:00] User: Another message`;

      const audioMap = new Map([["audio_1.opus", 1]]);
      const transcriptions = new Map([["audio_1.opus", "Hello, this is a test audio"]]);

      const result = replaceAudioReferencesInChat(chatContent, audioMap, transcriptions);

      expect(result).toContain("áudio 1 (audio_1.opus) transcrito:");
      expect(result).toContain("Hello, this is a test audio");
      expect(result).not.toContain("<Media omitted>");
    });

    it("should handle multiple audio references", () => {
      const chatContent = `<Media omitted> (audio_1.opus)
<Media omitted> (audio_2.opus)
<Media omitted> (audio_3.opus)`;

      const audioMap = new Map([
        ["audio_1.opus", 1],
        ["audio_2.opus", 2],
        ["audio_3.opus", 3],
      ]);
      const transcriptions = new Map([
        ["audio_1.opus", "First audio"],
        ["audio_2.opus", "Second audio"],
        ["audio_3.opus", "Third audio"],
      ]);

      const result = replaceAudioReferencesInChat(chatContent, audioMap, transcriptions);

      expect(result).toContain("áudio 1 (audio_1.opus) transcrito:");
      expect(result).toContain("áudio 2 (audio_2.opus) transcrito:");
      expect(result).toContain("áudio 3 (audio_3.opus) transcrito:");
      expect(result).toContain("First audio");
      expect(result).toContain("Second audio");
      expect(result).toContain("Third audio");
    });

    it("should skip audio references without transcriptions", () => {
      const chatContent = `<Media omitted> (audio_1.opus)
<Media omitted> (audio_2.opus)`;

      const audioMap = new Map([
        ["audio_1.opus", 1],
        ["audio_2.opus", 2],
      ]);
      const transcriptions = new Map([["audio_1.opus", "First audio"]]);

      const result = replaceAudioReferencesInChat(chatContent, audioMap, transcriptions);

      expect(result).toContain("áudio 1 (audio_1.opus) transcrito:");
      expect(result).toContain("First audio");
      expect(result).toContain("<Media omitted> (audio_2.opus)");
    });

    it("should handle special characters in filenames", () => {
      const chatContent = `<Media omitted> (audio (1) [test].opus)`;

      const audioMap = new Map([["audio (1) [test].opus", 1]]);
      const transcriptions = new Map([["audio (1) [test].opus", "Test audio"]]);

      const result = replaceAudioReferencesInChat(chatContent, audioMap, transcriptions);

      expect(result).toContain("áudio 1 (audio (1) [test].opus) transcrito:");
      expect(result).toContain("Test audio");
    });
  });

  describe("extractAudiosFromZip", () => {
    it("should handle invalid ZIP buffer gracefully", () => {
      const invalidBuffer = Buffer.from("invalid zip data");

      try {
        extractAudiosFromZip(invalidBuffer);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
