import React, { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import appointmentService from "../../services/appointmentService";
import "../users/Users.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    paciente_id: "",
    medico_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    id_tipo_cita: "",
    id_estado_cita: "",
  });

  // Cargar citas
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointments({
        search: searchTerm || undefined,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });

      console.log("Appointments response:", response);
      setAppointments(response.data || []);
      setTotalAppointments(response.pagination?.total || 0);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage)
      );
    } catch (error) {
      console.error("Error loading appointments:", error);
      setError("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente y cuando cambie la búsqueda o página
  useEffect(() => {
    loadAppointments();
  }, [currentPage, searchTerm]);

  const handleAdd = () => {
    setEditingAppointment(null);
    setFormData({
      paciente_id: "",
      medico_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      id_tipo_cita: "",
      id_estado_cita: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      paciente_id: appointment.paciente_id || "",
      medico_id: appointment.medico_id || "",
      fecha_inicio: appointment.fecha_inicio
        ? new Date(appointment.fecha_inicio).toISOString().slice(0, 16)
        : "",
      fecha_fin: appointment.fecha_fin
        ? new Date(appointment.fecha_fin).toISOString().slice(0, 16)
        : "",
      id_tipo_cita: appointment.id_tipo_cita || "",
      id_estado_cita: appointment.id_estado_cita || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (appointment) => {
    if (window.confirm(`¿Está seguro de eliminar esta cita?`)) {
      try {
        await appointmentService.deleteAppointment(appointment.id);
        await loadAppointments(); // Recargar la lista
      } catch (error) {
        console.error("Error deleting appointment:", error);
        setError("Error al eliminar la cita");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAppointment) {
        await appointmentService.updateAppointment(
          editingAppointment.id,
          formData
        );
      } else {
        await appointmentService.createAppointment(formData);
      }

      setIsModalOpen(false);
      await loadAppointments(); // Recargar la lista
    } catch (error) {
      console.error("Error saving appointment:", error);
      setError("Error al guardar la cita");
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    {
      header: "Paciente",
      accessor: "paciente",
      render: (value) => value || "N/A",
    },
    {
      header: "Médico",
      accessor: "medico",
      render: (value) => value || "N/A",
    },
    {
      header: "Fecha Inicio",
      accessor: "fecha_inicio",
      render: (value) =>
        value ? new Date(value).toLocaleString("es-MX") : "Sin definir",
    },
    {
      header: "Fecha Fin",
      accessor: "fecha_fin",
      render: (value) =>
        value ? new Date(value).toLocaleString("es-MX") : "Sin definir",
    },
    { header: "Tipo", accessor: "tipo" },
    {
      header: "Estado",
      accessor: "estado",
      render: (value) => {
        const colors = {
          Confirmada: "badge-success",
          Pendiente: "badge-warning",
          Cancelada: "badge-danger",
          Completada: "badge-info",
        };
        return (
          <span className={`badge ${colors[value] || "badge-info"}`}>
            {value}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Citas</h1>
          <p className="page-description">Gestión de citas médicas</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Agregar Cita
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="card">
        <div className="card-toolbar">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar citas..."
          />
        </div>

        <Table
          columns={columns}
          data={appointments}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
        title={editingAppointment ? "Editar Cita" : "Nueva Cita"}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <div className="form-group">
              <label className="form-label">ID Paciente *</label>
              <input
                type="number"
                className="form-control"
                value={formData.paciente_id}
                onChange={(e) =>
                  setFormData({ ...formData, paciente_id: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">ID Médico *</label>
              <input
                type="number"
                className="form-control"
                value={formData.medico_id}
                onChange={(e) =>
                  setFormData({ ...formData, medico_id: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">ID Tipo de Cita *</label>
              <input
                type="number"
                className="form-control"
                value={formData.id_tipo_cita}
                onChange={(e) =>
                  setFormData({ ...formData, id_tipo_cita: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha Inicio *</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.fecha_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha Fin</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.fecha_fin}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_fin: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">ID Estado de Cita *</label>
              <input
                type="number"
                className="form-control"
                value={formData.id_estado_cita}
                onChange={(e) =>
                  setFormData({ ...formData, id_estado_cita: e.target.value })
                }
                required
              />
            </div>
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
              {editingAppointment ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
