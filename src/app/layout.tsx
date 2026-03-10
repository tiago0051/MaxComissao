import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Wrench } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Móveis Sonhos - Comissões",
  description: "Sistema de comissões para montadores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-neutral-50`}>
        <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
              Móveis Sonhos
            </Link>
            
            <nav className="flex gap-6 items-center">
              <Link 
                href="/montadores/novo" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                title="Cadastrar Montador"
              >
                Montadores
              </Link>
              <Link 
                href="/servicos/novo" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                title="Lançar Serviço"
              >
                Lançar Serviço
              </Link>
              <Link 
                href="/relatorio" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                title="Ver Relatório Mensal"
              >
                Relatório
              </Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
