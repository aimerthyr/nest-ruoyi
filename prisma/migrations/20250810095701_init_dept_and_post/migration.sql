-- CreateTable
CREATE TABLE `sys_dept` (
    `dept_id` BIGINT NOT NULL AUTO_INCREMENT,
    `parent_id` BIGINT NOT NULL DEFAULT 0,
    `ancestors` VARCHAR(191) NOT NULL DEFAULT '',
    `dept_name` VARCHAR(191) NOT NULL DEFAULT '',
    `order_num` INTEGER NOT NULL DEFAULT 0,
    `leader` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT '0',
    `del_flag` VARCHAR(191) NOT NULL DEFAULT '0',
    `create_by` VARCHAR(191) NOT NULL DEFAULT '',
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` VARCHAR(191) NOT NULL DEFAULT '',
    `update_time` DATETIME(0) NULL,

    PRIMARY KEY (`dept_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_post` (
    `post_id` BIGINT NOT NULL AUTO_INCREMENT,
    `post_code` VARCHAR(64) NOT NULL,
    `post_name` VARCHAR(50) NOT NULL,
    `post_sort` INTEGER NOT NULL,
    `status` CHAR(1) NOT NULL,
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(0) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
