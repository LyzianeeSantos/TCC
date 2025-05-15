/*
  Warnings:

  - Made the column `localizacao` on table `Agendamento` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Agendamento" ALTER COLUMN "localizacao" SET NOT NULL;
