-- CreateTable
CREATE TABLE `sys_role_dept` (
    `role_id` BIGINT NOT NULL,
    `dept_id` BIGINT NOT NULL,

    PRIMARY KEY (`role_id`, `dept_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_user_post` (
    `user_id` BIGINT NOT NULL,
    `post_id` BIGINT NOT NULL,

    PRIMARY KEY (`user_id`, `post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_role_dept` ADD CONSTRAINT `sys_role_dept_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_role_dept` ADD CONSTRAINT `sys_role_dept_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept`(`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user_post` ADD CONSTRAINT `sys_user_post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `sys_user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user_post` ADD CONSTRAINT `sys_user_post_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `sys_post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;
