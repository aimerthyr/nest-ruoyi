-- CreateTable
CREATE TABLE `sys_dict_data` (
    `dict_code` BIGINT NOT NULL AUTO_INCREMENT,
    `dict_sort` INTEGER NOT NULL DEFAULT 0,
    `dict_label` VARCHAR(100) NOT NULL DEFAULT '',
    `dict_value` VARCHAR(100) NOT NULL DEFAULT '',
    `dict_type` VARCHAR(100) NOT NULL DEFAULT '',
    `css_class` VARCHAR(100) NULL,
    `list_class` VARCHAR(100) NULL,
    `is_default` CHAR(1) NOT NULL DEFAULT 'N',
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(0) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`dict_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dict_type` (
    `dict_id` BIGINT NOT NULL AUTO_INCREMENT,
    `dict_name` VARCHAR(100) NOT NULL DEFAULT '',
    `dict_type` VARCHAR(100) NOT NULL,
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(0) NULL,
    `remark` VARCHAR(500) NULL,

    UNIQUE INDEX `sys_dict_type_dict_type_key`(`dict_type`),
    PRIMARY KEY (`dict_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_dict_data` ADD CONSTRAINT `sys_dict_data_dict_type_fkey` FOREIGN KEY (`dict_type`) REFERENCES `sys_dict_type`(`dict_type`) ON DELETE CASCADE ON UPDATE CASCADE;
