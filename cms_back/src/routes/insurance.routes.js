const express = require("express");
const router = express.Router();
const insuranceController = require("../controllers/insurance.controller");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

// Insurance Companies
router.get("/companies", insuranceController.getInsuranceCompanies);
router.get("/companies/:id", insuranceController.getInsuranceCompanyById);
router.post("/companies", insuranceController.createInsuranceCompany);
router.put("/companies/:id", insuranceController.updateInsuranceCompany);
router.delete("/companies/:id", insuranceController.deleteInsuranceCompany);

// Policies
router.get("/policies", insuranceController.getPolicies);
router.get("/policies/:id", insuranceController.getPolicyById);
router.post("/policies", insuranceController.createPolicy);
router.put("/policies/:id", insuranceController.updatePolicy);
router.delete("/policies/:id", insuranceController.deletePolicy);

module.exports = router;
