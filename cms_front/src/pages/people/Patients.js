import React, { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import patientService from "../../services/patientService";
import catalogService from "../../services/catalogService";
import "../users/Users.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [maritalStatuses, setMaritalStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    usuario_id: "",
    nombre: "",
    fecha_nacimiento: "",
    sexo: "",
    altura: "",
    peso: "",
    estilo_vida: "",
    alergias: "",
    id_tipo_sangre: "",
    id_ocupacion: "",
    id_estado_civil: "",
    id_medico_gen: "",
    telefono: "",
    correo: "",
    direccion: "",
    ocupacion: "",
    nss: "",
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    loadPatients();
    loadCatalogs();
  }, [currentPage, searchTerm]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientService.getPatients({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });

      console.log("Patients response:", response);
      setPatients(response.data || []);
      setTotalPatients(response.pagination?.total || 0);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage)
      );
    } catch (error) {
      console.error("Error loading patients:", error);
      setError("Error al cargar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogs = async () => {
    try {
      const [bloodTypesRes, occupationsRes, maritalStatusesRes] =
        await Promise.all([
          catalogService.getBloodTypes(),
          catalogService.getOccupations(),
          catalogService.getMaritalStatuses(),
        ]);

      setBloodTypes(bloodTypesRes.data || []);
      setOccupations(occupationsRes.data || []);
      setMaritalStatuses(maritalStatusesRes.data || []);
    } catch (error) {
      console.error("Error loading catalogs:", error);
    }
  };

  const handleAdd = () => {
    setEditingPatient(null);
    setFormData({
      usuario_id: "",
      nombre: "",
      fecha_nacimiento: "",
      sexo: "",
      altura: "",
      peso: "",
      estilo_vida: "",
      alergias: "",
      id_tipo_sangre: "",
      id_ocupacion: "",
      id_estado_civil: "",
      id_medico_gen: "",
      telefono: "",
      correo: "",
      direccion: "",
      ocupacion: "",
      nss: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      usuario_id: patient.usuario_id || "",
      nombre: patient.nombre || "",
      fecha_nacimiento: patient.fecha_nacimiento || "",
      sexo: patient.sexo || "",
      altura: patient.altura || "",
      peso: patient.peso || "",
      estilo_vida: patient.estilo_vida || "",
      alergias: patient.alergias || "",
      id_tipo_sangre: patient.id_tipo_sangre || "",
      id_ocupacion: patient.id_ocupacion || "",
      id_estado_civil: patient.id_estado_civil || "",
      id_medico_gen: patient.id_medico_gen || "",
      telefono: patient.telefono || "",
      correo: patient.correo || "",
      direccion: patient.direccion || "",
      ocupacion: patient.ocupacion || "",
      nss: patient.nss || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (patient) => {
    if (
      window.confirm(
        `¿Está seguro de eliminar al paciente ${patient.username}?`
      )
    ) {
      try {
        await patientService.deletePatient(patient.id);
        await loadPatients(); // Recargar la lista
      } catch (error) {
        console.error("Error deleting patient:", error);
        setError("Error al eliminar el paciente");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingPatient) {
        await patientService.updatePatient(editingPatient.id, formData);
      } else {
        await patientService.createPatient(formData);
      }

      setIsModalOpen(false);
      await loadPatients(); // Recargar la lista
    } catch (error) {
      console.error("Error saving patient:", error);
      setError("Error al guardar el paciente");
    }
  };

  // Los datos ya vienen filtrados del backend
  const paginatedPatients = patients;

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
            👤
          </div>
        </div>
      ),
    },
    { header: "ID", accessor: "id" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Usuario", accessor: "username" },
    { header: "Email", accessor: "correo" },
    { header: "Teléfono", accessor: "telefono" },
    { header: "Fecha Nacimiento", accessor: "fecha_nacimiento" },
    { header: "Sexo", accessor: "sexo" },
    { header: "Tipo Sangre", accessor: "tipo_sangre" },
    {
      header: "Médico General",
      accessor: "medico_gen",
      render: (value) => value || "N/A",
    },
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Pacientes</h1>
          <p className="page-description">Cargando pacientes...</p>
        </div>
        <Loading message="Cargando pacientes..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pacientes</h1>
          <p className="page-description">
            Gestión de pacientes del sistema ({totalPatients} pacientes)
          </p>
          {error && (
            <div className="alert alert-warning">
              ⚠️ {error}
              <button onClick={loadPatients} className="btn btn-sm btn-outline">
                Reintentar
              </button>
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Agregar Paciente
        </button>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar pacientes..."
          />
        </div>

        <Table
          columns={columns}
          data={paginatedPatients}
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
        title={editingPatient ? "Editar Paciente" : "Nuevo Paciente"}
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
                placeholder="Nombre completo del paciente"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Nacimiento *</label>
              <input
                type="date"
                className="form-control"
                value={formData.fecha_nacimiento}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_nacimiento: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sexo *</label>
              <select
                className="form-control form-select"
                value={formData.sexo}
                onChange={(e) =>
                  setFormData({ ...formData, sexo: e.target.value })
                }
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Altura (cm)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.altura}
                onChange={(e) =>
                  setFormData({ ...formData, altura: e.target.value })
                }
                placeholder="Ej: 170.5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.peso}
                onChange={(e) =>
                  setFormData({ ...formData, peso: e.target.value })
                }
                placeholder="Ej: 70.5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estilo de Vida</label>
              <input
                type="text"
                className="form-control"
                value={formData.estilo_vida}
                onChange={(e) =>
                  setFormData({ ...formData, estilo_vida: e.target.value })
                }
                placeholder="Ej: Sedentario, Activo, etc."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alergias</label>
              <input
                type="text"
                className="form-control"
                value={formData.alergias}
                onChange={(e) =>
                  setFormData({ ...formData, alergias: e.target.value })
                }
                placeholder="Ej: Penicilina, Polen, etc."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Sangre</label>
              <select
                className="form-control form-select"
                value={formData.id_tipo_sangre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_tipo_sangre: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Seleccionar...</option>
                {bloodTypes.map((bloodType) => (
                  <option key={bloodType.id} value={bloodType.id}>
                    {bloodType.tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ocupación</label>
              <select
                className="form-control form-select"
                value={formData.id_ocupacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_ocupacion: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Seleccionar...</option>
                {occupations.map((occupation) => (
                  <option key={occupation.id} value={occupation.id}>
                    {occupation.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado Civil</label>
              <select
                className="form-control form-select"
                value={formData.id_estado_civil}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_estado_civil: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Seleccionar...</option>
                {maritalStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ID Médico General</label>
              <input
                type="number"
                className="form-control"
                value={formData.id_medico_gen || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_medico_gen: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                placeholder="Opcional"
              />
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
                placeholder="Ej: +52 81 1234 5678"
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
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                placeholder="Dirección completa"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ocupación (Texto)</label>
              <input
                type="text"
                className="form-control"
                value={formData.ocupacion}
                onChange={(e) =>
                  setFormData({ ...formData, ocupacion: e.target.value })
                }
                placeholder="Descripción de la ocupación"
              />
            </div>

            <div className="form-group">
              <label className="form-label">NSS (Número Seguro Social)</label>
              <input
                type="text"
                className="form-control"
                value={formData.nss}
                onChange={(e) =>
                  setFormData({ ...formData, nss: e.target.value })
                }
                placeholder="Número de Seguro Social"
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
              {editingPatient ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Patients;
