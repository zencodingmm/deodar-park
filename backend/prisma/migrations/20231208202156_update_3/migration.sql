/*
  Warnings:

  - You are about to drop the column `insurance_id` on the `tbl_emp_insurance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emp_rank_id,rank_id,rank_desc]` on the table `tbl_employee_rank` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iid,insurance_type]` on the table `tbl_insurance_type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dept_desc` to the `tbl_emp_insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dept_id` to the `tbl_emp_insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emp_name` to the `tbl_emp_insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iid` to the `tbl_emp_insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insurance_type` to the `tbl_emp_insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nrc` to the `tbl_emp_insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank_desc` to the `tbl_emp_insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank_id` to the `tbl_emp_insurance` table without a default value. This is not possible if the table is not empty.
  - Made the column `emp_id` on table `tbl_emp_insurance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emp_rank_id` on table `tbl_emp_insurance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emp_dept_id` on table `tbl_emp_insurance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tbl_emp_insurance` DROP COLUMN `insurance_id`,
    ADD COLUMN `dept_desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `dept_id` INTEGER NOT NULL,
    ADD COLUMN `emp_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `iid` INTEGER NOT NULL,
    ADD COLUMN `insurance_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `nrc` VARCHAR(191) NOT NULL,
    ADD COLUMN `rank_desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `rank_id` INTEGER NOT NULL,
    MODIFY `emp_id` INTEGER NOT NULL,
    MODIFY `emp_rank_id` INTEGER NOT NULL,
    MODIFY `emp_dept_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tbl_employee_rank_emp_rank_id_rank_id_rank_desc_key` ON `tbl_employee_rank`(`emp_rank_id`, `rank_id`, `rank_desc`);

-- CreateIndex
CREATE UNIQUE INDEX `tbl_insurance_type_iid_insurance_type_key` ON `tbl_insurance_type`(`iid`, `insurance_type`);

-- AddForeignKey
ALTER TABLE `tbl_emp_insurance` ADD CONSTRAINT `tbl_emp_insurance_emp_id_emp_name_nrc_fkey` FOREIGN KEY (`emp_id`, `emp_name`, `nrc`) REFERENCES `tbl_profile`(`employeeID`, `employee_name`, `NRC`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_emp_insurance` ADD CONSTRAINT `tbl_emp_insurance_emp_dept_id_dept_id_dept_desc_fkey` FOREIGN KEY (`emp_dept_id`, `dept_id`, `dept_desc`) REFERENCES `tbl_employee_dept`(`emp_dept_id`, `dept_id`, `dept_desc`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_emp_insurance` ADD CONSTRAINT `tbl_emp_insurance_emp_rank_id_rank_id_rank_desc_fkey` FOREIGN KEY (`emp_rank_id`, `rank_id`, `rank_desc`) REFERENCES `tbl_employee_rank`(`emp_rank_id`, `rank_id`, `rank_desc`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_emp_insurance` ADD CONSTRAINT `tbl_emp_insurance_iid_insurance_type_fkey` FOREIGN KEY (`iid`, `insurance_type`) REFERENCES `tbl_insurance_type`(`iid`, `insurance_type`) ON DELETE CASCADE ON UPDATE CASCADE;
