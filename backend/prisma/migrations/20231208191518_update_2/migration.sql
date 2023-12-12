-- DropForeignKey
ALTER TABLE `tbl_employee_rank` DROP FOREIGN KEY `tbl_employee_rank_emp_id_emp_name_nrc_fkey`;

-- AddForeignKey
ALTER TABLE `tbl_employee_rank` ADD CONSTRAINT `tbl_employee_rank_emp_id_emp_name_nrc_fkey` FOREIGN KEY (`emp_id`, `emp_name`, `nrc`) REFERENCES `tbl_profile`(`employeeID`, `employee_name`, `NRC`) ON DELETE CASCADE ON UPDATE CASCADE;
