import { getFinancialReport } from '@/actions/report';
import { headers } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { DollarSign, Pickaxe } from 'lucide-react';

export default async function RelatorioPage(props: { searchParams: Promise<{ from?: string; to?: string }> }) {
  headers(); // Opt out of static rendering
  const resolvedSearchParams = await props.searchParams;
  const fromDate = resolvedSearchParams.from || '';
  const toDate = resolvedSearchParams.to || '';

  const { serviceOrders, totalCommissions, totalSales, error } = 
    await getFinancialReport(fromDate, toDate);

  async function updateFilter(formData: FormData) {
    'use server';
    const from = formData.get('from')?.toString() || '';
    const to = formData.get('to')?.toString() || '';
    
    // Constrói a URL com os filtros
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    
    redirect(`/relatorio?${params.toString()}`);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatório Financeiro</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe o total de comissões e vendas. Use o filtro abaixo para períodos específicos.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={updateFilter} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="from">Data Inicial</Label>
              <Input 
                id="from" 
                name="from" 
                type="date" 
                defaultValue={fromDate}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="to">Data Final</Label>
              <Input 
                id="to" 
                name="to" 
                type="date" 
                defaultValue={toDate}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Filtrar</Button>
            <a href="/relatorio" className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Limpar
            </a>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total em Comissões (A Pagar)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCommissions || 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volume de Vendas</CardTitle>
            <Pickaxe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSales || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Serviços</CardTitle>
          <CardDescription>
            {serviceOrders?.length} serviços encontrados no período selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : serviceOrders?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum serviço encontrado para este período.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Montador</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor Venda</TableHead>
                    <TableHead className="text-right">Comissão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceOrders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {new Date(order.serviceDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.assembler.name}
                      </TableCell>
                      <TableCell>
                        {order.type === 'INTERNAL' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Loja
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Externa
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.saleValue))}
                      </TableCell>
                      <TableCell className="text-right font-bold text-red-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.commissionValue))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
