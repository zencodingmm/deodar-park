const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        const department = await prisma.tbl_department.create({ data: req.body });

        res.status(201).json({ message: 'Department created successfully', data: department });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;

        const department = await prisma.tbl_department.update({ where: { dept_id: Number(id) }, data: req.body });

        res.status(200).json({ message: 'Department updated successfully', data: department });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (!page && !pageSize) {
            const department = await prisma.tbl_department.findMany();

            if (!department) {
                throw new Error('Department not found');
            }

            return res.status(200).json({ data: department });
        }

        if (page && pageSize) {
            const [department, totalRecord] = await prisma.$transaction([
                prisma.tbl_department.findMany({
                    skip,
                    take: Number(pageSize),
                }),
                prisma.tbl_department.count(),
            ]);

            if (!totalRecord) {
                throw new Error('Department not found');
            }

            return res.status(200).json({ data: department, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_department.delete({ where: { dept_id: Number(id) } });

        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
