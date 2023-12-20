const router = require("express").Router();
const {
  createHandler,
  updateHandler,
  getAllHandler,
  deleteHandler,
} = require("./loan.controller");

router.route("/").get(getAllHandler).post(createHandler);
router.route("/:id").put(updateHandler).delete(deleteHandler);
router.route("/search").get();

module.exports = router;
