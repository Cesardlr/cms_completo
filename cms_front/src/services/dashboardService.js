// 📊 Dashboard Service - KPIs y gráficos
import apiService from "./api";

class DashboardService {
  // Obtener KPIs
  async getKPIs() {
    try {
      return await apiService.get("/dashboard/kpis");
    } catch (error) {
      console.error("Error fetching KPIs:", error);
      throw error;
    }
  }

  // Obtener datos de gráficos
  async getCharts() {
    try {
      return await apiService.get("/dashboard/charts");
    } catch (error) {
      console.error("Error fetching charts:", error);
      throw error;
    }
  }

  // Obtener todos los datos del dashboard
  async getDashboardData() {
    try {
      return await apiService.get("/dashboard");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
