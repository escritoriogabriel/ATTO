import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Music, ArrowRight } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4">
                <Music className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">ATTO</h1>
            <p className="text-lg text-slate-600">Hub de Aplicações Inteligentes</p>
          </div>

          <div className="space-y-4">
            <p className="text-slate-600">
              Transcreva áudios do WhatsApp, processe dados e muito mais com elegância e eficiência.
            </p>
            <Button
              size="lg"
              onClick={() => (window.location.href = getLoginUrl())}
              className="w-full gap-2"
            >
              Entrar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold text-slate-900">Bem-vindo ao ATTO</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Sua plataforma pessoal de aplicações inteligentes
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Transcriber Card */}
          <Card
            className="p-8 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate("/transcriber")}
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 w-fit group-hover:scale-110 transition-transform">
                <Music className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Transcriber</h3>
                <p className="text-slate-600 mb-4">
                  Transcreva áudios do WhatsApp e gere relatórios com as transcrições integradas ao chat original.
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                  Acessar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Card>

          {/* Coming Soon Card */}
          <Card className="p-8 opacity-50 cursor-not-allowed">
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-100 p-4 w-fit">
                <Music className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Em Breve</h3>
                <p className="text-slate-600 mb-4">
                  Mais aplicações incríveis estão chegando em breve para expandir suas possibilidades.
                </p>
                <div className="flex items-center text-gray-400 font-medium">
                  Disponível em breve
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-600">
          <p>Desenvolvido com ❤️ para máxima produtividade</p>
        </div>
      </div>
    </div>
  );
}
