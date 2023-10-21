const express = require("express");
const commentsController = require("../controllers/commentController");

const router = express.Router();

router.get("/:id", commentsController.getComments);
router.post("/:id", commentsController.addComments);
router.delete("/:id", commentsController.deleteComments);

module.exports = router;
