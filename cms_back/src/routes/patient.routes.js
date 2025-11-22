const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

// Patient CRUD
router.get("/", patientController.getPatients);
router.get("/:id", patientController.getPatientById);
router.post("/", patientController.createPatient);
router.put("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);

// Patient Addresses
router.get("/:id/addresses", patientController.getPatientAddresses);
router.post("/:id/addresses", patientController.createPatientAddress);
router.put("/:id/addresses/:addressId", patientController.updatePatientAddress);
router.delete(
  "/:id/addresses/:addressId",
  patientController.deletePatientAddress
);

module.exports = router;
