const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file.controller");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

// Files
router.get("/", fileController.getFiles);
router.post("/", fileController.createFile);
router.put("/:id", fileController.updateFile);
router.delete("/:id", fileController.deleteFile);

// File Associations (las asociaciones se crean automáticamente al crear archivos)
router.get("/associations", fileController.getFileAssociations); // ?archivo_id=X
// router.post("/associations", fileController.createFileAssociation); // Deshabilitado - usar creación de archivo con asociación
// router.put("/associations/:id", fileController.updateFileAssociation); // Deshabilitado
router.delete("/associations/:id", fileController.deleteFileAssociation); // Habilitado para eliminar asociaciones

module.exports = router;
