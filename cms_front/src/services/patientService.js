// 🏥 Patient Service - Gestión de pacientes
import apiService from "./api";

class PatientService {
  // Obtener lista de pacientes
  async getPatients(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/patients", queryParams);
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  }

  // Obtener paciente por ID
  async getPatientById(id) {
    try {
      return await apiService.get(`/patients/${id}`);
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw error;
    }
  }

  // Crear paciente
  async createPatient(patientData) {
    try {
      return await apiService.post("/patients", patientData);
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  }

  // Actualizar paciente
  async updatePatient(id, patientData) {
    try {
      return await apiService.put(`/patients/${id}`, patientData);
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  }

  // Eliminar paciente
  async deletePatient(id) {
    try {
      return await apiService.delete(`/patients/${id}`);
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  }

  // Obtener direcciones del paciente
  async getPatientAddresses(patientId) {
    try {
      return await apiService.get(`/patients/${patientId}/addresses`);
    } catch (error) {
      console.error("Error fetching patient addresses:", error);
      throw error;
    }
  }

  // Crear dirección del paciente
  async createPatientAddress(patientId, addressData) {
    try {
      return await apiService.post(
        `/patients/${patientId}/addresses`,
        addressData
      );
    } catch (error) {
      console.error("Error creating patient address:", error);
      throw error;
    }
  }

  // Actualizar dirección del paciente
  async updatePatientAddress(patientId, addressId, addressData) {
    try {
      return await apiService.put(
        `/patients/${patientId}/addresses/${addressId}`,
        addressData
      );
    } catch (error) {
      console.error("Error updating patient address:", error);
      throw error;
    }
  }

  // Eliminar dirección del paciente
  async deletePatientAddress(patientId, addressId) {
    try {
      return await apiService.delete(
        `/patients/${patientId}/addresses/${addressId}`
      );
    } catch (error) {
      console.error("Error deleting patient address:", error);
      throw error;
    }
  }
}

const patientService = new PatientService();
export default patientService;
