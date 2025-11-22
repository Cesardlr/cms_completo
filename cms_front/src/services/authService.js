// 🔐 Auth Service - Manejo de autenticación
import apiService from "./api";

class AuthService {
  // Login
  async login(username, password) {
    try {
      const response = await apiService.post("/auth/login", {
        username,
        password,
      });

      // Guardar token y datos del usuario
      const userData = {
        id: response.user.id,
        username: response.user.username,
        role: response.user.role,
        email: response.user.correo,
        token: response.token,
      };

      localStorage.setItem("cms_user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw new Error(error.message || "Error al iniciar sesión");
    }
  }

  // Logout
  logout() {
    localStorage.removeItem("cms_user");
  }

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem("cms_user");
    return user ? JSON.parse(user) : null;
  }

  // Verificar si está autenticado
  isAuthenticated() {
    const user = this.getCurrentUser();
    return user && user.token;
  }

  // Obtener perfil del usuario actual
  async getProfile() {
    try {
      return await apiService.get("/auth/profile");
    } catch (error) {
      throw new Error(error.message || "Error al obtener perfil");
    }
  }
}

const authService = new AuthService();
export default authService;
