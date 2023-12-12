const prisma = require('../../../config/db.config');

exports.createHandler = async (req, res) => {
    try {
        await prisma.tbl_employee_dept.create({ data: req.body }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(201).json({ message: 'Department created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;

        const department = await prisma.tbl_employee_dept.update({ where: { emp_dept_id: Number(id) }, data: req.body }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'Department updated successfully', data: department });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (page && pageSize) {
            const [department, totalRecord] = await prisma
                .$transaction([
                    prisma.tbl_employee_dept.findMany({
                        skip,
                        take: Number(pageSize),
                    }),
                    prisma.tbl_employee_dept.count(),
                ])
                .catch(error => {
                    console.log(error);
                    throw new Error('Something Wrong!');
                });

            if (!totalRecord) {
                throw new Error('Employee Department not found');
            }

            res.status(200).json({ data: department, totalRecord });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.tbl_employee_dept.delete({ where: { emp_dept_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.searchHandler = async (req, res) => {
    try {
        const { id } = req.query;

        const emp_dept = await prisma.tbl_employee_dept
            .findUnique({
                where: {
                    emp_id: Number(id),
                },
            })
            .catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

        if (!emp_dept) {
            throw new Error('This employee not set department.');
        }

        res.status(200).json({ data: emp_dept });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
