import React, { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import fileService from "../../services/fileService";
import patientService from "../../services/patientService";
import doctorService from "../../services/doctorService";
import appointmentService from "../../services/appointmentService";
import "../users/Users.css";

const Associations = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    tipo: "",
    url: "",
    hash_integridad: "",
    // Campos de asociación
    entidad: "",
    entidad_id: "",
    descripcion: "",
  });

  // Estados para las opciones de entidades
  const [entityOptions, setEntityOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Cargar solo las asociaciones
  const loadAssociations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fileService.getFileAssociations({});

      console.log("Associations response:", response);
      console.log("Associations data:", response.data);

      const allAssociations = response.data || [];

      // Filtrar por término de búsqueda si existe
      const filtered = searchTerm
        ? allAssociations.filter(
            (assoc) =>
              assoc.archivo_url
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              assoc.entidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              assoc.descripcion
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              assoc.autor?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : allAssociations;

      // Paginación
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginated = filtered.slice(startIndex, endIndex);

      setFiles(paginated);
      setTotalFiles(filtered.length);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    } catch (error) {
      console.error("Error loading associations:", error);
      setError(`Error al cargar las asociaciones: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssociations();
  }, [currentPage, searchTerm]);

  // Cargar opciones cuando se selecciona una entidad
  useEffect(() => {
    const loadEntityOptions = async () => {
      if (!formData.entidad) {
        setEntityOptions([]);
        setFormData((prev) => ({ ...prev, entidad_id: "" }));
        return;
      }

      setLoadingOptions(true);
      try {
        let options = [];

        switch (formData.entidad) {
          case "PACIENTE":
            const patientsRes = await patientService.getPatients({
              limit: 1000,
            });
            options = (patientsRes.data || []).map((p) => ({
              id: p.id,
              label: `${p.nombre} (ID: ${p.id})`,
            }));
            break;

          case "MEDICO":
            const doctorsRes = await doctorService.getDoctors({
              limit: 1000,
            });
            options = (doctorsRes.data || []).map((d) => ({
              id: d.id,
              label: `${d.nombre} (ID: ${d.id})`,
            }));
            break;

          case "CONSULTA":
            const consultationsRes = await appointmentService.getConsultations({
              limit: 1000,
            });
            options = (consultationsRes.data || []).map((c) => ({
              id: c.id,
              label: `Consulta #${c.id} - ${c.paciente || "N/A"} (${
                c.fecha_hora
                  ? new Date(c.fecha_hora).toLocaleDateString()
                  : "Sin fecha"
              })`,
            }));
            break;

          case "EPISODIO":
            const episodesRes = await appointmentService.getEpisodes({
              limit: 1000,
            });
            options = (episodesRes.data || []).map((e) => ({
              id: e.id,
              label: `Episodio #${e.id} - ${e.paciente || "N/A"}`,
            }));
            break;

          case "CITA":
            const appointmentsRes = await appointmentService.getAppointments({
              limit: 1000,
            });
            options = (appointmentsRes.data || []).map((a) => ({
              id: a.id,
              label: `Cita #${a.id} - ${a.paciente || "N/A"} (${
                a.fecha_inicio
                  ? new Date(a.fecha_inicio).toLocaleDateString()
                  : "Sin fecha"
              })`,
            }));
            break;

          default:
            options = [];
        }

        setEntityOptions(options);
      } catch (error) {
        console.error("Error loading entity options:", error);
        setEntityOptions([]);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadEntityOptions();
  }, [formData.entidad]);

  const handleAdd = () => {
    setFormData({
      tipo: "",
      url: "",
      hash_integridad: "",
      entidad: "",
      entidad_id: "",
      descripcion: "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (association) => {
    if (window.confirm(`¿Está seguro de eliminar esta asociación?`)) {
      try {
        await fileService.deleteFileAssociation(association.id);
        loadAssociations();
      } catch (error) {
        console.error("Error deleting association:", error);
        setError("Error al eliminar la asociación");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fileService.uploadFile(formData);
      setIsModalOpen(false);
      loadAssociations();
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error al subir el archivo");
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    {
      header: "Archivo",
      accessor: "archivo_url",
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: "500" }}>{value || "N/A"}</div>
          <small style={{ color: "#666", fontSize: "12px" }}>
            {row.archivo_tipo || ""}
          </small>
        </div>
      ),
    },
    {
      header: "Entidad",
      accessor: "entidad",
      render: (value, row) => (
        <div>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: "4px",
              backgroundColor: "#e3f2fd",
              color: "#1976d2",
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            {value || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "ID Entidad",
      accessor: "entidad_id",
      render: (value) => value || "N/A",
    },
    {
      header: "Descripción",
      accessor: "descripcion",
      render: (value) => value || "Sin descripción",
    },
    {
      header: "Autor",
      accessor: "autor",
      render: (value) => value || "Sistema",
    },
    {
      header: "Fecha Asociación",
      accessor: "fecha_creacion",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "N/A"),
    },
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Asociaciones de Archivos</h1>
          <p className="page-description">Cargando asociaciones...</p>
        </div>
        <Loading message="Cargando asociaciones..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Asociaciones de Archivos</h1>
          <p className="page-description">
            Visualización de asociaciones de archivos con entidades (
            {totalFiles} asociaciones)
          </p>
          {error && (
            <div className="alert alert-warning">
              ⚠️ {error}
              <button
                onClick={loadAssociations}
                className="btn btn-sm btn-outline"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Registrar Archivo
        </button>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por archivo, entidad, descripción o autor..."
          />
        </div>

        <Table
          columns={columns}
          data={files}
          onDelete={handleDelete}
          onEdit={null}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Archivo"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">URL del Archivo *</label>
            <input
              type="text"
              className="form-control"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              required
              placeholder="http://ejemplo.com/archivo.pdf"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo (MIME) *</label>
            <input
              type="text"
              className="form-control"
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: e.target.value })
              }
              required
              placeholder="application/pdf, image/jpeg, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hash de Integridad</label>
            <input
              type="text"
              className="form-control"
              value={formData.hash_integridad}
              onChange={(e) =>
                setFormData({ ...formData, hash_integridad: e.target.value })
              }
              placeholder="Opcional"
            />
          </div>

          <hr
            style={{
              margin: "20px 0",
              border: "none",
              borderTop: "1px solid #e0e0e0",
            }}
          />
          <h3
            style={{
              marginBottom: "15px",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Asociación (Opcional)
          </h3>
          <p style={{ marginBottom: "15px", fontSize: "14px", color: "#666" }}>
            Si proporcionas estos datos, el archivo se asociará automáticamente
            con la entidad especificada.
          </p>

          <div className="form-group">
            <label className="form-label">Entidad</label>
            <select
              className="form-control"
              value={formData.entidad}
              onChange={(e) =>
                setFormData({ ...formData, entidad: e.target.value })
              }
            >
              <option value="">Selecciona una entidad...</option>
              <option value="PACIENTE">Paciente</option>
              <option value="MEDICO">Médico</option>
              <option value="CONSULTA">Consulta</option>
              <option value="EPISODIO">Episodio</option>
              <option value="CITA">Cita</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              {formData.entidad
                ? formData.entidad === "PACIENTE"
                  ? "Paciente"
                  : formData.entidad === "MEDICO"
                  ? "Médico"
                  : formData.entidad === "CONSULTA"
                  ? "Consulta"
                  : formData.entidad === "EPISODIO"
                  ? "Episodio"
                  : formData.entidad === "CITA"
                  ? "Cita"
                  : "Entidad"
                : "Selecciona una entidad primero"}
            </label>
            {loadingOptions ? (
              <div style={{ padding: "10px", textAlign: "center" }}>
                <Loading message="Cargando opciones..." size="small" />
              </div>
            ) : (
              <select
                className="form-control"
                value={formData.entidad_id}
                onChange={(e) =>
                  setFormData({ ...formData, entidad_id: e.target.value })
                }
                disabled={!formData.entidad || entityOptions.length === 0}
                required={formData.entidad ? true : false}
              >
                <option value="">
                  {formData.entidad
                    ? entityOptions.length === 0
                      ? "No hay opciones disponibles"
                      : "Selecciona una opción..."
                    : "Selecciona primero una entidad"}
                </option>
                {entityOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            <small className="form-text">
              {formData.entidad
                ? entityOptions.length === 0
                  ? "No hay opciones disponibles para esta entidad"
                  : `Selecciona el ${formData.entidad.toLowerCase()} al que asociar este archivo`
                : "Selecciona primero una entidad"}
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              placeholder="Ej: Foto de perfil, Documento médico, etc."
            />
            <small className="form-text">
              Descripción de la asociación (ej: "Foto de perfil" para
              pacientes/médicos)
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Associations;
