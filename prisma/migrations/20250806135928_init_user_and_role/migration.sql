-- CreateTable
CREATE TABLE `sys_role` (
    `role_id` BIGINT NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(30) NOT NULL,
    `role_key` VARCHAR(100) NOT NULL,
    `role_sort` INTEGER NOT NULL,
    `data_scope` CHAR(1) NULL DEFAULT '1',
    `menu_check_strictly` BOOLEAN NULL DEFAULT true,
    `dept_check_strictly` BOOLEAN NULL DEFAULT true,
    `status` CHAR(1) NOT NULL,
    `del_flag` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL,
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_user` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `dept_id` BIGINT NULL,
    `user_name` VARCHAR(30) NOT NULL,
    `nick_name` VARCHAR(30) NOT NULL,
    `user_type` VARCHAR(2) NOT NULL DEFAULT '00',
    `email` VARCHAR(50) NOT NULL DEFAULT '',
    `phonenumber` VARCHAR(11) NOT NULL DEFAULT '',
    `sex` CHAR(1) NOT NULL DEFAULT '0',
    `avatar` VARCHAR(100) NOT NULL DEFAULT '',
    `password` VARCHAR(100) NOT NULL DEFAULT '',
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `del_flag` CHAR(1) NOT NULL DEFAULT '0',
    `login_ip` VARCHAR(128) NOT NULL DEFAULT '',
    `login_date` DATETIME(3) NOT NULL,
    `pwd_update_date` DATETIME(3) NOT NULL,
    `create_by` VARCHAR(64) NOT NULL DEFAULT '',
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NOT NULL DEFAULT '',
    `update_time` DATETIME(3) NOT NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_user_role` (
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,

    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_user_role` ADD CONSTRAINT `sys_user_role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `sys_user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user_role` ADD CONSTRAINT `sys_user_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;
