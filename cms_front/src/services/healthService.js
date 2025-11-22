// 🏥 Health Service - Monitoreo del estado del sistema
const HEALTH_BASE_URL =
  process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

class HealthService {
  // Método para hacer peticiones directas a health endpoints
  async makeHealthRequest(endpoint) {
    try {
      const response = await fetch(`${HEALTH_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Health API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Verificar estado general del sistema
  async getSystemHealth() {
    try {
      const response = await this.makeHealthRequest("/health/system");
      return {
        status: response.status || "healthy",
        timestamp: response.timestamp || new Date().toISOString(),
        services: response.services || {},
        overall: response.status === "healthy" ? "Operational" : "Offline",
      };
    } catch (error) {
      console.error("Error checking system health:", error);
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        services: {},
        overall: "Offline",
        error: error.message,
      };
    }
  }

  // Verificar estado de la base de datos
  async getDatabaseHealth() {
    try {
      const response = await this.makeHealthRequest("/health/database");
      return {
        status: response.status || "unknown",
        timestamp: response.timestamp || new Date().toISOString(),
        details: response.database || {},
      };
    } catch (error) {
      console.error("Error checking database health:", error);
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        details: {},
        error: error.message,
      };
    }
  }

  // Verificar estado de la API
  async getApiHealth() {
    try {
      const response = await this.makeHealthRequest("/health/api");
      return {
        status: response.status || "unknown",
        timestamp: response.timestamp || new Date().toISOString(),
        details: response.api || {},
      };
    } catch (error) {
      console.error("Error checking API health:", error);
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        details: {},
        error: error.message,
      };
    }
  }

  // Verificar estado de todos los servicios
  async getAllServicesHealth() {
    try {
      const [system, database, api] = await Promise.allSettled([
        this.getSystemHealth(),
        this.getDatabaseHealth(),
        this.getApiHealth(),
      ]);

      return {
        system:
          system.status === "fulfilled"
            ? system.value
            : { status: "unhealthy", error: system.reason?.message },
        database:
          database.status === "fulfilled"
            ? database.value
            : { status: "unhealthy", error: database.reason?.message },
        api:
          api.status === "fulfilled"
            ? api.value
            : { status: "unhealthy", error: api.reason?.message },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error checking all services health:", error);
      return {
        system: { status: "unhealthy", error: error.message },
        database: { status: "unhealthy", error: error.message },
        api: { status: "unhealthy", error: error.message },
        timestamp: new Date().toISOString(),
      };
    }
  }
}

const healthService = new HealthService();
export default healthService;
