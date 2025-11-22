// 🔔 Notification Service - Gestión de notificaciones y códigos de acceso
import apiService from "./api";

class NotificationService {
  // NOTIFICACIONES
  async getNotifications(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/notifications", queryParams);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async getNotificationById(id) {
    try {
      return await apiService.get(`/notifications/${id}`);
    } catch (error) {
      console.error("Error fetching notification:", error);
      throw error;
    }
  }

  async createNotification(notificationData) {
    try {
      return await apiService.post("/notifications", notificationData);
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  async updateNotification(id, notificationData) {
    try {
      return await apiService.put(`/notifications/${id}`, notificationData);
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  }

  async deleteNotification(id) {
    try {
      return await apiService.delete(`/notifications/${id}`);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  // CÓDIGOS DE ACCESO
  async getAccessCodes(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/notifications/access-codes", queryParams);
    } catch (error) {
      console.error("Error fetching access codes:", error);
      throw error;
    }
  }

  async getAccessCodeById(id) {
    try {
      return await apiService.get(`/notifications/access-codes/${id}`);
    } catch (error) {
      console.error("Error fetching access code:", error);
      throw error;
    }
  }

  async createAccessCode(accessCodeData) {
    try {
      return await apiService.post(
        "/notifications/access-codes",
        accessCodeData
      );
    } catch (error) {
      console.error("Error creating access code:", error);
      throw error;
    }
  }

  async updateAccessCode(id, accessCodeData) {
    try {
      return await apiService.put(
        `/notifications/access-codes/${id}`,
        accessCodeData
      );
    } catch (error) {
      console.error("Error updating access code:", error);
      throw error;
    }
  }

  async deleteAccessCode(id) {
    try {
      return await apiService.delete(`/notifications/access-codes/${id}`);
    } catch (error) {
      console.error("Error deleting access code:", error);
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
