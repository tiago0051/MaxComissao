-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateTable
CREATE TABLE "Assembler" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "internalRate" DOUBLE PRECISION NOT NULL,
    "externalRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Assembler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceOrder" (
    "id" TEXT NOT NULL,
    "assemblerId" TEXT NOT NULL,
    "saleValue" DECIMAL(65,30) NOT NULL,
    "commissionValue" DECIMAL(65,30) NOT NULL,
    "type" "ServiceType" NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceOrder" ADD CONSTRAINT "ServiceOrder_assemblerId_fkey" FOREIGN KEY ("assemblerId") REFERENCES "Assembler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
