-- CreateTable
CREATE TABLE `tbl_attendance` (
    `rid` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_id` INTEGER NULL,
    `emp_name` VARCHAR(100) NULL,
    `emp_rank` VARCHAR(100) NULL,
    `start_date_time` DATETIME(0) NULL,
    `end_date_time` DATETIME(0) NULL,
    `reg_Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`rid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_department` (
    `dept_id` INTEGER NOT NULL AUTO_INCREMENT,
    `dept_desc` VARCHAR(100) NULL,

    UNIQUE INDEX `tbl_department_dept_id_dept_desc_key`(`dept_id`, `dept_desc`),
    PRIMARY KEY (`dept_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_emp_insurance` (
    `emp_ins_id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_id` INTEGER NULL,
    `emp_rank_id` INTEGER NULL,
    `emp_dept_id` INTEGER NULL,
    `insurance_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`emp_ins_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_emp_leave` (
    `rid` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_id` INTEGER NULL,
    `emp_rank_id` INTEGER NULL,
    `emp_dept_id` INTEGER NULL,
    `lev_id` INTEGER NULL,
    `total_leave_days` VARCHAR(100) NULL,
    `leave_detail` VARCHAR(100) NULL,
    `leave_start_date` DATE NULL,
    `leave_end_date` DATE NULL,
    `approved_person` VARCHAR(100) NULL,
    `approved_date` DATE NULL,

    PRIMARY KEY (`rid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_employee_dept` (
    `emp_dept_id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_id` INTEGER NOT NULL,
    `emp_name` VARCHAR(191) NOT NULL,
    `nrc` VARCHAR(191) NOT NULL,
    `dept_id` INTEGER NOT NULL,
    `dept_desc` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `tbl_employee_dept_emp_id_key`(`emp_id`),
    UNIQUE INDEX `tbl_employee_dept_emp_dept_id_dept_id_dept_desc_key`(`emp_dept_id`, `dept_id`, `dept_desc`),
    PRIMARY KEY (`emp_dept_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_employee_evaluation_record` (
    `emp_eval_rec_id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_id` VARCHAR(100) NULL,
    `emp_rank_id` INTEGER NULL,
    `evaluation_desc` VARCHAR(100) NULL,
    `effort_in_work` VARCHAR(100) NULL,
    `professional_skills` VARCHAR(100) NULL,
    `compliance` VARCHAR(100) NULL,
    `obedience_to_orders` VARCHAR(100) NULL,
    `interest_in_work` BOOLEAN NULL,
    `teach_again` BOOLEAN NULL,
    `other_evaluation_remark` VARCHAR(100) NULL,
    `approved_person_one_name` VARCHAR(100) NULL,
    `approved_person_two_name` VARCHAR(100) NULL,
    `approved_person_three_name` VARCHAR(100) NULL,
    `eval_reg_date` DATE NULL,
    `emp_dept_id` INTEGER NULL,
    `effort_in_work_mark` VARCHAR(100) NULL,
    `professional_skills_mark` VARCHAR(100) NULL,
    `compliance_mark` VARCHAR(100) NULL,
    `obedience_to_orders_mark` VARCHAR(100) NULL,
    `approved_person_one_rank` VARCHAR(100) NULL,
    `approved_person_two_rank` VARCHAR(100) NULL,
    `approved_person_three_rank` VARCHAR(100) NULL,

    PRIMARY KEY (`emp_eval_rec_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_employee_rank` (
    `emp_rank_id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_dept_id` INTEGER NOT NULL,
    `emp_id` INTEGER NOT NULL,
    `emp_name` VARCHAR(191) NOT NULL,
    `nrc` VARCHAR(191) NOT NULL,
    `dept_id` INTEGER NOT NULL,
    `dept_desc` VARCHAR(191) NOT NULL,
    `rank_id` INTEGER NOT NULL,
    `rank_desc` VARCHAR(191) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `assign_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `composite_employee_index`(`emp_id`, `emp_name`, `nrc`, `emp_dept_id`, `dept_id`, `dept_desc`),
    PRIMARY KEY (`emp_rank_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_insurance_type` (
    `iid` INTEGER NOT NULL AUTO_INCREMENT,
    `insurance_type` VARCHAR(100) NULL,

    PRIMARY KEY (`iid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_leave_type` (
    `lev_id` INTEGER NOT NULL AUTO_INCREMENT,
    `lev_type` VARCHAR(100) NULL,
    `lev_day` INTEGER NULL,

    PRIMARY KEY (`lev_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_loan_record` (
    `emp_loan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_id` INTEGER NULL,
    `emp_rank_id` INTEGER NULL,
    `emp_dept_id` INTEGER NULL,
    `loan_id` INTEGER NULL,
    `loan_amount` DOUBLE NULL DEFAULT 0,
    `loan_request_date` DATE NULL,
    `loan_submittion_date` DATE NULL,
    `loan_insurance_person` VARCHAR(100) NULL,
    `loan_submited_detail` VARCHAR(100) NULL,
    `loan_issued_person` VARCHAR(100) NULL,
    `reg_date` DATE NULL,
    `repayment_start_date` DATE NULL,
    `repayment_end_date` DATE NULL,

    PRIMARY KEY (`emp_loan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_loan_type` (
    `loan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `loan_type` VARCHAR(100) NULL,

    PRIMARY KEY (`loan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_overtime_actual_att` (
    `rid` INTEGER NOT NULL AUTO_INCREMENT,
    `shift_type_id` INTEGER NULL,
    `emp_id` INTEGER NULL,
    `emp_rank_id` INTEGER NULL,
    `emp_dept_id` INTEGER NULL,
    `plan_date` DATE NULL,
    `substituted` BOOLEAN NULL,
    `remark` VARCHAR(100) NULL,

    PRIMARY KEY (`rid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_overtime_plan` (
    `rid` INTEGER NOT NULL AUTO_INCREMENT,
    `shift_type_id` INTEGER NULL,
    `emp_id` INTEGER NULL,
    `emp_rank_id` INTEGER NULL,
    `emp_dept_id` INTEGER NULL,
    `plan_date` DATE NULL,
    `substituted` BOOLEAN NULL,
    `remark` VARCHAR(100) NULL,

    PRIMARY KEY (`rid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_overtime_shift_type` (
    `rid` INTEGER NOT NULL AUTO_INCREMENT,
    `shift_group_name` VARCHAR(100) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `start_time` DATETIME(0) NULL,
    `end_time` DATETIME(0) NULL,
    `serial` INTEGER NULL,

    PRIMARY KEY (`rid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_payroll` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_id` INTEGER NULL,
    `emp_rank_id` INTEGER NULL,
    `emp_dept_id` INTEGER NULL,
    `account_id` INTEGER NULL,
    `allowance_amount` DOUBLE NULL,
    `detection_amount` DOUBLE NULL,
    `transaction_start_date` DATETIME(0) NULL,
    `closed` BOOLEAN NULL DEFAULT false,
    `closed_date` DATETIME(0) NULL,
    `transaction_end_date` DATETIME(0) NULL,

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_payroll_account_head` (
    `account_id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_head` VARCHAR(100) NULL,
    `account_type` BOOLEAN NULL,
    `amount` DOUBLE NULL,

    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_payroll_ledger` (
    `ledger_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ledger_date` DATE NULL,
    `emp_id` VARCHAR(100) NULL,
    `emp_name` VARCHAR(100) NULL,
    `emp_rank` VARCHAR(100) NULL,
    `emp_dept` VARCHAR(100) NULL,
    `allowance_amount` DOUBLE NULL,
    `detection_amount` DOUBLE NULL,
    `net_payment` DOUBLE NULL,
    `issued_date` DATE NULL,

    PRIMARY KEY (`ledger_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_profile` (
    `guid` VARCHAR(100) NOT NULL,
    `employeeID` INTEGER NOT NULL AUTO_INCREMENT,
    `RFID` VARCHAR(100) NULL,
    `employee_name` VARCHAR(100) NOT NULL,
    `DOB` DATE NULL,
    `NRC` VARCHAR(100) NOT NULL,
    `nation` VARCHAR(100) NULL,
    `religion` VARCHAR(100) NULL,
    `father_name` VARCHAR(100) NULL,
    `education` VARCHAR(100) NULL,
    `experience` VARCHAR(100) NULL,
    `last_occupation` VARCHAR(100) NULL,
    `permanent_address` VARCHAR(100) NULL,
    `current_address` VARCHAR(100) NULL,
    `phone_number` VARCHAR(100) NULL,
    `FNRC_img` VARCHAR(100) NULL,
    `BNRC_img` VARCHAR(100) NULL,
    `recommendation_img` VARCHAR(100) NULL,
    `household_chart_img` VARCHAR(100) NULL,
    `employment_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `labor_registration_number` VARCHAR(100) NULL,
    `social_security_number` VARCHAR(100) NULL,
    `profile_image` VARCHAR(100) NULL,
    `married` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `tbl_profile_UN`(`employeeID`),
    UNIQUE INDEX `tbl_profile_employeeID_employee_name_NRC_key`(`employeeID`, `employee_name`, `NRC`),
    PRIMARY KEY (`guid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_rank` (
    `rank_id` INTEGER NOT NULL AUTO_INCREMENT,
    `rank_desc` VARCHAR(100) NULL,
    `salary` DOUBLE NULL,

    UNIQUE INDEX `tbl_rank_rank_id_rank_desc_salary_key`(`rank_id`, `rank_desc`, `salary`),
    PRIMARY KEY (`rank_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_employee_dept` ADD CONSTRAINT `tbl_employee_dept_emp_id_emp_name_nrc_fkey` FOREIGN KEY (`emp_id`, `emp_name`, `nrc`) REFERENCES `tbl_profile`(`employeeID`, `employee_name`, `NRC`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_employee_dept` ADD CONSTRAINT `tbl_employee_dept_dept_id_dept_desc_fkey` FOREIGN KEY (`dept_id`, `dept_desc`) REFERENCES `tbl_department`(`dept_id`, `dept_desc`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_employee_rank` ADD CONSTRAINT `tbl_employee_rank_emp_id_emp_name_nrc_fkey` FOREIGN KEY (`emp_id`, `emp_name`, `nrc`) REFERENCES `tbl_profile`(`employeeID`, `employee_name`, `NRC`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_employee_rank` ADD CONSTRAINT `tbl_employee_rank_emp_dept_id_dept_id_dept_desc_fkey` FOREIGN KEY (`emp_dept_id`, `dept_id`, `dept_desc`) REFERENCES `tbl_employee_dept`(`emp_dept_id`, `dept_id`, `dept_desc`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_employee_rank` ADD CONSTRAINT `tbl_employee_rank_rank_id_rank_desc_salary_fkey` FOREIGN KEY (`rank_id`, `rank_desc`, `salary`) REFERENCES `tbl_rank`(`rank_id`, `rank_desc`, `salary`) ON DELETE CASCADE ON UPDATE CASCADE;
