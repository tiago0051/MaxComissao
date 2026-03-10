import { getFinancialReport } from "@/actions/report";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import { DollarSign, Pickaxe } from "lucide-react";

type FinancialReportResult = Awaited<ReturnType<typeof getFinancialReport>>;
type ServiceOrderRow = NonNullable<
  FinancialReportResult["serviceOrders"]
>[number];

export default async function RelatorioPage(props: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  headers(); // Opt out of static rendering
  const resolvedSearchParams = await props.searchParams;
  const fromDate = resolvedSearchParams.from || "";
  const toDate = resolvedSearchParams.to || "";

  const { serviceOrders, totalCommissions, totalSales, error } =
    await getFinancialReport(fromDate, toDate);

  async function updateFilter(formData: FormData) {
    "use server";
    const from = formData.get("from")?.toString() || "";
    const to = formData.get("to")?.toString() || "";

    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    redirect(`/relatorio?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Relatorio Financeiro
        </h1>
        <p className="mt-2 text-muted-foreground">
          Acompanhe o total de comissoes e vendas. Use o filtro abaixo para
          periodos especificos.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            action={updateFilter}
            className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-[1fr_1fr_auto_auto]"
          >
            <div className="flex-1 space-y-2">
              <Label htmlFor="from">Data Inicial</Label>
              <Input
                id="from"
                name="from"
                type="date"
                className="h-11 text-base sm:h-9 sm:text-sm"
                defaultValue={fromDate}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="to">Data Final</Label>
              <Input
                id="to"
                name="to"
                type="date"
                className="h-11 text-base sm:h-9 sm:text-sm"
                defaultValue={toDate}
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full text-base sm:h-9 sm:w-auto sm:text-sm"
            >
              Filtrar
            </Button>
            <a
              href="/relatorio"
              className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:h-9 sm:w-auto sm:text-sm"
            >
              Limpar
            </a>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total em Comissoes (A Pagar)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-red-600 break-all">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalCommissions || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Volume de Vendas
            </CardTitle>
            <Pickaxe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600 break-all">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalSales || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historico de Servicos</CardTitle>
          <CardDescription>
            {serviceOrders?.length} servicos encontrados no periodo selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : serviceOrders?.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Nenhum servico encontrado para este periodo.
            </div>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {serviceOrders?.map((order: ServiceOrderRow) => (
                  <div
                    key={order.id}
                    className="space-y-3 rounded-md border p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">
                        {order.assembler.name}
                      </p>
                      {order.type === "INTERNAL" ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Loja
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                          Externa
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Data</p>
                        <p>
                          {new Date(order.serviceDate).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Valor Venda
                        </p>
                        <p>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(order.saleValue))}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">
                          Comissao
                        </p>
                        <p className="font-bold text-red-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(order.commissionValue))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-md border md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Montador</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Valor Venda</TableHead>
                      <TableHead className="text-right">Comissao</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceOrders?.map((order: ServiceOrderRow) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          {new Date(order.serviceDate).toLocaleDateString(
                            "pt-BR",
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.assembler.name}
                        </TableCell>
                        <TableCell>
                          {order.type === "INTERNAL" ? (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              Loja
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                              Externa
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(order.saleValue))}
                        </TableCell>
                        <TableCell className="text-right font-bold text-red-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(order.commissionValue))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
