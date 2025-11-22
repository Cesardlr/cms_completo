const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");

// Import routes
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const userRoutes = require("./routes/user.routes");
const catalogRoutes = require("./routes/catalog.routes");
const doctorRoutes = require("./routes/doctor.routes");
const patientRoutes = require("./routes/patient.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const fileRoutes = require("./routes/file.routes");
const insuranceRoutes = require("./routes/insurance.routes");
const notificationRoutes = require("./routes/notification.routes");
const auditRoutes = require("./routes/audit.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev")); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check routes (sin autenticación para monitoreo)
app.use("/health", healthRoutes);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/catalogs", catalogRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit", auditRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
});

module.exports = app;
