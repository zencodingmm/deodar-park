const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        await prisma.tbl_payroll_account_head.create({
            data: { ...req.body, account_type: Boolean(req.body.account_type) },
        });

        res.status(201).json({ message: 'Payroll Account Head Created Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_payroll_account_head.update({
            where: { account_id: Number(id) },
            data: {
                ...req.body,
                account_type: Boolean(req.body.account_type),
                amount: Number(req.body.amount),
            },
        });

        res.status(200).json({ message: 'Payroll Account Head Updated Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (page && pageSize) {
            const [payroll, totalRecord] = await prisma.$transaction([
                prisma.tbl_payroll_account_head.findMany({
                    skip,
                    take: Number(pageSize),
                }),
                prisma.tbl_payroll_account_head.count(),
            ]);

            res.status(200).json({ data: payroll, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.tbl_payroll_account_head.delete({ where: { account_id: Number(id) } });

        res.status(200).json({ message: 'Payroll Account Head Updated Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
