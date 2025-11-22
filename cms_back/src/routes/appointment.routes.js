const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

// Appointments (Citas)
router.get("/citas", appointmentController.getAppointments);
router.post("/citas", appointmentController.createAppointment);
router.put("/citas/:id", appointmentController.updateAppointment);
router.delete("/citas/:id", appointmentController.deleteAppointment);

// Consultations (Consultas)
router.get("/consultas", appointmentController.getConsultations);
router.post("/consultas", appointmentController.createConsultation);
router.put("/consultas/:id", appointmentController.updateConsultation);
router.delete("/consultas/:id", appointmentController.deleteConsultation);

// Episodes (Episodios)
router.get("/episodios", appointmentController.getEpisodes);
router.post("/episodios", appointmentController.createEpisode);
router.patch("/episodios/:id/close", appointmentController.closeEpisode); // Close episode
router.delete("/episodios/:id", appointmentController.deleteEpisode);

module.exports = router;
