const express = require("express");
const router = express.Router();
const healthController = require("../controllers/health.controller");

// Health check endpoints (sin autenticación para monitoreo)
router.get("/", healthController.getHealth);
router.get("/database", healthController.getDatabaseHealth);
router.get("/api", healthController.getApiHealth);
router.get("/system", healthController.getSystemHealth);

module.exports = router;
