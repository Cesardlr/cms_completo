// 📝 Audit Service - Gestión de auditoría y estadísticas
import apiService from "./api";

class AuditService {
  // LOGS DE AUDITORÍA
  async getAuditLogs(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;
      if (params.entidad) queryParams.entidad = params.entidad;
      if (params.accion) queryParams.accion = params.accion;
      if (params.fecha_desde) queryParams.fecha_desde = params.fecha_desde;
      if (params.fecha_hasta) queryParams.fecha_hasta = params.fecha_hasta;
      if (params.usuario_id) queryParams.usuario_id = params.usuario_id;

      return await apiService.get("/audit", queryParams);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  }

  async getAuditLogById(id) {
    try {
      return await apiService.get(`/audit/${id}`);
    } catch (error) {
      console.error("Error fetching audit log:", error);
      throw error;
    }
  }

  // ESTADÍSTICAS DE AUDITORÍA
  async getAuditStats(params = {}) {
    try {
      return await apiService.get("/audit/stats", params);
    } catch (error) {
      console.error("Error fetching audit stats:", error);
      throw error;
    }
  }
}

const auditService = new AuditService();
export default auditService;
