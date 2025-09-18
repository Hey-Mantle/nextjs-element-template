/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `organizationId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "sessions_sessionToken_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "sessions";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "image" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "emailVerified", "id", "image", "name", "updatedAt", "userId") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "updatedAt", "userId" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
