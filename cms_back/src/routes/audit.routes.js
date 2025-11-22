const express = require("express");
const router = express.Router();
const auditController = require("../controllers/audit.controller");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

router.get("/", auditController.getAuditLogs);
router.get("/stats", auditController.getAuditStats);

module.exports = router;
