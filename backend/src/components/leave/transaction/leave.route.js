const router = require("express").Router();
const { createHandler, getAllHandler, updateHandler, deleteHandler } = require("./leave.controller");

router.route("/").get(getAllHandler).post(createHandler);
router.route("/:id").put(updateHandler).delete(deleteHandler);
router.route("/search").get();

module.exports = router;
