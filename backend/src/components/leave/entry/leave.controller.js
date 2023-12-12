const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        await prisma.tbl_leave_type.create({ data: req.body });
        res.status(201).json({ message: 'Leave Type created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_leave_type.update({
            where: { lev_id: Number(id) },
            data: { ...req.body, lev_day: Number(req.body.lev_day) },
        });

        res.status(200).json({ message: 'Leave Type updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (!page && !pageSize) {
            const leave = await prisma.tbl_leave_type.findMany().catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            if (!leave.length) {
                throw new Error('Leave type not found');
            }

            res.status(200).json({ data: leave });
        }

        if (page && pageSize) {
            const [leaves, totalRecord] = await prisma.$transaction([
                prisma.tbl_leave_type.findMany({
                    skip,
                    take: Number(pageSize),
                }),
                prisma.tbl_leave_type.count(),
            ]);

            if (!leaves) {
                throw new Error('Leave Type not found');
            }

            res.status(200).json({ data: leaves, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_leave_type.delete({ where: { lev_id: Number(id) } });

        res.status(200).json({ message: 'Leave Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
