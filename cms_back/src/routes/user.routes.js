const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/:id/password", userController.updatePassword);
router.delete("/:id", userController.deleteUser);

module.exports = router;
