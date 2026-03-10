'use client';

import { useFormStatus } from 'react-dom';
import { createAssembler } from '@/actions/assembler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Salvando...' : 'Salvar Montador'}
    </Button>
  );
}

export default function NovoMontadorPage() {
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  async function clientAction(formData: FormData) {
    const result = await createAssembler(formData);
    
    if (result.error) {
       setMessage({ type: 'error', text: result.error });
    } else {
       setMessage({ type: 'success', text: 'Montador salvo com sucesso!' });
       const form = document.getElementById('assemblerForm') as HTMLFormElement;
       form.reset();
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Montador</CardTitle>
          <CardDescription>Insira o montador e as taxas (ex: 7 para representar 7%)</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="assemblerForm" action={clientAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" placeholder="Ex: João da Silva" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="internalRate">Taxa Montagem na Loja (%)</Label>
                <Input 
                  id="internalRate" 
                  name="internalRate" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="Ex: 5" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalRate">Taxa Montagem Externa (%)</Label>
                <Input 
                  id="externalRate" 
                  name="externalRate" 
                  type="number" 
                  step="0.01"
                  min="0" 
                  placeholder="Ex: 8" 
                  required 
                />
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
