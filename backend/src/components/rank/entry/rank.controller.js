const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        await prisma.tbl_rank.create({ data: req.body }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(201).json({ message: 'Rank Type created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_rank
            .update({
                where: { rank_id: Number(id) },
                data: { ...req.body, salary: Number(req.body.salary) },
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        res.status(200).json({ message: 'Rank Type updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (!page && !pageSize) {
            const rank = await prisma.tbl_rank.findMany().catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            if (!rank) {
                throw new Error('Rank not found');
            }

            return res.status(200).json({ data: rank });
        }

        if (page && pageSize) {
            const [rank, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_rank.findMany({
                        skip,
                        take: Number(pageSize),
                    }),
                    prisma.tbl_rank.count(),
                ])
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            return res.status(200).json({ data: rank, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_rank.delete({ where: { rank_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'Rank Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchHandler = async (req, res) => {
    try {
        const { id } = req.query;

        if (id) {
            const rank = await prisma.tbl_employee_rank.findUnique({ where: { emp_id: Number(id) } }).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            if (!rank) {
                throw new Error('This employee not set rank.');
            }

            return res.status(200).json({ data: rank });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
