"use client";

import { createServiceOrder } from "@/actions/service-order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Assembler } from "../../../../generated/prisma/client";
import { FormEvent, useState } from "react";

type FormMessage = {
  type: "error" | "success";
  text: string;
};

type ServiceOrderFormProps = {
  assemblers: Assembler[];
};

export function ServiceOrderForm({ assemblers }: ServiceOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await createServiceOrder(formData);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({
          type: "success",
          text: "Serviço registrado com sucesso!",
        });
        form.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form id="serviceOrderForm" onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="assemblerId">Montador</Label>
        <Select name="assemblerId" required>
          <SelectTrigger id="assemblerId">
            <SelectValue placeholder="Selecione o montador..." />
          </SelectTrigger>
          <SelectContent>
            {assemblers.map((assembler) => (
              <SelectItem key={assembler.id} value={assembler.id}>
                {assembler.name} (Loja: {assembler.internalRate}% / Rua:{" "}
                {assembler.externalRate}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2">
        <Label>Tipo de Montagem</Label>
        <RadioGroup
          name="type"
          defaultValue="INTERNAL"
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem
              value="INTERNAL"
              id="internal"
              className="peer sr-only"
            />
            <Label
              htmlFor="internal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-checked:border-primary peer-data-checked:bg-primary/5 cursor-pointer"
            >
              <span className="font-semibold">Interna (Loja)</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="EXTERNAL"
              id="external"
              className="peer sr-only"
            />
            <Label
              htmlFor="external"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-checked:border-primary peer-data-checked:bg-primary/5 cursor-pointer"
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
          defaultValue={new Date().toISOString().split("T")[0]}
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

      {message && (
        <div
          className={`p-3 rounded-md text-sm font-medium ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processando..." : "Registrar Serviço"}
      </Button>
    </form>
  );
}
