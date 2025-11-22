// 📋 Catalog Service - Catálogos del sistema
import apiService from "./api";

class CatalogService {
  // ESPECIALIDADES
  async getSpecialties(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/catalogs/especialidades", queryParams);
    } catch (error) {
      console.error("Error fetching specialties:", error);
      throw error;
    }
  }

  async getSpecialtyById(id) {
    try {
      return await apiService.get(`/catalogs/especialidades/${id}`);
    } catch (error) {
      console.error("Error fetching specialty:", error);
      throw error;
    }
  }

  async createSpecialty(specialtyData) {
    try {
      return await apiService.post("/catalogs/especialidades", specialtyData);
    } catch (error) {
      console.error("Error creating specialty:", error);
      throw error;
    }
  }

  async updateSpecialty(id, specialtyData) {
    try {
      return await apiService.put(
        `/catalogs/especialidades/${id}`,
        specialtyData
      );
    } catch (error) {
      console.error("Error updating specialty:", error);
      throw error;
    }
  }

  async deleteSpecialty(id) {
    try {
      return await apiService.delete(`/catalogs/especialidades/${id}`);
    } catch (error) {
      console.error("Error deleting specialty:", error);
      throw error;
    }
  }

  // TIPOS DE SANGRE
  async getBloodTypes(params = {}) {
    try {
      return await apiService.get("/catalogs/tipos-sangre", params);
    } catch (error) {
      console.error("Error fetching blood types:", error);
      throw error;
    }
  }

  async getBloodTypeById(id) {
    try {
      return await apiService.get(`/catalogs/tipos-sangre/${id}`);
    } catch (error) {
      console.error("Error fetching blood type:", error);
      throw error;
    }
  }

  async createBloodType(bloodTypeData) {
    try {
      return await apiService.post("/catalogs/tipos-sangre", bloodTypeData);
    } catch (error) {
      console.error("Error creating blood type:", error);
      throw error;
    }
  }

  async updateBloodType(id, bloodTypeData) {
    try {
      return await apiService.put(
        `/catalogs/tipos-sangre/${id}`,
        bloodTypeData
      );
    } catch (error) {
      console.error("Error updating blood type:", error);
      throw error;
    }
  }

  async deleteBloodType(id) {
    try {
      return await apiService.delete(`/catalogs/tipos-sangre/${id}`);
    } catch (error) {
      console.error("Error deleting blood type:", error);
      throw error;
    }
  }

  // OCUPACIONES
  async getOccupations(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/catalogs/ocupaciones", queryParams);
    } catch (error) {
      console.error("Error fetching occupations:", error);
      throw error;
    }
  }

  async getOccupationById(id) {
    try {
      return await apiService.get(`/catalogs/ocupaciones/${id}`);
    } catch (error) {
      console.error("Error fetching occupation:", error);
      throw error;
    }
  }

  async createOccupation(occupationData) {
    try {
      return await apiService.post("/catalogs/ocupaciones", occupationData);
    } catch (error) {
      console.error("Error creating occupation:", error);
      throw error;
    }
  }

  async updateOccupation(id, occupationData) {
    try {
      return await apiService.put(
        `/catalogs/ocupaciones/${id}`,
        occupationData
      );
    } catch (error) {
      console.error("Error updating occupation:", error);
      throw error;
    }
  }

  async deleteOccupation(id) {
    try {
      return await apiService.delete(`/catalogs/ocupaciones/${id}`);
    } catch (error) {
      console.error("Error deleting occupation:", error);
      throw error;
    }
  }

  // ESTADO CIVIL
  async getMaritalStatuses(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/catalogs/estado-civil", queryParams);
    } catch (error) {
      console.error("Error fetching marital statuses:", error);
      throw error;
    }
  }

  async getMaritalStatusById(id) {
    try {
      return await apiService.get(`/catalogs/estado-civil/${id}`);
    } catch (error) {
      console.error("Error fetching marital status:", error);
      throw error;
    }
  }

  async createMaritalStatus(maritalStatusData) {
    try {
      return await apiService.post("/catalogs/estado-civil", maritalStatusData);
    } catch (error) {
      console.error("Error creating marital status:", error);
      throw error;
    }
  }

  async updateMaritalStatus(id, maritalStatusData) {
    try {
      return await apiService.put(
        `/catalogs/estado-civil/${id}`,
        maritalStatusData
      );
    } catch (error) {
      console.error("Error updating marital status:", error);
      throw error;
    }
  }

  async deleteMaritalStatus(id) {
    try {
      return await apiService.delete(`/catalogs/estado-civil/${id}`);
    } catch (error) {
      console.error("Error deleting marital status:", error);
      throw error;
    }
  }

  // ESTADOS DE CITA
  async getAppointmentStatuses(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/catalogs/estado-cita", queryParams);
    } catch (error) {
      console.error("Error fetching appointment statuses:", error);
      throw error;
    }
  }

  async getAppointmentStatusById(id) {
    try {
      return await apiService.get(`/catalogs/estado-cita/${id}`);
    } catch (error) {
      console.error("Error fetching appointment status:", error);
      throw error;
    }
  }

  async createAppointmentStatus(appointmentStatusData) {
    try {
      return await apiService.post(
        "/catalogs/estado-cita",
        appointmentStatusData
      );
    } catch (error) {
      console.error("Error creating appointment status:", error);
      throw error;
    }
  }

  async updateAppointmentStatus(id, appointmentStatusData) {
    try {
      return await apiService.put(
        `/catalogs/estado-cita/${id}`,
        appointmentStatusData
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  }

  async deleteAppointmentStatus(id) {
    try {
      return await apiService.delete(`/catalogs/estado-cita/${id}`);
    } catch (error) {
      console.error("Error deleting appointment status:", error);
      throw error;
    }
  }

  // TIPOS DE CITA
  async getAppointmentTypes(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/catalogs/tipo-cita", queryParams);
    } catch (error) {
      console.error("Error fetching appointment types:", error);
      throw error;
    }
  }

  async getAppointmentTypeById(id) {
    try {
      return await apiService.get(`/catalogs/tipo-cita/${id}`);
    } catch (error) {
      console.error("Error fetching appointment type:", error);
      throw error;
    }
  }

  async createAppointmentType(appointmentTypeData) {
    try {
      return await apiService.post("/catalogs/tipo-cita", appointmentTypeData);
    } catch (error) {
      console.error("Error creating appointment type:", error);
      throw error;
    }
  }

  async updateAppointmentType(id, appointmentTypeData) {
    try {
      return await apiService.put(
        `/catalogs/tipo-cita/${id}`,
        appointmentTypeData
      );
    } catch (error) {
      console.error("Error updating appointment type:", error);
      throw error;
    }
  }

  async deleteAppointmentType(id) {
    try {
      return await apiService.delete(`/catalogs/tipo-cita/${id}`);
    } catch (error) {
      console.error("Error deleting appointment type:", error);
      throw error;
    }
  }

  // ESTADOS DE CONSULTA
  async getConsultationStatuses(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/catalogs/estado-consulta", queryParams);
    } catch (error) {
      console.error("Error fetching consultation statuses:", error);
      throw error;
    }
  }

  async getConsultationStatusById(id) {
    try {
      return await apiService.get(`/catalogs/estado-consulta/${id}`);
    } catch (error) {
      console.error("Error fetching consultation status:", error);
      throw error;
    }
  }

  async createConsultationStatus(consultationStatusData) {
    try {
      return await apiService.post(
        "/catalogs/estado-consulta",
        consultationStatusData
      );
    } catch (error) {
      console.error("Error creating consultation status:", error);
      throw error;
    }
  }

  async updateConsultationStatus(id, consultationStatusData) {
    try {
      return await apiService.put(
        `/catalogs/estado-consulta/${id}`,
        consultationStatusData
      );
    } catch (error) {
      console.error("Error updating consultation status:", error);
      throw error;
    }
  }

  async deleteConsultationStatus(id) {
    try {
      return await apiService.delete(`/catalogs/estado-consulta/${id}`);
    } catch (error) {
      console.error("Error deleting consultation status:", error);
      throw error;
    }
  }

  // ESTADOS DE CÓDIGO
  async getCodeStatuses(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/catalogs/estado-codigo", queryParams);
    } catch (error) {
      console.error("Error fetching code statuses:", error);
      throw error;
    }
  }

  async getCodeStatusById(id) {
    try {
      return await apiService.get(`/catalogs/estado-codigo/${id}`);
    } catch (error) {
      console.error("Error fetching code status:", error);
      throw error;
    }
  }

  async createCodeStatus(codeStatusData) {
    try {
      return await apiService.post("/catalogs/estado-codigo", codeStatusData);
    } catch (error) {
      console.error("Error creating code status:", error);
      throw error;
    }
  }

  async updateCodeStatus(id, codeStatusData) {
    try {
      return await apiService.put(
        `/catalogs/estado-codigo/${id}`,
        codeStatusData
      );
    } catch (error) {
      console.error("Error updating code status:", error);
      throw error;
    }
  }

  async deleteCodeStatus(id) {
    try {
      return await apiService.delete(`/catalogs/estado-codigo/${id}`);
    } catch (error) {
      console.error("Error deleting code status:", error);
      throw error;
    }
  }
}

const catalogService = new CatalogService();
export default catalogService;
