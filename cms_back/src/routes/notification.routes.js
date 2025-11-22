const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

// Notifications
router.get("/", notificationController.getNotifications);
router.post("/", notificationController.createNotification);
router.put("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

// Access Codes
router.get("/access-codes", notificationController.getAccessCodes);
router.post("/access-codes", notificationController.createAccessCode);
router.put("/access-codes/:id", notificationController.updateAccessCode);
router.delete("/access-codes/:id", notificationController.deleteAccessCode);

module.exports = router;
