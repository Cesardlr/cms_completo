import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import appointmentService from "../../services/appointmentService";
import "../users/Users.css";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalConsultations, setTotalConsultations] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getConsultations({
        search: searchTerm || undefined,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });

      setConsultations(response.data || []);
      setTotalConsultations(response.pagination?.total || 0);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage)
      );
    } catch (err) {
      console.error("Error loading consultations:", err);
      setError("Error al cargar las consultas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [currentPage, searchTerm]);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Paciente", accessor: "paciente" },
    { header: "Médico", accessor: "medico" },
    {
      header: "Fecha",
      accessor: "fecha_hora",
      render: (value) =>
        value ? new Date(value).toLocaleString("es-MX") : "Sin definir",
    },
    {
      header: "Estado",
      accessor: "estado_consulta",
      render: (value) => (
        <span className="badge badge-info">{value || "Sin estado"}</span>
      ),
    },
    {
      header: "Diagnóstico",
      accessor: "diagnostico_final",
      render: (value) => value || "N/A",
    },
  ];

  if (loading) {
    return <Loading message="Cargando consultas..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Consultas</h1>
          <p className="page-description">
            Historial de consultas registradas en el sistema
          </p>
        </div>
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
            placeholder="Buscar por paciente o médico..."
          />
        </div>

        <Table columns={columns} data={consultations} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Consultations;
