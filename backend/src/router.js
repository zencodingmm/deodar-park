const router = require('express').Router();

// Entry
const profileRouter = require('./components/profile/profile.route');
const EntryDepartment = require('./components/department/entry/department.route');
const EntryInsurance = require('./components/insurance/entry/insurance.route');
const EntryLeave = require('./components/leave/entry/leave.route');
const EntryLoan = require('./components/loan/entry/loan.route');
const EntryRank = require('./components/rank/entry/rank.route');
const EntryPayRoll = require('./components/payroll/entry/payroll.route');
const EntryOvertimeShift = require('./components/overtime/entry/overtime.route');

// ---------------------------

// Transaction
const TransactionDepartment = require('./components/department/transaction/department.route');
const TransactionRank = require('./components/rank/transaction/rank.route');
const TransactionInsurance = require('./components/insurance/transaction/insurance.route');
const TransactionLeave = require('./components/leave/transaction/leave.route');
const TransactionLoan = require('./components/loan/transaction/loan.route');

// ---------------------------

router.use('/profile', profileRouter);
// ---------------------------

// Entry
router.use('/department/entry', EntryDepartment);
router.use('/insurance/entry', EntryInsurance);
router.use('/leave/entry', EntryLeave);
router.use('/loan/entry', EntryLoan);
router.use('/rank/entry', EntryRank);
router.use('/payroll/entry', EntryPayRoll);
router.use('/overtime/entry', EntryOvertimeShift);
// ---------------------------

// Transaction
router.use('/department/transaction', TransactionDepartment);
router.use('/rank/transaction', TransactionRank);
router.use('/insurance/transaction', TransactionInsurance);
router.use('/leave/transaction', TransactionLeave);
router.use('/loan/transaction', TransactionLoan);
// ---------------------------

module.exports = router;
