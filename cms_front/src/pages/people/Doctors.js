import React, { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import doctorService from "../../services/doctorService";
import catalogService from "../../services/catalogService";
import "../users/Users.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    usuario_id: "",
    nombre: "",
    cedula: "",
    id_especialidad: "",
    descripcion: "",
    id_direccion: null,
    telefono: "",
    correo: "",
    ubicacion: "",
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDoctors();
    loadSpecialties();
  }, [currentPage, searchTerm]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorService.getDoctors({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });

      setDoctors(response.data || []);
      setTotalDoctors(response.pagination?.total || 0);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage)
      );
    } catch (error) {
      console.error("Error loading doctors:", error);
      setError("Error al cargar los médicos");
    } finally {
      setLoading(false);
    }
  };

  const loadSpecialties = async () => {
    try {
      const response = await catalogService.getSpecialties();
      setSpecialties(response.data || []);
    } catch (error) {
      console.error("Error loading specialties:", error);
    }
  };

  const handleAdd = () => {
    setEditingDoctor(null);
    setFormData({
      usuario_id: "",
      nombre: "",
      cedula: "",
      id_especialidad: "",
      descripcion: "",
      id_direccion: null,
      telefono: "",
      correo: "",
      ubicacion: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      usuario_id: doctor.usuario_id || "",
      nombre: doctor.nombre || "",
      cedula: doctor.cedula,
      id_especialidad: doctor.id_especialidad || "",
      descripcion: doctor.descripcion || "",
      id_direccion: doctor.id_direccion || null,
      telefono: doctor.telefono || "",
      correo: doctor.correo || "",
      ubicacion: doctor.ubicacion || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (doctor) => {
    if (
      window.confirm(`¿Está seguro de eliminar al médico ${doctor.username}?`)
    ) {
      try {
        await doctorService.deleteDoctor(doctor.id);
        await loadDoctors(); // Recargar la lista
      } catch (error) {
        console.error("Error deleting doctor:", error);
        setError("Error al eliminar el médico");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDoctor) {
        await doctorService.updateDoctor(editingDoctor.id, formData);
      } else {
        await doctorService.createDoctor(formData);
      }

      setIsModalOpen(false);
      await loadDoctors(); // Recargar la lista
    } catch (error) {
      console.error("Error saving doctor:", error);
      setError("Error al guardar el médico");
    }
  };

  // Los datos ya vienen filtrados del backend
  const paginatedDoctors = doctors;

  const columns = [
    {
      header: "Foto",
      accessor: "foto_perfil",
      render: (value) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {value ? (
            <img
              src={value}
              alt="Profile"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
          ) : null}
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#e0e0e0",
              display: value ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            👨‍⚕️
          </div>
        </div>
      ),
    },
    { header: "ID", accessor: "id" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Usuario", accessor: "username" },
    { header: "Cédula", accessor: "cedula" },
    { header: "Especialidad", accessor: "especialidad" },
    { header: "Email", accessor: "correo" },
    { header: "Teléfono", accessor: "telefono" },
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Médicos</h1>
          <p className="page-description">Cargando médicos...</p>
        </div>
        <Loading message="Cargando médicos..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Médicos</h1>
          <p className="page-description">
            Gestión de médicos del sistema ({totalDoctors} médicos)
          </p>
          {error && (
            <div className="alert alert-warning">
              ⚠️ {error}
              <button onClick={loadDoctors} className="btn btn-sm btn-outline">
                Reintentar
              </button>
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Agregar Médico
        </button>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar médicos..."
          />
        </div>

        <Table
          columns={columns}
          data={paginatedDoctors}
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
        title={editingDoctor ? "Editar Médico" : "Nuevo Médico"}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <div className="form-group">
              <label className="form-label">ID de Usuario *</label>
              <input
                type="number"
                className="form-control"
                value={formData.usuario_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usuario_id: parseInt(e.target.value),
                  })
                }
                required
                placeholder="ID del usuario vinculado"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nombre Completo *</label>
              <input
                type="text"
                className="form-control"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
                placeholder="Nombre completo del médico"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cédula Profesional *</label>
              <input
                type="text"
                className="form-control"
                value={formData.cedula}
                onChange={(e) =>
                  setFormData({ ...formData, cedula: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Especialidad *</label>
              <select
                className="form-control form-select"
                value={formData.id_especialidad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_especialidad: parseInt(e.target.value),
                  })
                }
                required
              >
                <option value="">Seleccionar...</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                placeholder="+52 81 1234 5678"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ubicación</label>
              <input
                type="text"
                className="form-control"
                value={formData.ubicacion}
                onChange={(e) =>
                  setFormData({ ...formData, ubicacion: e.target.value })
                }
                placeholder="Consultorio 301, Torre Médica, Monterrey"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ID Dirección</label>
              <input
                type="number"
                className="form-control"
                value={formData.id_direccion || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_direccion: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows={3}
              placeholder="Descripción profesional, especialidades, experiencia..."
            />
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
              {editingDoctor ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Doctors;
