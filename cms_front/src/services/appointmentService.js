// 📅 Appointment Service - Gestión de citas, consultas y episodios
import apiService from "./api";

class AppointmentService {
  // CITAS
  async getAppointments(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;
      if (params.fecha_desde) queryParams.fecha_desde = params.fecha_desde;
      if (params.fecha_hasta) queryParams.fecha_hasta = params.fecha_hasta;
      if (params.id_estado_cita)
        queryParams.id_estado_cita = params.id_estado_cita;
      if (params.id_tipo_cita) queryParams.id_tipo_cita = params.id_tipo_cita;
      if (params.medico_id) queryParams.medico_id = params.medico_id;
      if (params.paciente_id) queryParams.paciente_id = params.paciente_id;

      return await apiService.get("/appointments/citas", queryParams);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }

  async getAppointmentById(id) {
    try {
      return await apiService.get(`/appointments/citas/${id}`);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      throw error;
    }
  }

  async createAppointment(appointmentData) {
    try {
      return await apiService.post("/appointments/citas", appointmentData);
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  }

  async updateAppointment(id, appointmentData) {
    try {
      return await apiService.put(`/appointments/citas/${id}`, appointmentData);
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  }

  async deleteAppointment(id) {
    try {
      return await apiService.delete(`/appointments/citas/${id}`);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  }

  // CONSULTAS
  async getConsultations(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;
      if (params.fecha_desde) queryParams.fecha_desde = params.fecha_desde;
      if (params.fecha_hasta) queryParams.fecha_hasta = params.fecha_hasta;
      if (params.id_estado_consulta)
        queryParams.id_estado_consulta = params.id_estado_consulta;
      if (params.medico_id) queryParams.medico_id = params.medico_id;
      if (params.paciente_id) queryParams.paciente_id = params.paciente_id;

      return await apiService.get("/appointments/consultas", queryParams);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      throw error;
    }
  }

  async getConsultationById(id) {
    try {
      return await apiService.get(`/appointments/consultas/${id}`);
    } catch (error) {
      console.error("Error fetching consultation:", error);
      throw error;
    }
  }

  async createConsultation(consultationData) {
    try {
      return await apiService.post("/appointments/consultas", consultationData);
    } catch (error) {
      console.error("Error creating consultation:", error);
      throw error;
    }
  }

  async updateConsultation(id, consultationData) {
    try {
      return await apiService.put(
        `/appointments/consultas/${id}`,
        consultationData
      );
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw error;
    }
  }

  async deleteConsultation(id) {
    try {
      return await apiService.delete(`/appointments/consultas/${id}`);
    } catch (error) {
      console.error("Error deleting consultation:", error);
      throw error;
    }
  }

  // EPISODIOS
  async getEpisodes(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;
      if (params.paciente_id) queryParams.paciente_id = params.paciente_id;

      return await apiService.get("/appointments/episodios", queryParams);
    } catch (error) {
      console.error("Error fetching episodes:", error);
      throw error;
    }
  }

  async getEpisodeById(id) {
    try {
      return await apiService.get(`/appointments/episodios/${id}`);
    } catch (error) {
      console.error("Error fetching episode:", error);
      throw error;
    }
  }

  async createEpisode(episodeData) {
    try {
      return await apiService.post("/appointments/episodios", episodeData);
    } catch (error) {
      console.error("Error creating episode:", error);
      throw error;
    }
  }

  async updateEpisode(id, episodeData) {
    try {
      return await apiService.put(`/appointments/episodios/${id}`, episodeData);
    } catch (error) {
      console.error("Error updating episode:", error);
      throw error;
    }
  }

  async deleteEpisode(id) {
    try {
      return await apiService.delete(`/appointments/episodios/${id}`);
    } catch (error) {
      console.error("Error deleting episode:", error);
      throw error;
    }
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;
