-- CreateTable
CREATE TABLE `sys_menu` (
    `menu_id` BIGINT NOT NULL AUTO_INCREMENT,
    `menu_name` VARCHAR(50) NOT NULL,
    `parent_id` BIGINT NOT NULL DEFAULT 0,
    `order_num` INTEGER NOT NULL DEFAULT 0,
    `path` VARCHAR(200) NOT NULL DEFAULT '',
    `component` VARCHAR(255) NULL,
    `query` VARCHAR(255) NULL,
    `route_name` VARCHAR(50) NOT NULL DEFAULT '',
    `is_frame` INTEGER NOT NULL DEFAULT 1,
    `is_cache` INTEGER NOT NULL DEFAULT 0,
    `menu_type` CHAR(1) NOT NULL DEFAULT '',
    `visible` CHAR(1) NOT NULL DEFAULT '0',
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `perms` VARCHAR(100) NULL,
    `icon` VARCHAR(100) NOT NULL DEFAULT '#',
    `create_by` VARCHAR(64) NOT NULL DEFAULT '',
    `create_time` DATETIME(3) NULL,
    `update_by` VARCHAR(64) NOT NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NOT NULL DEFAULT '',

    PRIMARY KEY (`menu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_role_menu` (
    `role_id` BIGINT NOT NULL,
    `menu_id` BIGINT NOT NULL,

    PRIMARY KEY (`role_id`, `menu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_role_menu` ADD CONSTRAINT `sys_role_menu_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_role_menu` ADD CONSTRAINT `sys_role_menu_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu`(`menu_id`) ON DELETE CASCADE ON UPDATE CASCADE;
