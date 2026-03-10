'use server';

import prisma from '@/lib/prisma';

export async function getFinancialReport(startDate?: string, endDate?: string) {
  try {
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        serviceDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    }

    const serviceOrders = await prisma.serviceOrder.findMany({
      where: dateFilter,
      include: {
        assembler: true, // Incluir dados do montador
      },
      orderBy: {
        serviceDate: 'desc',
      },
    });

    const totalCommissions = serviceOrders.reduce((acc, order) => {
      return acc + Number(order.commissionValue);
    }, 0);

    const totalSales = serviceOrders.reduce((acc, order) => {
      return acc + Number(order.saleValue);
    }, 0);

    return { serviceOrders, totalCommissions, totalSales };
  } catch (error) {
    console.error('Failed to fetch financial report:', error);
    return { error: 'Failed to fetch financial report' };
  }
}
