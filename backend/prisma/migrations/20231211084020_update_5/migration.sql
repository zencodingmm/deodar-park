/*
  Warnings:

  - The primary key for the `tbl_emp_leave` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rid` on the `tbl_emp_leave` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lev_id,lev_type]` on the table `tbl_leave_type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dept_desc` to the `tbl_emp_leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dept_id` to the `tbl_emp_leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emp_lev_id` to the `tbl_emp_leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emp_name` to the `tbl_emp_leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leave_type` to the `tbl_emp_leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nrc` to the `tbl_emp_leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank_desc` to the `tbl_emp_leave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank_id` to the `tbl_emp_leave` table without a default value. This is not possible if the table is not empty.
  - Made the column `emp_id` on table `tbl_emp_leave` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emp_rank_id` on table `tbl_emp_leave` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emp_dept_id` on table `tbl_emp_leave` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lev_id` on table `tbl_emp_leave` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_leave_days` on table `tbl_emp_leave` required. This step will fail if there are existing NULL values in that column.
  - Made the column `leave_detail` on table `tbl_emp_leave` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tbl_emp_leave` DROP PRIMARY KEY,
    DROP COLUMN `rid`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dept_desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `dept_id` INTEGER NOT NULL,
    ADD COLUMN `emp_lev_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `emp_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `leave_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `nrc` VARCHAR(191) NOT NULL,
    ADD COLUMN `rank_desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `rank_id` INTEGER NOT NULL,
    MODIFY `emp_id` INTEGER NOT NULL,
    MODIFY `emp_rank_id` INTEGER NOT NULL,
    MODIFY `emp_dept_id` INTEGER NOT NULL,
    MODIFY `lev_id` INTEGER NOT NULL,
    MODIFY `total_leave_days` INTEGER NOT NULL,
    MODIFY `leave_detail` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`emp_lev_id`);

-- CreateIndex
CREATE UNIQUE INDEX `tbl_leave_type_lev_id_lev_type_key` ON `tbl_leave_type`(`lev_id`, `lev_type`);

-- AddForeignKey
ALTER TABLE `tbl_emp_leave` ADD CONSTRAINT `tbl_emp_leave_emp_id_emp_name_nrc_fkey` FOREIGN KEY (`emp_id`, `emp_name`, `nrc`) REFERENCES `tbl_profile`(`employeeID`, `employee_name`, `NRC`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_emp_leave` ADD CONSTRAINT `tbl_emp_leave_emp_dept_id_dept_id_dept_desc_fkey` FOREIGN KEY (`emp_dept_id`, `dept_id`, `dept_desc`) REFERENCES `tbl_employee_dept`(`emp_dept_id`, `dept_id`, `dept_desc`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_emp_leave` ADD CONSTRAINT `tbl_emp_leave_emp_rank_id_rank_id_rank_desc_fkey` FOREIGN KEY (`emp_rank_id`, `rank_id`, `rank_desc`) REFERENCES `tbl_employee_rank`(`emp_rank_id`, `rank_id`, `rank_desc`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_emp_leave` ADD CONSTRAINT `tbl_emp_leave_lev_id_leave_type_fkey` FOREIGN KEY (`lev_id`, `leave_type`) REFERENCES `tbl_leave_type`(`lev_id`, `lev_type`) ON DELETE CASCADE ON UPDATE CASCADE;
