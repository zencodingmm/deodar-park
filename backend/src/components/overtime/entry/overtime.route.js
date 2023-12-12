const router = require('express').Router();
const { createHandler, updateHandler, getAllHandler, deleteHandler } = require('./overtime.controller');

router.route('/').get(getAllHandler).post(createHandler);
router.route('/:id').put(updateHandler).delete(deleteHandler);

module.exports = router;
