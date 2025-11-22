// 👨‍⚕️ Doctor Service - Gestión de médicos
import apiService from "./api";

class DoctorService {
  // Obtener lista de médicos
  async getDoctors(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/doctors", queryParams);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  }

  // Obtener médico por ID
  async getDoctorById(id) {
    try {
      return await apiService.get(`/doctors/${id}`);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      throw error;
    }
  }

  // Crear médico
  async createDoctor(doctorData) {
    try {
      return await apiService.post("/doctors", doctorData);
    } catch (error) {
      console.error("Error creating doctor:", error);
      throw error;
    }
  }

  // Actualizar médico
  async updateDoctor(id, doctorData) {
    try {
      return await apiService.put(`/doctors/${id}`, doctorData);
    } catch (error) {
      console.error("Error updating doctor:", error);
      throw error;
    }
  }

  // Eliminar médico
  async deleteDoctor(id) {
    try {
      return await apiService.delete(`/doctors/${id}`);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      throw error;
    }
  }
}

const doctorService = new DoctorService();
export default doctorService;
