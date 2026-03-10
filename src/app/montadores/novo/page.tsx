"use client";

import { createAssembler } from "@/actions/assembler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";

export default function NovoMontadorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

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
      const result = await createAssembler(formData);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Montador salvo com sucesso!" });
        form.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Montador</CardTitle>
          <CardDescription>
            Insira o montador e as taxas (ex: 7 para representar 7%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="assemblerForm"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: João da Silva"
                required
              />
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
              <div
                className={`p-3 rounded-md text-sm font-medium ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Montador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
