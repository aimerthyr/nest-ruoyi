/*
  Warnings:

  - You are about to alter the column `create_time` on the `sys_menu` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `update_time` on the `sys_menu` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `create_time` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `update_time` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `login_date` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `pwd_update_date` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `create_time` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `update_time` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.

*/
-- AlterTable
ALTER TABLE `sys_menu` MODIFY `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `update_time` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `sys_role` MODIFY `create_time` DATETIME(0) NULL,
    MODIFY `update_time` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `sys_user` MODIFY `login_date` DATETIME(0) NOT NULL,
    MODIFY `pwd_update_date` DATETIME(0) NOT NULL,
    MODIFY `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `update_time` DATETIME(0) NOT NULL;
