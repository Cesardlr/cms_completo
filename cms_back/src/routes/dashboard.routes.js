const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

// Dashboard endpoints
router.get("/kpis", dashboardController.getKPIs);
router.get("/charts", dashboardController.getCharts);
router.get("/", dashboardController.getDashboardData); // Get all (KPIs + Charts)

module.exports = router;
