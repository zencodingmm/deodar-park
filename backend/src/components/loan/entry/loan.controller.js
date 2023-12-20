const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        await prisma.tbl_loan_type.create({ data: req.body });

        res.status(201).json({ message: 'Loan Type created successfully' });
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

        res.status(200).json({ message: 'Loan Type updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (!page && !pageSize) {
            const loan = await prisma.tbl_loan_type.findMany();

            return res.status(200).json({ data: loan });
        }

        if (page && pageSize) {
            const [loan, totalRecord] = await prisma.$transaction([
                prisma.tbl_loan_type.findMany({
                    skip,
                    take: Number(pageSize),
                }),
                prisma.tbl_loan_type.count(),
            ]);

            return res.status(200).json({ data: loan, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_loan_type.delete({ where: { loan_id: Number(id) } });

        res.status(200).json({ message: 'Loan Type deleted successfully' });
    } catch (error) {
        res.status(200).json({ error: error.message });
    }
};
