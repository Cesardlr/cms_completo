const { query } = require("../config/database");

// Health check básico
const getHealth = async (req, res, next) => {
  try {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        api: "operational",
        database: "checking...",
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: "MB",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Health check de la base de datos
const getDatabaseHealth = async (req, res, next) => {
  try {
    const startTime = Date.now();

    // Verificar conexión básica
    const result = await query(
      "SELECT NOW() as current_time, version() as version"
    );
    const responseTime = Date.now() - startTime;

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        status: "connected",
        responseTime: `${responseTime}ms`,
        version: result.rows[0].version,
        currentTime: result.rows[0].current_time,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: {
        status: "disconnected",
        error: error.message,
      },
    });
  }
};

// Health check de la API
const getApiHealth = async (req, res, next) => {
  try {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      api: {
        status: "operational",
        endpoints: {
          auth: "available",
          dashboard: "available",
          users: "available",
          catalogs: "available",
          doctors: "available",
          patients: "available",
          geography: "available",
          clinics: "available",
          appointments: "available",
          files: "available",
          insurance: "available",
          notifications: "available",
          audit: "available",
        },
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      api: {
        status: "error",
        error: error.message,
      },
    });
  }
};

// Health check completo del sistema
const getSystemHealth = async (req, res, next) => {
  try {
    const startTime = Date.now();

    // Verificar base de datos
    let databaseStatus = "unknown";
    let databaseError = null;
    try {
      await query("SELECT 1");
      databaseStatus = "healthy";
    } catch (error) {
      databaseStatus = "unhealthy";
      databaseError = error.message;
    }

    const responseTime = Date.now() - startTime;

    res.json({
      status: databaseStatus === "healthy" ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        api: "operational",
        database: databaseStatus,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: "MB",
        },
      },
      errors: databaseError ? { database: databaseError } : null,
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        api: "error",
        database: "unknown",
      },
    });
  }
};

module.exports = {
  getHealth,
  getDatabaseHealth,
  getApiHealth,
  getSystemHealth,
};
