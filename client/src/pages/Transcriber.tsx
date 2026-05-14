import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileAudio,
  Archive,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  jobId: number;
  fileName: string;
  fileType: "zip" | "audio";
  status: "pending" | "processing" | "completed" | "failed";
  totalAudios: number;
  processedAudios: number;
  reportContent?: string;
}

export default function Transcriber() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingReport, setViewingReport] = useState<UploadedFile | null>(null);

  // tRPC queries
  const jobsQuery = trpc.transcriber.getJobs.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Poll for job progress
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      jobsQuery.refetch();
    }, 2000);

    return () => clearInterval(interval);
  }, [isAuthenticated, jobsQuery]);

  // Update local state when jobs change
  useEffect(() => {
    if (jobsQuery.data) {
      setUploadedFiles(
        jobsQuery.data.map((job) => ({
          jobId: job.id,
          fileName: job.fileName,
          fileType: job.fileType,
          status: job.status as "pending" | "processing" | "completed" | "failed",
          totalAudios: job.totalAudios,
          processedAudios: job.processedAudios,
          reportContent: job.reportContent || undefined,
        }))
      );
    }
  }, [jobsQuery.data]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    for (const file of files) {
      const isZip = file.type === "application/zip" || file.name.endsWith(".zip");
      const isAudio = [
        "audio/mpeg",
        "audio/ogg",
        "audio/opus",
        "audio/wav",
        "audio/mp4",
      ].includes(file.type) || [".mp3", ".ogg", ".opus", ".wav", ".m4a"].some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!isZip && !isAudio) {
        toast.error(`${file.name} não é um arquivo de áudio ou ZIP válido`);
        continue;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        toast.success(`${file.name} enviado para processamento`);
        jobsQuery.refetch();
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Erro ao enviar ${file.name}`);
      } finally {
        setIsUploading(false);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = async (jobId: number) => {
    try {
      const response = await fetch(`/api/download/${jobId}`);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transcription_${jobId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Relatório baixado com sucesso");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erro ao baixar relatório");
    }
  };

  const handleViewReport = (file: UploadedFile) => {
    setViewingReport(file);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "processing":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-800">Concluído</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processando</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pendente</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Transcriber</h1>
        <p className="text-slate-600">
          Transcreva áudios do WhatsApp e gere relatórios com as transcrições integradas
        </p>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors">
        <div
          className={`p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? "bg-slate-50 border-slate-400"
              : "hover:bg-slate-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".zip,.mp3,.ogg,.opus,.wav,.m4a"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Arraste arquivos ou clique para enviar
              </h3>
              <p className="text-sm text-slate-600">
                Suporta: ZIP do WhatsApp, MP3, OGG, OPUS, WAV, M4A
              </p>
            </div>

            <Button
              disabled={isUploading}
              className="mt-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivo
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Jobs List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Histórico de Transcrições</h2>

          <div className="space-y-3">
            {uploadedFiles.map((file) => {
              const progressPercent =
                file.totalAudios > 0
                  ? Math.round((file.processedAudios / file.totalAudios) * 100)
                  : 0;

              return (
                <Card key={file.jobId} className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {file.fileType === "zip" ? (
                            <Archive className="w-5 h-5 text-slate-400" />
                          ) : (
                            <FileAudio className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {file.fileName}
                          </p>
                          <p className="text-sm text-slate-600">
                            {file.fileType === "zip"
                              ? `${file.totalAudios} áudios`
                              : "Áudio único"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.status)}
                        {getStatusBadge(file.status)}
                      </div>
                    </div>

                    {/* Progress */}
                    {file.status === "processing" && file.totalAudios > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Progresso</span>
                          <span className="text-slate-900 font-medium">
                            {file.processedAudios}/{file.totalAudios}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    )}

                    {/* Actions */}
                    {file.status === "completed" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewReport(file)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Visualizar
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleDownload(file.jobId)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Relatório
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedFiles.length === 0 && !jobsQuery.isLoading && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-slate-100 p-4">
              <Archive className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Nenhuma transcrição ainda
              </h3>
              <p className="text-slate-600">
                Comece enviando um arquivo de áudio ou um ZIP do WhatsApp
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* View Report Modal */}
      <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Relatório de Transcrição</DialogTitle>
          </DialogHeader>
          {viewingReport && (
            <ScrollArea className="w-full h-[60vh] rounded-md border p-4">
              <div className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                {viewingReport.reportContent || "Carregando..."}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
