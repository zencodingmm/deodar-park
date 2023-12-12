const router = require("express").Router();
const { create, search, update } = require("./profile.controller");

router.route("/").post(create);
router.route("/:id").put(update);
router.route("/search").get(search);

module.exports = router;
