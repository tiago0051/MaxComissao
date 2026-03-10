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
          <div className="container mx-auto px-4 py-3 sm:h-16 sm:py-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 text-primary font-bold"
            >
              <div className="bg-primary/10 p-2 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="truncate text-base sm:text-xl">
                Móveis Sonhos
              </span>
            </Link>

            <nav className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:gap-6 sm:items-center">
              <Link
                href="/montadores/novo"
                className="rounded-md border border-border bg-background px-2 py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
                title="Cadastrar Montador"
              >
                Montadores
              </Link>
              <Link
                href="/servicos/novo"
                className="rounded-md border border-border bg-background px-2 py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
                title="Lançar Serviço"
              >
                Lançar Serviço
              </Link>
              <Link
                href="/relatorio"
                className="rounded-md border border-border bg-background px-2 py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
                title="Ver Relatório Mensal"
              >
                Relatório
              </Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6 sm:py-8">{children}</main>
      </body>
    </html>
  );
}
