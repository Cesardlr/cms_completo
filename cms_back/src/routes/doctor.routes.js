const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

router.get("/", doctorController.getDoctors);
router.get("/:id", doctorController.getDoctorById);
router.post("/", doctorController.createDoctor);
router.put("/:id", doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;
