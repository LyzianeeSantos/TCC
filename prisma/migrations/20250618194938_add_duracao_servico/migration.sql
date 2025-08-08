/*
  Warnings:

  - Added the required column `duracaoMin` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Servico" ADD COLUMN     "duracaoMin" INTEGER NOT NULL;
