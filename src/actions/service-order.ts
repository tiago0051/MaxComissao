"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "../../generated/prisma/client";

export async function createServiceOrder(formData: FormData) {
  try {
    const assemblerId = formData.get("assemblerId")?.toString();
    const type = formData.get("type")?.toString() as "INTERNAL" | "EXTERNAL";
    const saleValueInput = formData.get("saleValue")?.toString();
    const serviceDateInput = formData.get("serviceDate")?.toString();
    const description = formData.get("description")?.toString();
    const location = formData.get("location")?.toString();

    if (!assemblerId || !type || !saleValueInput || !serviceDateInput) {
      return { error: "Por favor, preencha todos os campos obrigatórios." };
    }

    // Buscando os dados do montador para identificar a porcentagem da comissão
    const assembler = await prisma.assembler.findUnique({
      where: { id: assemblerId },
    });

    if (!assembler) {
      return { error: "Montador não encontrado." };
    }

    // Definindo a taxa de acordo com o tipo (Tudo já em %)
    const currentRate =
      type === "INTERNAL" ? assembler.internalRate : assembler.externalRate;

    // Tratando o valor de venda (em BRL)
    const saleValue = new Prisma.Decimal(saleValueInput);

    // Calculando a comissão: (Venda * Taxa%) / 100
    // Usando conversão para Number para lidar com Decimal math
    const commissionValue = new Prisma.Decimal(
      Number(saleValue) * (currentRate / 100),
    );

    await prisma.serviceOrder.create({
      data: {
        assemblerId,
        type,
        saleValue,
        commissionValue,
        description,
        location,
        serviceDate: new Date(serviceDateInput),
      },
    });

    revalidatePath("/relatorio");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create service order:", error);
    return { error: "Erro ao registrar serviço. Tente novamente." };
  }
}
