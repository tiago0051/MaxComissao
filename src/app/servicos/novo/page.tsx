import { getAssemblers } from '@/actions/assembler';
import { createServiceOrder } from '@/actions/service-order';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubmitButton } from './submit-button';

export default async function NovoServicoPage() {
  headers(); // Opt out of static rendering
  const { assemblers, error } = await getAssemblers();

  async function onSubmit(formData: FormData) {
    const result = await createServiceOrder(formData);
    
    if (result.error) {
      alert(result.error);
    } else {
      alert('Serviço registrado com sucesso!');
      const form = document.getElementById('serviceOrderForm') as HTMLFormElement;
      form.reset();
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lançar Serviço (Montagem)</CardTitle>
          <CardDescription>
            A comissão será calculada automaticamente com base no montador e tipo de serviço escolhido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500 mb-4">{error}</div>
          ) : assemblers?.length === 0 ? (
            <div className="mb-4 p-4 border rounded-md bg-yellow-50 text-yellow-800">
              Nenhum montador cadastrado. Cadastre um montador primeiro.
            </div>
          ) : (
            <form id="serviceOrderForm" action={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="assemblerId">Montador</Label>
                <Select name="assemblerId" required>
                  <SelectTrigger id="assemblerId">
                    <SelectValue placeholder="Selecione o montador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {assemblers?.map((assembler) => (
                      <SelectItem key={assembler.id} value={assembler.id}>
                        {assembler.name} (Loja: {assembler.internalRate}% / Rua: {assembler.externalRate}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-2">
                <Label>Tipo de Montagem</Label>
                <RadioGroup name="type" defaultValue="INTERNAL" className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="INTERNAL" id="internal" className="peer sr-only" />
                    <Label
                      htmlFor="internal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                    >
                      <span className="font-semibold">Interna (Loja)</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="EXTERNAL" id="external" className="peer sr-only" />
                    <Label
                      htmlFor="external"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                    >
                      <span className="font-semibold">Externa (Rua)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="saleValue">Valor da Venda (R$)</Label>
                <Input 
                  id="saleValue" 
                  name="saleValue" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="Ex: 1500.00" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceDate">Data do Serviço</Label>
                <Input 
                  id="serviceDate" 
                  name="serviceDate" 
                  type="date" 
                  required 
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição / Obs (Opcional)</Label>
                <Input 
                  id="description" 
                  name="description" 
                  placeholder="Ex: Montagem Guarda Roupa Casal" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Endereço (Opcional)</Label>
                <Input 
                  id="location" 
                  name="location" 
                  placeholder="Ex: Rua das Flores, 123" 
                />
              </div>

              <SubmitButton label="Registrar Serviço" />
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
