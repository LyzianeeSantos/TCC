/*
  Warnings:

  - Made the column `duracaoMin` on table `Servico` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Servico" ALTER COLUMN "duracaoMin" SET NOT NULL;
