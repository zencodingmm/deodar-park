const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        const { emp_dept_id, emp_id, emp_name, nrc, dept_id, dept_desc, rank_id, rank_desc, salary, assign_date } = req.body;

        const date = new Date(assign_date);
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate().toString().padStart(2, '0')}`;

        await prisma.tbl_employee_rank.create({
            data: {
                assign_date: new Date(formattedDate),
                employee: { connect: { employeeID: emp_id, employee_name: emp_name, NRC: nrc } },
                employee_department: { connect: { emp_dept_id, dept_id, dept_desc } },
                rank: { connect: { rank_id, rank_desc, salary } },
            },
        });

        res.status(201).json({ message: 'Rank Type created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const { rank_id, rank_desc, salary, assign_date } = req.body;

        const date = new Date(assign_date);
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate().toString().padStart(2, '0')}`;

        await prisma.tbl_employee_rank.update({
            where: { emp_rank_id: Number(id) },
            data: {
                rank_id,
                rank_desc,
                salary,
                assign_date: new Date(formattedDate),
            },
        });

        res.status(200).json({ message: 'Rank Type updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize, showAll } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (!page && !pageSize) {
            const rank = await prisma.tbl_employee_rank.findMany();

            if (!rank.length) {
                throw new Error('Rank not found');
            }

            return res.status(200).json({ data: rank });
        }

        if (page && pageSize) {
            if (showAll === 'filter') {
                const rank = await prisma.$queryRaw`
                    SELECT * FROM tbl_employee_rank A
                    INNER JOIN (
                        SELECT emp_id, MAX(emp_rank_id) as emp_rank_id
                        FROM tbl_employee_rank
                        GROUP BY emp_id
                    ) B
                    ON A.emp_rank_id = B.emp_rank_id
                    ORDER BY A.emp_rank_id ASC
                    LIMIT ${pageSize}
                    OFFSET ${skip};
                `;

                if (!rank.length) {
                    throw new Error('Employee Rank not found');
                }

                const totalRecord = await prisma.tbl_employee_rank.count();

                return res.status(200).json({ data: rank, totalRecord });
            }

            const rank = await prisma.tbl_employee_rank.findMany({
                orderBy: { created_at: 'asc' },
                skip,
                take: Number(pageSize),
            });

            const totalRecord = await prisma.tbl_employee_rank.count();

            return res.status(200).json({ data: rank, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    const id = req.params.id;

    try {
        await prisma.tbl_employee_rank.delete({
            where: { emp_rank_id: Number(id) },
        });

        res.status(200).json({ message: 'Rank Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchHandler = async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            const data = await prisma.tbl_employee_rank.findMany({ where: { emp_id: Number(id) }, orderBy: { emp_rank_id: 'desc' }, take: 1 }).catch(error => {
                console.log(error)
                throw new Error('Something Wrong!');
            });

            if (data.length === 0) {
                throw new Error('This employee not set rank.');
            }

            return res.status(200).json({ data: data[0] });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
