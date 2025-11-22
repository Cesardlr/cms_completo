import React, { useState, useEffect } from "react";
import healthService from "../../services/healthService";
import Loading from "./Loading";

const SystemStatus = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkSystemHealth();
    // Verificar cada 30 segundos
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      setLoading(true);
      const data = await healthService.getAllServicesHealth();
      setHealthData(data);
      setError(null);
    } catch (err) {
      console.error("Error checking system health:", err);
      setError("Error al verificar el estado del sistema");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
      case "operational":
      case "available":
        return "text-green-600 bg-green-100";
      case "unhealthy":
      case "offline":
        return "text-red-600 bg-red-100";
      case "unknown":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
      case "operational":
      case "available":
        return "✅";
      case "unhealthy":
      case "offline":
        return "❌";
      case "unknown":
        return "⚠️";
      default:
        return "❓";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "healthy":
      case "operational":
      case "available":
        return "Operativo";
      case "unhealthy":
      case "offline":
        return "Fuera de línea";
      case "unknown":
        return "Desconocido";
      default:
        return "Indefinido";
    }
  };

  if (loading && !healthData) {
    return (
      <div className="system-status-card">
        <div className="card-header">
          <h3 className="card-title">Estado del Sistema</h3>
        </div>
        <div className="card-body">
          <Loading message="Verificando estado..." size="small" />
        </div>
      </div>
    );
  }
  console.log(healthData);

  return (
    <div className="system-status-card">
      <div className="card-header">
        <h3 className="card-title">
          🏥 Estado del Sistema
          <button
            onClick={checkSystemHealth}
            className="btn btn-sm btn-outline ml-2"
            disabled={loading}
          >
            {loading ? "🔄" : "🔄 Actualizar"}
          </button>
        </h3>
        <p className="card-description">
          Última verificación:{" "}
          {healthData?.timestamp
            ? new Date(healthData.timestamp).toLocaleTimeString("es-ES")
            : "N/A"}
        </p>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger mb-4">⚠️ {error}</div>}

        <div className="status-grid">
          {/* Estado General del Sistema */}
          <div className="status-item">
            <div className="status-header">
              <span className="status-icon">
                {getStatusIcon(healthData?.system?.status)}
              </span>
              <span className="status-label">Sistema General</span>
            </div>
            <div
              className={`status-badge ${getStatusColor(
                healthData?.system?.status
              )}`}
            >
              {getStatusText(healthData?.system?.status)}
            </div>
            {healthData?.system?.overall && (
              <div className="status-detail">
                Estado: {healthData.system.overall}
              </div>
            )}
          </div>

          {/* Estado de la Base de Datos */}
          <div className="status-item">
            <div className="status-header">
              <span className="status-icon">
                {getStatusIcon(healthData?.database?.status)}
              </span>
              <span className="status-label">Base de Datos</span>
            </div>
            <div
              className={`status-badge ${getStatusColor(
                healthData?.database?.status
              )}`}
            >
              {getStatusText(healthData?.database?.status)}
            </div>
            {healthData?.database?.details?.responseTime && (
              <div className="status-detail">
                Tiempo de respuesta: {healthData.database.details.responseTime}
              </div>
            )}
          </div>
          {/* Estado de la API */}
          <div className="status-item">
            <div className="status-header">
              <span className="status-icon">
                {getStatusIcon(healthData?.api?.status)}
              </span>
              <span className="status-label">API REST</span>
            </div>
            <div
              className={`status-badge ${getStatusColor(
                healthData?.api?.status
              )}`}
            >
              {getStatusText(healthData?.api?.status)}
            </div>
            {healthData?.api?.details?.status && (
              <div className="status-detail">
                Estado: {healthData.api.details.status}
              </div>
            )}
          </div>
        </div>

        {/* Detalles adicionales */}
        {(healthData?.system?.error ||
          healthData?.database?.error ||
          healthData?.api?.error) && (
          <div className="status-details mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Detalles de Errores:
            </h4>
            <div className="space-y-2">
              {healthData?.system?.error && (
                <div className="text-xs text-red-600">
                  <strong>Sistema:</strong> {healthData.system.error}
                </div>
              )}
              {healthData?.database?.error && (
                <div className="text-xs text-red-600">
                  <strong>Base de Datos:</strong> {healthData.database.error}
                </div>
              )}
              {healthData?.api?.error && (
                <div className="text-xs text-red-600">
                  <strong>API:</strong> {healthData.api.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información de servicios del sistema */}
        {healthData?.system?.services && (
          <div className="status-details mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Información del Sistema:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Memoria del sistema */}
              {healthData.system.services.memory && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-xs font-semibold text-gray-600 mb-2">
                    💾 Uso de Memoria
                  </h5>
                  <div className="text-xs space-y-1">
                    <div>
                      Usado: {healthData.system.services.memory.used}{" "}
                      {healthData.system.services.memory.unit}
                    </div>
                    <div>
                      Total: {healthData.system.services.memory.total}{" "}
                      {healthData.system.services.memory.unit}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (healthData.system.services.memory.used /
                              healthData.system.services.memory.total) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Estado de servicios */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="text-xs font-semibold text-gray-600 mb-2">
                  🔧 Servicios
                </h5>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span>API:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        healthData.system.services.api
                      )}`}
                    >
                      {getStatusText(healthData.system.services.api)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Base de Datos:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        healthData.system.services.database
                      )}`}
                    >
                      {getStatusText(healthData.system.services.database)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Endpoints de la API */}
        {healthData?.api?.details?.endpoints && (
          <div className="status-details mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              📡 Endpoints de la API:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(healthData.api.details.endpoints).map(
                ([endpoint, status]) => (
                  <div
                    key={endpoint}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-medium">{endpoint}:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusText(status)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatus;
