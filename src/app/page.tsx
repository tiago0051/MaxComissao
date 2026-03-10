import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { UserPlus, ArrowDown, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie montadores, lançamentos de ordens de serviço e acompanhe o fechamento mensal das comissões.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <UserPlus className="w-8 h-8 text-blue-500 mb-2" />
            <CardTitle>Montadores</CardTitle>
            <CardDescription>Cadastre novos profissionais e suas respectivas taxas de comissão.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/montadores/novo" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              Novo Cadastro <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <ArrowDown className="w-8 h-8 text-green-500 mb-2" />
            <CardTitle>Lançar Serviço</CardTitle>
            <CardDescription>Registre ordens de serviço especificando se foi na Loja ou Externo.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/servicos/novo" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2">
              Novo Serviço <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <FileText className="w-8 h-8 text-purple-500 mb-2" />
            <CardTitle>Relatório Mensal</CardTitle>
            <CardDescription>Acompanhe o valor devido para cada montador com filtros por data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/relatorio" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Ver Relatório <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
