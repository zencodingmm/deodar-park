const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        await prisma.tbl_insurance_type.create({ data: req.body });

        res.status(201).json({ message: 'Insruance Type created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_insurance_type.update({ where: { iid: Number(id) }, data: req.body });

        res.status(200).json({ message: 'Insruance Type updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (!page && !pageSize) {
            const insurance = await prisma.tbl_insurance_type.findMany();

            if (insurance.length === 0) {
                throw new Error('Insurance Type not found');
            }

            return res.status(200).json({ data: insurance });
        }

        if (page && pageSize) {
            const [insurance, totalRecord] = await prisma.$transaction([
                prisma.tbl_insurance_type.findMany({
                    skip,
                    take: Number(pageSize),
                }),
                prisma.tbl_insurance_type.count(),
            ]);

            if (!totalRecord) {
                throw new Error('Insurance Type not found');
            }

            res.status(200).json({ data: insurance, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_insurance_type.delete({ where: { iid: Number(id) } });

        res.status(200).json({ message: 'Insurance Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
