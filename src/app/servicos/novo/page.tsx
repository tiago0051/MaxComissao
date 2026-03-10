import { getAssemblers } from "@/actions/assembler";
import { headers } from "next/headers";
import { ServiceOrderForm } from "@/app/servicos/novo/service-order-form";

export const dynamic = "force-dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function NovoServicoPage() {
  headers(); // Opt out of static rendering
  const { assemblers, error } = await getAssemblers();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lançar Serviço (Montagem)</CardTitle>
          <CardDescription>
            A comissão será calculada automaticamente com base no montador e
            tipo de serviço escolhido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500 mb-4">{error}</div>
          ) : !assemblers || assemblers.length === 0 ? (
            <div className="mb-4 p-4 border rounded-md bg-yellow-50 text-yellow-800">
              Nenhum montador cadastrado. Cadastre um montador primeiro.
            </div>
          ) : (
            <ServiceOrderForm assemblers={assemblers} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
