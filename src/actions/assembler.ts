'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAssembler(formData: FormData) {
  try {
    const name = formData.get('name')?.toString();
    const internalRate = Number(formData.get('internalRate'));
    const externalRate = Number(formData.get('externalRate'));

    if (!name || isNaN(internalRate) || isNaN(externalRate)) {
      return { error: 'Campos inválidos' };
    }

    await prisma.assembler.create({
      data: {
        name,
        internalRate,
        externalRate,
      },
    });

    revalidatePath('/montadores');
    revalidatePath('/servicos/novo');
    return { success: true };
  } catch (error) {
    console.error('Failed to create assembler:', error);
    return { error: 'Erro ao criar montador. Tente novamente.' };
  }
}

export async function getAssemblers() {
  try {
    const assemblers = await prisma.assembler.findMany({
      orderBy: { name: 'asc' },
    });
    return { assemblers };
  } catch (error) {
    console.error('Failed to fetch assemblers:', error);
    return { error: 'Failed to fetch assemblers' };
  }
}
