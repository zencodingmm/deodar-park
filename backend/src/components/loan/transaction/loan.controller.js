const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        const {
            emp_id,
            emp_name,
            nrc,
            emp_dept_id,
            dept_id,
            dept_desc,
            emp_rank_id,
            rank_id,
            rank_desc,
            loan_id,
            loan_type,
            loan_amount,
            loan_request_date,
            loan_submittion_date,
            loan_insurance_person,
            loan_issued_person,
            repayment_start_date,
            repayment_end_date,
            loan_submited_detail,
        } = req.body;

        const requestDate = new Date(loan_request_date);
        const requestDateFormatted = `${requestDate.getFullYear()}-${requestDate.getMonth() + 1}-${requestDate.getDate().toString().padStart(2, '0')}`;

        const submittionDate = new Date(loan_submittion_date);
        const submittionDateFormatted = `${submittionDate.getFullYear()}-${submittionDate.getMonth() + 1}-${submittionDate.getDate().toString().padStart(2, '0')}`;

        const startDate = new Date(repayment_start_date);
        const startDateFormatted = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate().toString().padStart(2, '0')}`;

        const endDate = new Date(repayment_end_date);
        const endDateFormatted = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate().toString().padStart(2, '0')}`;

        await prisma.tbl_loan_record
            .create({
                data: {
                    loan_amount,
                    loan_request_date: new Date(requestDateFormatted),
                    loan_submittion_date: new Date(submittionDateFormatted),
                    loan_insurance_person,
                    loan_issued_person,
                    repayment_start_date: new Date(startDateFormatted),
                    repayment_end_date: new Date(endDateFormatted),
                    loan_submited_detail,
                    employee: {
                        connect: { employeeID: emp_id, employee_name: emp_name, NRC: nrc },
                    },
                    department: {
                        connect: { emp_dept_id, dept_id, dept_desc },
                    },
                    rank: {
                        connect: { emp_rank_id, rank_id, rank_desc },
                    },
                    loan: {
                        connect: { loan_id, loan_type },
                    },
                },
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong');
            });

        res.status(201).json({ message: 'Loan record created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_loan_type.update({
            where: { loan_id: Number(id) },
            data: req.body,
        });

        res.status(200).json({ message: 'Loan record updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (page && pageSize) {
            const [loan, totalRecord] = await prisma.$transaction([
                prisma.tbl_loan_type.findMany({
                    skip,
                    take: Number(pageSize),
                }),
                prisma.tbl_loan_type.count(),
            ]);

            res.status(200).json({ data: loan, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_loan_type.delete({ where: { loan_id: Number(id) } });

        res.status(200).json({ message: 'Loan record deleted successfully' });
    } catch (error) {
        res.status(200).json({ error: error.message });
    }
};
