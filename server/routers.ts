import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getUserTranscriptionJobs, getTranscriptionJob, createTranscriptionJob } from "./db";
import { processTranscriptionJob, getJobProgress } from "./transcriptionService";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  transcriber: router({
    getJobs: protectedProcedure.query(async ({ ctx }) => {
      return getUserTranscriptionJobs(ctx.user.id);
    }),

    getJob: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ input }) => {
        return getTranscriptionJob(input.jobId);
      }),

    getProgress: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ input }) => {
        return getJobProgress(input.jobId);
      }),

    uploadFile: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileType: z.enum(["zip", "audio"]),
          fileBuffer: z.instanceof(Buffer),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const job = await createTranscriptionJob({
            userId: ctx.user.id,
            fileName: input.fileName,
            fileType: input.fileType,
            status: "pending",
          });

          const jobId = (job as any).insertId || (job as any)[0]?.id;

          processTranscriptionJob(
            jobId,
            input.fileBuffer,
            input.fileType,
            input.fileName,
            ctx.user.id
          ).catch((error) => {
            console.error("[Transcriber] Background job failed:", error);
          });

          return {
            jobId,
            status: "pending",
          };
        } catch (error) {
          console.error("[Transcriber] Upload failed:", error);
          throw error;
        }
      }),

    downloadReport: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ input }) => {
        const job = await getTranscriptionJob(input.jobId);
        if (!job || !job.reportContent) {
          throw new Error("Report not found");
        }
        return {
          content: job.reportContent,
          fileName: `transcription_${job.id}.txt`,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
