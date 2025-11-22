// 👥 User Service - Gestión de usuarios
import apiService from "./api";

class UserService {
  // Obtener lista de usuarios
  async getUsers(params = {}) {
    try {
      // Solo enviar parámetros si tienen valores
      const queryParams = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.offset) queryParams.offset = params.offset;
      if (params.search) queryParams.search = params.search;

      return await apiService.get("/users", queryParams);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Obtener usuario por ID
  async getUserById(id) {
    try {
      return await apiService.get(`/users/${id}`);
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  // Crear usuario
  async createUser(userData) {
    try {
      return await apiService.post("/users", userData);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      return await apiService.put(`/users/${id}`, userData);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Actualizar contraseña
  async updatePassword(id, passwordData) {
    try {
      return await apiService.patch(`/users/${id}/password`, passwordData);
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }

  // Eliminar usuario
  async deleteUser(id) {
    try {
      return await apiService.delete(`/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
