-- DropIndex
DROP INDEX `session_sessionToken_key` ON `session`;

-- AlterTable
ALTER TABLE `session` MODIFY `sessionToken` LONGTEXT NOT NULL;
