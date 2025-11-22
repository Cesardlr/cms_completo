import React, { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import { exportToCSV, exportToPDF } from "../../utils/exportUtils";
import auditService from "../../services/auditService";
import "../users/Users.css";

const Audit = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    user: "",
    entity: "",
    action: "",
    dateFrom: "",
    dateTo: "",
  });

  const itemsPerPage = 10;

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await auditService.getAuditLogs({
        search: searchTerm || undefined,
        entidad: filters.entity || undefined,
        accion: filters.action || undefined,
        fecha_desde: filters.dateFrom || undefined,
        fecha_hasta: filters.dateTo || undefined,
        usuario_id: filters.user || undefined,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });

      console.log("Audit logs response:", response);
      setAuditLogs(response.data || []);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage)
      );
    } catch (error) {
      console.error("Error loading audit logs:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [currentPage, searchTerm, filters]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      user: "",
      entity: "",
      action: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const exportData = auditLogs.map((log) => ({
      ID: log.id,
      Usuario:
        typeof log.username === "object"
          ? log.username?.username || log.username?.correo || "N/A"
          : log.username || log.user || "N/A",
      Entidad:
        typeof log.entidad === "object"
          ? log.entidad?.nombre || log.entidad?.name || "N/A"
          : log.entidad || log.entity || "N/A",
      Accion: log.accion || log.action || "N/A",
      Descripcion:
        typeof log.detalle === "object"
          ? JSON.stringify(log.detalle)
          : log.detalle || log.description || "N/A",
      Fecha:
        typeof log.fecha_hora === "object"
          ? log.fecha_hora?.fecha_hora || log.fecha_hora?.date || "N/A"
          : log.fecha_hora || log.date || "N/A",
    }));
    exportToCSV(exportData, "auditoria");
  };

  const handleExportPDF = () => {
    const exportData = auditLogs.map((log) => ({
      ID: log.id,
      Usuario:
        typeof log.username === "object"
          ? log.username?.username || log.username?.correo || "N/A"
          : log.username || log.user || "N/A",
      Entidad:
        typeof log.entidad === "object"
          ? log.entidad?.nombre || log.entidad?.name || "N/A"
          : log.entidad || log.entity || "N/A",
      Accion: log.accion || log.action || "N/A",
      Descripcion:
        typeof log.detalle === "object"
          ? JSON.stringify(log.detalle)
          : log.detalle || log.description || "N/A",
      Fecha:
        typeof log.fecha_hora === "object"
          ? log.fecha_hora?.fecha_hora || log.fecha_hora?.date || "N/A"
          : log.fecha_hora || log.date || "N/A",
    }));
    exportToPDF(exportData, "auditoria", "Registro de Auditoría");
  };

  const columns = [
    { header: "ID", accessor: "id" },
    {
      header: "Usuario",
      accessor: "username",
      render: (value, row) => {
        // Si value es un objeto, extraer el username
        if (typeof value === "object" && value !== null) {
          return value.username || value.correo || "N/A";
        }
        return value || row.user || "N/A";
      },
    },
    {
      header: "Entidad",
      accessor: "entidad",
      render: (value, row) => {
        // Si value es un objeto, extraer el nombre de la entidad
        if (typeof value === "object" && value !== null) {
          return value.nombre || value.name || "N/A";
        }
        return value || row.entity || "N/A";
      },
    },
    {
      header: "Acción",
      accessor: "accion",
      render: (value, row) => {
        const actionValue = value || row.action || "N/A";
        const colors = {
          CREATE: "badge-success",
          UPDATE: "badge-warning",
          DELETE: "badge-danger",
          READ: "badge-info",
        };
        return (
          <span className={`badge ${colors[actionValue] || "badge-info"}`}>
            {actionValue}
          </span>
        );
      },
    },
    {
      header: "Descripción",
      accessor: "detalle",
      render: (value, row) => {
        // Si value es un objeto, convertirlo a string
        if (typeof value === "object" && value !== null) {
          return JSON.stringify(value);
        }
        return value || row.description || "N/A";
      },
    },
    {
      header: "Fecha",
      accessor: "fecha_hora",
      render: (value, row) => {
        // Si value es un objeto, extraer la fecha
        if (typeof value === "object" && value !== null) {
          return value.fecha_hora || value.date || "N/A";
        }
        return value || row.date || "N/A";
      },
    },
  ];

  if (loading) {
    return <Loading message="Cargando registros de auditoría..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="text-center py-4">
            <h3>Error al cargar auditoría</h3>
            <p className="text-muted">{error}</p>
            <button className="btn btn-primary" onClick={loadAuditLogs}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Auditoría</h1>
          <p className="page-description">
            Registro de actividades del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={handleExportCSV}>
            📄 Exportar CSV
          </button>
          <button className="btn btn-outline" onClick={handleExportPDF}>
            📑 Exportar PDF
          </button>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-toolbar">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar en auditoría..."
          />
        </div>

        <div
          style={{
            padding: "16px",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          <div className="grid grid-cols-4 gap-2">
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <select
                className="form-control form-select"
                value={filters.user}
                onChange={(e) => handleFilterChange("user", e.target.value)}
              >
                <option value="">Todos</option>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Entidad</label>
              <select
                className="form-control form-select"
                value={filters.entity}
                onChange={(e) => handleFilterChange("entity", e.target.value)}
              >
                <option value="">Todas</option>
                <option value="USUARIO">USUARIO</option>
                <option value="PACIENTE">PACIENTE</option>
                <option value="CITA">CITA</option>
                <option value="CONSULTA">CONSULTA</option>
                <option value="ARCHIVO">ARCHIVO</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Acción</label>
              <select
                className="form-control form-select"
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
              >
                <option value="">Todas</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="READ">READ</option>
              </select>
            </div>

            <div className="form-group">
              <button
                className="btn btn-outline"
                style={{ marginTop: "24px" }}
                onClick={handleClearFilters}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={auditLogs} actions={false} />

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

export default Audit;
