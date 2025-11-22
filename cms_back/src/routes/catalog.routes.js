const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  especialidadHandlers,
  tipoSangreHandlers,
  ocupacionHandlers,
  estadoCivilHandlers,
  estadoCitaHandlers,
  tipoCitaHandlers,
  estadoConsultaHandlers,
  estadoCodigoHandlers,
} = require("../controllers/catalog.controller");

// All routes require authentication
router.use(authenticateToken);

// Especialidades
router.get("/especialidades", especialidadHandlers.getAll);
router.get("/especialidades/:id", especialidadHandlers.getById);
router.post("/especialidades", especialidadHandlers.create);
router.put("/especialidades/:id", especialidadHandlers.update);
router.delete("/especialidades/:id", especialidadHandlers.delete);

// Tipos de Sangre
router.get("/tipos-sangre", tipoSangreHandlers.getAll);
router.get("/tipos-sangre/:id", tipoSangreHandlers.getById);
router.post("/tipos-sangre", tipoSangreHandlers.create);
router.put("/tipos-sangre/:id", tipoSangreHandlers.update);
router.delete("/tipos-sangre/:id", tipoSangreHandlers.delete);

// Ocupaciones
router.get("/ocupaciones", ocupacionHandlers.getAll);
router.get("/ocupaciones/:id", ocupacionHandlers.getById);
router.post("/ocupaciones", ocupacionHandlers.create);
router.put("/ocupaciones/:id", ocupacionHandlers.update);
router.delete("/ocupaciones/:id", ocupacionHandlers.delete);

// Estado Civil
router.get("/estado-civil", estadoCivilHandlers.getAll);
router.get("/estado-civil/:id", estadoCivilHandlers.getById);
router.post("/estado-civil", estadoCivilHandlers.create);
router.put("/estado-civil/:id", estadoCivilHandlers.update);
router.delete("/estado-civil/:id", estadoCivilHandlers.delete);

// Estado Cita
router.get("/estado-cita", estadoCitaHandlers.getAll);
router.get("/estado-cita/:id", estadoCitaHandlers.getById);
router.post("/estado-cita", estadoCitaHandlers.create);
router.put("/estado-cita/:id", estadoCitaHandlers.update);
router.delete("/estado-cita/:id", estadoCitaHandlers.delete);

// Tipo Cita
router.get("/tipo-cita", tipoCitaHandlers.getAll);
router.get("/tipo-cita/:id", tipoCitaHandlers.getById);
router.post("/tipo-cita", tipoCitaHandlers.create);
router.put("/tipo-cita/:id", tipoCitaHandlers.update);
router.delete("/tipo-cita/:id", tipoCitaHandlers.delete);

// Estado Consulta
router.get("/estado-consulta", estadoConsultaHandlers.getAll);
router.get("/estado-consulta/:id", estadoConsultaHandlers.getById);
router.post("/estado-consulta", estadoConsultaHandlers.create);
router.put("/estado-consulta/:id", estadoConsultaHandlers.update);
router.delete("/estado-consulta/:id", estadoConsultaHandlers.delete);

// Estado Código
router.get("/estado-codigo", estadoCodigoHandlers.getAll);
router.get("/estado-codigo/:id", estadoCodigoHandlers.getById);
router.post("/estado-codigo", estadoCodigoHandlers.create);
router.put("/estado-codigo/:id", estadoCodigoHandlers.update);
router.delete("/estado-codigo/:id", estadoCodigoHandlers.delete);

module.exports = router;
