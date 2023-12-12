const router = require('express').Router();
const {
    createHandler,
    updateHandler,
    getAllHandler,
    deleteHandler,
    searchHandler,
} = require('./rank.controller');

router.route('/').get(getAllHandler).post(createHandler);
router.route('/:id').put(updateHandler).delete(deleteHandler);
router.route('/search').get(searchHandler);

module.exports = router;
