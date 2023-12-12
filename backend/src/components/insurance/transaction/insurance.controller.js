const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        const {
            emp_id,
            emp_name,
            nrc,
            emp_rank_id,
            rank_id,
            rank_desc,
            emp_dept_id,
            dept_id,
            dept_desc,
            iid,
            insurance_type,
        } = req.body;

        await prisma.tbl_emp_insurance
            .create({
                data: {
                    employee: {
                        connect: { employeeID: emp_id, employee_name: emp_name, NRC: nrc },
                    },
                    department: { connect: { emp_dept_id, dept_id, dept_desc } },
                    rank: { connect: { emp_rank_id, rank_id, rank_desc } },
                    insurance: { connect: { iid, insurance_type } },
                },
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        res.status(201).json({ message: 'Employee Insurance created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;

        const {
            emp_id,
            emp_name,
            nrc,
            emp_rank_id,
            rank_id,
            rank_desc,
            emp_dept_id,
            dept_id,
            dept_desc,
            iid,
            insurance_type,
        } = req.body;

        await prisma.tbl_emp_insurance.update({
            where: { emp_ins_id: Number(id) }, data: {
                employee: {
                    connect: { employeeID: emp_id, employee_name: emp_name, NRC: nrc },
                },
                department: {
                    connect: { emp_dept_id, dept_id, dept_desc },
                },
                rank: {
                    connect: { emp_rank_id, rank_id, rank_desc },
                },
                insurance: {
                    connect: { iid, insurance_type },
                },
            },
        }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'Employee Insurance updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (page && pageSize) {
            const [insurance, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_emp_insurance.findMany({
                        skip,
                        take: Number(pageSize),
                    }),
                    prisma.tbl_emp_insurance.count(),
                ])
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            if (!totalRecord) {
                throw new Error('Employee Insurance not found');
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

        await prisma.tbl_emp_insurance.delete({ where: { emp_ins_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong.');
        });

        res.status(200).json({ message: 'Employee Insurance deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
