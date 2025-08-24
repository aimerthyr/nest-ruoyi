/*
  Warnings:

  - The primary key for the `sys_dept` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `dept_id` on the `sys_dept` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `parent_id` on the `sys_dept` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_dict_data` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `dict_code` on the `sys_dict_data` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_dict_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `dict_id` on the `sys_dict_type` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `menu_id` on the `sys_menu` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `parent_id` on the `sys_menu` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `post_id` on the `sys_post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `role_id` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_role_dept` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `role_id` on the `sys_role_dept` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `dept_id` on the `sys_role_dept` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_role_menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `role_id` on the `sys_role_menu` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `menu_id` on the `sys_role_menu` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `dept_id` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_user_post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `sys_user_post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `post_id` on the `sys_user_post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_user_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `sys_user_role` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `role_id` on the `sys_user_role` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `sys_role_dept` DROP FOREIGN KEY `sys_role_dept_dept_id_fkey`;

-- DropForeignKey
ALTER TABLE `sys_role_dept` DROP FOREIGN KEY `sys_role_dept_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `sys_role_menu` DROP FOREIGN KEY `sys_role_menu_menu_id_fkey`;

-- DropForeignKey
ALTER TABLE `sys_role_menu` DROP FOREIGN KEY `sys_role_menu_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `sys_user_post` DROP FOREIGN KEY `sys_user_post_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `sys_user_post` DROP FOREIGN KEY `sys_user_post_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `sys_user_role` DROP FOREIGN KEY `sys_user_role_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `sys_user_role` DROP FOREIGN KEY `sys_user_role_user_id_fkey`;

-- DropIndex
DROP INDEX `sys_role_dept_dept_id_fkey` ON `sys_role_dept`;

-- DropIndex
DROP INDEX `sys_role_menu_menu_id_fkey` ON `sys_role_menu`;

-- DropIndex
DROP INDEX `sys_user_post_post_id_fkey` ON `sys_user_post`;

-- DropIndex
DROP INDEX `sys_user_role_role_id_fkey` ON `sys_user_role`;

-- AlterTable
ALTER TABLE `sys_dept` DROP PRIMARY KEY,
    MODIFY `dept_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `parent_id` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`dept_id`);

-- AlterTable
ALTER TABLE `sys_dict_data` DROP PRIMARY KEY,
    MODIFY `dict_code` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`dict_code`);

-- AlterTable
ALTER TABLE `sys_dict_type` DROP PRIMARY KEY,
    MODIFY `dict_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`dict_id`);

-- AlterTable
ALTER TABLE `sys_menu` DROP PRIMARY KEY,
    MODIFY `menu_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `parent_id` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`menu_id`);

-- AlterTable
ALTER TABLE `sys_post` DROP PRIMARY KEY,
    MODIFY `post_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`post_id`);

-- AlterTable
ALTER TABLE `sys_role` DROP PRIMARY KEY,
    MODIFY `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`role_id`);

-- AlterTable
ALTER TABLE `sys_role_dept` DROP PRIMARY KEY,
    MODIFY `role_id` INTEGER NOT NULL,
    MODIFY `dept_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`role_id`, `dept_id`);

-- AlterTable
ALTER TABLE `sys_role_menu` DROP PRIMARY KEY,
    MODIFY `role_id` INTEGER NOT NULL,
    MODIFY `menu_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`role_id`, `menu_id`);

-- AlterTable
ALTER TABLE `sys_user` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `dept_id` INTEGER NULL,
    ADD PRIMARY KEY (`user_id`);

-- AlterTable
ALTER TABLE `sys_user_post` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `post_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `post_id`);

-- AlterTable
ALTER TABLE `sys_user_role` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `role_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `role_id`);

-- AddForeignKey
ALTER TABLE `sys_role_dept` ADD CONSTRAINT `sys_role_dept_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_role_dept` ADD CONSTRAINT `sys_role_dept_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept`(`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_role_menu` ADD CONSTRAINT `sys_role_menu_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_role_menu` ADD CONSTRAINT `sys_role_menu_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu`(`menu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user_post` ADD CONSTRAINT `sys_user_post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `sys_user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user_post` ADD CONSTRAINT `sys_user_post_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `sys_post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user_role` ADD CONSTRAINT `sys_user_role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `sys_user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user_role` ADD CONSTRAINT `sys_user_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;
