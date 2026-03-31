-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "academicYear" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "address" TEXT,
ADD COLUMN     "personalNumber" TEXT,
ADD COLUMN     "phone" TEXT;
