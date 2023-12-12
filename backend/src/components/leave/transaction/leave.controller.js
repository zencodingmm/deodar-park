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
            lev_id,
            lev_type,
            total_leave_days,
            leave_detail,
            leave_start_date,
            leave_end_date,
            approved_person,
            approved_date,
        } = req.body;

        const startDate = new Date(leave_start_date);
        const startDateFormat = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate().toString().padStart(2, '0')}`;

        const endDate = new Date(leave_end_date);
        const endDateFormat = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate().toString().padStart(2, '0')}`;

        const approvedDate = new Date(approved_date);
        const approvedDateFormat = `${approvedDate.getFullYear()}-${approvedDate.getMonth() + 1}-${approvedDate.getDate().toString().padStart(2, '0')}`;

        await prisma.tbl_emp_leave.create({
            data: {
                total_leave_days,
                leave_detail,
                leave_start_date: new Date(startDateFormat),
                leave_end_date: new Date(endDateFormat),
                approved_person,
                approved_date: new Date(approvedDateFormat),
                employee: {
                    connect: { employeeID: emp_id, employee_name: emp_name, NRC: nrc },
                },
                department: {
                    connect: { emp_dept_id, dept_id, dept_desc },
                },
                rank: {
                    connect: { emp_rank_id, rank_id, rank_desc },
                },
                leave: {
                    connect: { lev_id, lev_type },
                },
            },
        }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(201).json({ message: 'Leave Type created successfully' });
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
            lev_id,
            lev_type,
            total_leave_days,
            leave_detail,
            leave_start_date,
            leave_end_date,
            approved_person,
            approved_date,
        } = req.body;

        const startDate = new Date(leave_start_date);
        const startDateFormat = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate().toString().padStart(2, '0')}`;

        const endDate = new Date(leave_end_date);
        const endDateFormat = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate().toString().padStart(2, '0')}`;

        const approvedDate = new Date(approved_date);
        const approvedDateFormat = `${approvedDate.getFullYear()}-${approvedDate.getMonth() + 1}-${approvedDate.getDate().toString().padStart(2, '0')}`;

        await prisma.tbl_emp_leave.update({
            where: { emp_lev_id: Number(id) },
            data: {
                total_leave_days,
                leave_detail,
                leave_start_date: new Date(startDateFormat),
                leave_end_date: new Date(endDateFormat),
                approved_person,
                approved_date: new Date(approvedDateFormat),
                employee: {
                    connect: { employeeID: emp_id, employee_name: emp_name, NRC: nrc },
                },
                department: {
                    connect: { emp_dept_id, dept_id, dept_desc },
                },
                rank: {
                    connect: { emp_rank_id, rank_id, rank_desc },
                },
                leave: {
                    connect: { lev_id, lev_type },
                },
            },
        }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
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

        if (page && pageSize) {
            const [leaves, totalRecord] = await prisma.$transaction([
                prisma.tbl_emp_leave.findMany({
                    skip,
                    take: Number(pageSize),
                }),
                prisma.tbl_emp_leave.count(),
            ]).catch(error => {
                console.log(error);
                throw new Error('Something Wrong!');
            });

            if (!totalRecord) {
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

        await prisma.tbl_emp_leave.delete({ where: { emp_lev_id: Number(id) } }).catch(error => {
            console.log(error);
            throw new Error('Something Wrong!');
        });

        res.status(200).json({ message: 'Leave Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
