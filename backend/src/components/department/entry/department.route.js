const router = require("express").Router();
const { createHandler, getAllHandler, updateHandler, deleteHandler } = require("./department.controller");

router.route("/").get(getAllHandler).post(createHandler);
router.route("/:id").put(updateHandler).delete(deleteHandler);

module.exports = router;
