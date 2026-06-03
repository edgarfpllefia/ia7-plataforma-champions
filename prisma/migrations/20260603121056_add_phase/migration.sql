-- CreateEnum
CREATE TYPE "MatchPhase" AS ENUM ('FASE_LIGA', 'OCTAVOS', 'CUARTOS', 'SEMIFINALES', 'FINAL');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "phase" "MatchPhase" NOT NULL DEFAULT 'FASE_LIGA';
